/* eslint-disable @next/next/no-img-element */
import { loadData } from "@/lib/loadData";
import Clock from "@/components/Clock";
import styles from "./page.module.css";

const ICON_BASE = "/icons";

// Ensure this route is fully static and pre-rendered during build.
export const dynamic = "force-static";
export const revalidate = false;

function normalizeIconName(raw: string): string {
  return raw
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function iconUrl(icon?: string): string | null {
  if (!icon) return null;
  return `${ICON_BASE}/${normalizeIconName(icon)}.svg`;
}

function Icon({ name, label }: { name?: string; label: string }) {
  const url = iconUrl(name);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={`${label} 图标`}
      title={label}
      className={styles.icon}
      loading="lazy"
    />
  );
}

export default async function Home() {
  const { apps, categories, bookmarks, footer, site } = await loadData();

  const categoryOrder = categories.map((category) => String(category.id));
  const categoryMap = new Map(categories.map((category) => [String(category.id), category]));
  const grouped = new Map<string, typeof bookmarks>();
  categoryOrder.forEach((id) => grouped.set(id, []));
  const uncategorized: typeof bookmarks = [];

  bookmarks.forEach((link) => {
    const key = link.category !== undefined ? String(link.category) : undefined;
    if (key && grouped.has(key)) {
      grouped.get(key)!.push(link);
    } else {
      uncategorized.push(link);
    }
  });

  const bookmarkGroups = categoryOrder
    .map((id) => {
      const category = categoryMap.get(id);
      const links = grouped.get(id) ?? [];
      if (!category || links.length === 0) return null;
      return { id, category, links };
    })
    .filter(Boolean) as { id: string; category: (typeof categories)[number]; links: typeof bookmarks }[];

  const hasUncategorized = uncategorized.length > 0;

  return (
    <main className={styles.page}>
      <div className={styles.topLine} />
      <div className={styles.topRow}>
        <div className={styles.title}>{site?.title ?? "Flare 导航"}</div>
        {site?.showClock !== false && (
          <div className={styles.time}>
            <Clock />
          </div>
        )}
      </div>

      <section className={styles.section} aria-labelledby="apps-heading">
        <h2 id="apps-heading">应用</h2>
        {apps.length === 0 ? (
          <p className={styles.empty}>暂无应用。请先填充 app/apps.yml 后重新构建。</p>
        ) : (
          <ul className={styles.appGrid}>
            {apps.map((item) => (
              <li key={item.name} className={styles.appItem}>
                <a
                  className={styles.blockLink}
                  href={item.link}
                  title={item.desc ?? item.name}
                  target={site?.openAppNewTab ? "_blank" : undefined}
                  rel={site?.openAppNewTab ? "noreferrer" : undefined}
                >
                  <Icon name={item.icon} label={item.name} />
                  <div className={styles.appText}>
                    <div className={styles.appTitle}>{item.name}</div>
                    {item.desc && <p>{item.desc}</p>}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section} aria-labelledby="bookmarks-heading">
        <h2 id="bookmarks-heading">书签</h2>
        {bookmarkGroups.length === 0 && !hasUncategorized ? (
          <p className={styles.empty}>暂无书签。请更新 app/bookmarks.yml。</p>
        ) : (
          <div className={styles.bookmarks}>
            {bookmarkGroups.map(({ id, category, links }) => (
              <div key={id} className={styles.bookmarkGroup}>
                <h3>{category.title}</h3>
                <ul className={styles.links}>
                  {links.map((link) => (
                    <li key={`${id}-${link.name}`} className={styles.linkItem}>
                      <a
                        className={styles.blockLink}
                        href={link.link}
                        title={link.name}
                        target={site?.openBookmarkNewTab ? "_blank" : undefined}
                        rel={site?.openBookmarkNewTab ? "noreferrer" : undefined}
                      >
                        <Icon name={link.icon} label={link.name} />
                        <span className={styles.linkTitle}>{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {hasUncategorized && (
              <div className={styles.bookmarkGroup}>
                <h3>未分类</h3>
                <ul className={styles.links}>
                  {uncategorized.map((link) => (
                    <li key={`uncategorized-${link.name}`} className={styles.linkItem}>
                      <a
                        className={styles.blockLink}
                        href={link.link}
                        title={link.name}
                        target={site?.openBookmarkNewTab ? "_blank" : undefined}
                        rel={site?.openBookmarkNewTab ? "noreferrer" : undefined}
                      >
                        <Icon name={link.icon} label={link.name} />
                        <span className={styles.linkTitle}>{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {footer?.enabled && (
        <div className={styles.footer}>
          {footer.text.replace("Flare", "").trim().length === 0 ? (
            <>
              由 <span className={styles.heart}>Flare</span> 驱动
            </>
          ) : (
            footer.text
          )}
        </div>
      )}
    </main>
  );
}
