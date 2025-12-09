"use client";

import { useEffect, useState } from "react";

function format(now: Date) {
  return {
    date: now.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
    }),
    time: now.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  };
}

export default function Clock() {
  // Avoid SSR/CSR mismatch: render only after mount when client time is known.
  const [text, setText] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    const tick = () => setText(format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!text) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        lineHeight: 1.2,
        gap: 2,
      }}
    >
      <span suppressHydrationWarning>{text.date}</span>
      <span suppressHydrationWarning style={{ letterSpacing: "0.08em" }}>
        {text.time}
      </span>
    </div>
  );
}
