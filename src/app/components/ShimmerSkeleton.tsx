export function OutfitCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white/80 border border-white/50 overflow-hidden animate-pulse">
      <div className="h-40 bg-gradient-to-r from-[#7C6CFF]/10 via-[#FF6B81]/10 to-[#7C6CFF]/10 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-[#7C6CFF]/10 rounded-full w-3/4" />
        <div className="h-3 bg-[#7C6CFF]/5 rounded-full w-full" />
        <div className="h-3 bg-[#7C6CFF]/5 rounded-full w-5/6" />
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="h-8 bg-[#7C6CFF]/5 rounded-xl" />
          <div className="h-8 bg-[#7C6CFF]/5 rounded-xl" />
          <div className="h-8 bg-[#7C6CFF]/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function OutfitGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <OutfitCardSkeleton key={i} />
      ))}
    </div>
  );
}
