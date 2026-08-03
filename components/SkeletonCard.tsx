export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-soft">
      <div className="aspect-square animate-pulse bg-gradient-to-r from-cream-alt via-cream-deep to-cream-alt bg-[length:200%_100%] animate-shimmer" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-cream-deep" />
        <div className="h-3 w-full animate-pulse rounded-full bg-cream-deep" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-cream-deep" />
        <div className="h-9 w-full animate-pulse rounded-full bg-cream-deep" />
      </div>
    </div>
  );
}
