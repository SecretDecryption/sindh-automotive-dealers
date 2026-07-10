export function SectionHeading({
  eyebrow,
  title,
  text
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow && <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-racing">{eyebrow}</p>}
      <h2 className="text-3xl font-black text-ink sm:text-4xl dark:text-white">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">{text}</p>}
    </div>
  );
}
