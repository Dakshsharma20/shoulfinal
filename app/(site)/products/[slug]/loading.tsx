export default function ProductDetailLoading() {
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-6 pt-8 md:px-10">
        <div className="h-4 w-32 animate-pulse rounded-full bg-cream-deep" />
      </div>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-10 md:grid-cols-2 md:gap-16 md:px-10 md:py-14">
        <div>
          <div className="aspect-square animate-pulse rounded-[22px] bg-gradient-to-r from-cream-alt via-cream-deep to-cream-alt bg-[length:200%_100%] animate-shimmer" />
          <div className="mt-4 grid grid-cols-5 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-cream-deep" />
            ))}
          </div>
        </div>
        <div>
          <div className="h-3 w-24 animate-pulse rounded-full bg-cream-deep" />
          <div className="mt-4 h-10 w-3/4 animate-pulse rounded-full bg-cream-deep" />
          <div className="mt-4 h-8 w-28 animate-pulse rounded-full bg-cream-deep" />
          <div className="mt-6 space-y-2">
            <div className="h-3 w-full animate-pulse rounded-full bg-cream-deep" />
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-cream-deep" />
            <div className="h-3 w-4/6 animate-pulse rounded-full bg-cream-deep" />
          </div>
          <div className="mt-8 h-32 animate-pulse rounded-2xl bg-cream-deep" />
          <div className="mt-8 h-12 w-48 animate-pulse rounded-full bg-cream-deep" />
        </div>
      </section>
    </div>
  );
}
