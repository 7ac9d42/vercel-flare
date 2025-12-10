export default function Clock() {
  // Inline, framework-free updater to keep the page static while the clock stays live.
  const script = `
    (() => {
      const start = () => {
        const root = document.querySelector('[data-clock-root]');
        if (!root) return;
        const dateEl = root.querySelector('[data-clock-date]');
        const timeEl = root.querySelector('[data-clock-time]');
        if (!dateEl || !timeEl) return;

        const fmtDate = new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          weekday: 'long',
        });
        const fmtTime = new Intl.DateTimeFormat('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        const tick = () => {
          const now = new Date();
          dateEl.textContent = fmtDate.format(now);
          timeEl.textContent = fmtTime.format(now);
        };

        tick();
        setInterval(tick, 1000);
      };

      // Defer until next frame to avoid racing React hydration.
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(start);
      } else {
        setTimeout(start, 0);
      }
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
        <span data-clock-date aria-live="polite" suppressHydrationWarning>——/——/——</span>
        <span
          data-clock-time
          style={{ letterSpacing: "0.08em" }}
          aria-live="polite"
          suppressHydrationWarning
        >
          --:--:--
        </span>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
