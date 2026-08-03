import { Sparkles } from "lucide-react";

const ITEMS = [
  "Handmade With Love",
  "Premium Quality",
  "Unique Designs",
  "Custom Orders Available",
];

function Item({ text }: { text: string }) {
  return (
    <span className="mx-6 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-cream/90">
      <Sparkles className="h-3.5 w-3.5 text-sage-accent" aria-hidden="true" />
      {text}
    </span>
  );
}

export default function AnnouncementBar() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden bg-ink py-2.5">
      {/* Screen readers get the message list once; the scrolling copy below is purely decorative. */}
      <span className="sr-only">{ITEMS.join(" \u2014 ")}</span>
      <div aria-hidden="true" className="marquee-track">
        {loop.map((item, i) => (
          <Item key={i} text={item} />
        ))}
        {loop.map((item, i) => (
          <Item key={`dup-${i}`} text={item} />
        ))}
      </div>
    </div>
  );
}
