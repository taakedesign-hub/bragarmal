/**
 * Full-bleed pause in a long article — a single large statement, set off from
 * the surrounding prose so a page of running text doesn't read as one block.
 */
export default function StatementBreak({ kicker, children, dark = false }) {
  return (
    <section
      className="w-full py-20 md:py-28 px-6"
      style={{
        background: dark ? "var(--ink)" : "var(--bg-alt, #faf7f1)",
      }}
    >
      <div className="max-w-[820px] mx-auto text-center">
        {kicker && (
          <div
            className="font-mono-ui text-[11px] tracking-[0.2em] uppercase"
            style={{ color: dark ? "rgba(255,255,255,0.55)" : "var(--ink-mute)" }}
          >
            {kicker}
          </div>
        )}
        <p
          className="font-serif-display italic leading-[1.3] mt-5 text-2xl md:text-4xl"
          style={{ color: dark ? "white" : "var(--ink)" }}
        >
          {children}
        </p>
      </div>
    </section>
  );
}
