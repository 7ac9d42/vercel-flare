/**
 * Static clock rendered on the server with a tiny inline script to keep it ticking.
 * This avoids pulling React's client runtime for the whole page.
 */
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
  const initial = format(new Date());

  const script = `
    (() => {
      const root = document.querySelector('[data-clock-root]');
      if (!root) return;
      const dateEl = root.querySelector('[data-clock-date]');
      const timeEl = root.querySelector('[data-clock-time]');
      if (!dateEl || !timeEl) return;

      const fmtDate = new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long',
      });
      const fmtTime = new Intl.DateTimeFormat('zh-CN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      });

      const tick = () => {
        const now = new Date();
        dateEl.textContent = fmtDate.format(now);
        timeEl.textContent = fmtTime.format(now);
      };

      tick();
      setInterval(tick, 1000);
    })();
  `;

  return (
    <>
      <div
        data-clock-root
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          lineHeight: 1.2,
          gap: 2,
        }}
      >
        <span data-clock-date>{initial.date}</span>
        <span data-clock-time style={{ letterSpacing: "0.08em" }}>
          {initial.time}
        </span>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
