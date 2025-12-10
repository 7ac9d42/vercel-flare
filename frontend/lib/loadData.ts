import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

export interface AppLink {
  name: string;
  link: string;
  icon?: string;
  desc?: string;
}

export interface BookmarkCategory {
  id: string | number;
  title: string;
}

export interface BookmarkLink {
  name: string;
  link: string;
  icon?: string;
  category?: string | number;
}

export interface NavigationData {
  apps: AppLink[];
  categories: BookmarkCategory[];
  bookmarks: BookmarkLink[];
  footer?: {
    enabled: boolean;
    text: string;
  };
  site?: {
    title: string;
    description?: string;
    showClock: boolean;
    openAppNewTab: boolean;
    openBookmarkNewTab: boolean;
  };
}

const ROOT = path.resolve(process.cwd(), "..");
const APPS_FILE = path.join(ROOT, "app", "apps.yml");
const BOOKMARKS_FILE = path.join(ROOT, "app", "bookmarks.yml");
const CONFIG_FILE = path.join(ROOT, "app", "config.yml");

function pickString(obj: Record<string, unknown> | null | undefined, keys: string[]): string | null {
  if (!obj) return null;
  for (const key of keys) {
    const hit = obj[key];
    if (typeof hit === "string" && hit.trim().length > 0) {
      return hit.trim();
    }
  }
  return null;
}

function pickBoolean(
  obj: Record<string, unknown> | null | undefined,
  keys: string[],
  defaultValue: boolean,
): boolean {
  if (!obj) return defaultValue;
  for (const key of keys) {
    if (key in obj) {
      return obj[key] !== false;
    }
  }
  return defaultValue;
}

async function readYaml<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return yaml.load(raw) as T;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      (error as { code?: string }).code === "ENOENT"
    ) {
      return null;
    }
    throw error;
  }
}

function asAppLinks(value: unknown): AppLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const entry = item as Record<string, unknown>;
      if (typeof entry.name !== "string" || typeof entry.link !== "string") {
        return null;
      }
      return {
        name: entry.name,
        link: entry.link,
        icon: typeof entry.icon === "string" ? entry.icon : undefined,
        desc: typeof entry.desc === "string" ? entry.desc : undefined,
      };
    })
    .filter(Boolean) as AppLink[];
}

function asCategories(value: unknown): BookmarkCategory[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const entry = item as Record<string, unknown>;
      if (entry.title === undefined) return null;
      const title = typeof entry.title === "string" ? entry.title : String(entry.title);
      const id = entry.id ?? title;
      return {
        id: typeof id === "string" || typeof id === "number" ? id : String(id),
        title,
      };
    })
    .filter(Boolean) as BookmarkCategory[];
}

function asBookmarkLinks(value: unknown): BookmarkLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const entry = item as Record<string, unknown>;
      if (typeof entry.name !== "string" || typeof entry.link !== "string") return null;
      const category = entry.category;
      return {
        name: entry.name,
        link: entry.link,
        icon: typeof entry.icon === "string" ? entry.icon : undefined,
        category:
          typeof category === "string" || typeof category === "number"
            ? category
            : category !== undefined
              ? String(category)
              : undefined,
      };
    })
    .filter(Boolean) as BookmarkLink[];
}

export async function loadData(): Promise<NavigationData> {
  const appsYaml = await readYaml<{ links?: unknown }>(APPS_FILE);
  const bookmarksYaml = await readYaml<{ categories?: unknown; links?: unknown }>(BOOKMARKS_FILE);
  const configYaml = await readYaml<Record<string, unknown>>(CONFIG_FILE);

  return {
    apps: asAppLinks(appsYaml?.links),
    categories: asCategories(bookmarksYaml?.categories),
    bookmarks: asBookmarkLinks(bookmarksYaml?.links),
    footer: {
      enabled: Boolean((configYaml?.footer as { enabled?: boolean } | undefined)?.enabled),
      text:
        typeof (configYaml?.footer as { text?: unknown } | undefined)?.text === "string" &&
        (((configYaml?.footer as { text?: string } | undefined)?.text?.trim()?.length ?? 0) > 0)
          ? ((configYaml?.footer as { text?: string } | undefined)?.text ?? "").trim()
          : "由 Flare ❤️ 驱动",
    },
    site: {
      title: pickString(configYaml, ["title", "Title", "greetings", "Greetings"]) ?? "Flare 导航",
      description:
        pickString(configYaml, ["description", "desc", "subtitle", "tagline"]) ??
        "Flare 导航 - 简洁的起始页，快速打开常用站点和应用。",
      showClock: pickBoolean(configYaml, ["show-clock", "ShowDateTime"], true),
      openAppNewTab: pickBoolean(configYaml, ["open-app-new-tab", "OpenAppNewTab"], false),
      openBookmarkNewTab: pickBoolean(configYaml, ["open-bookmark-new-tab", "OpenBookmarkNewTab"], false),
    },
  };
}
