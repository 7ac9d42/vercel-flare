export default function Clock() {
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
      <script src="/clock.js" defer />
    </>
  );
}
