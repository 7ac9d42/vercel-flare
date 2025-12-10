(() => {
  const BOOT_FLAG = "data-clock-booted";

  const start = () => {
    const root = document.querySelector("[data-clock-root]");
    if (!root || root.getAttribute(BOOT_FLAG) === "true") return;

    const dateEl = root.querySelector("[data-clock-date]");
    const timeEl = root.querySelector("[data-clock-time]");
    if (!dateEl || !timeEl) return;

    root.setAttribute(BOOT_FLAG, "true");

    const fmtDate = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
    });
    const fmtTime = new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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

  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();
