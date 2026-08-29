export function getBalancedGridClass(itemCount: number, gapClass = "gap-3"): string {
  const baseClass = `grid ${gapClass}`;

  if (itemCount <= 1) {
    return baseClass;
  }

  return `${baseClass} sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`;
}
