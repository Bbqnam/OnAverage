export function getBalancedGridClass(itemCount: number, gapClass = "gap-2.5"): string {
  const baseClass = `grid ${gapClass}`;

  if (itemCount <= 1) {
    return baseClass;
  }

  if (itemCount === 2) {
    return `${baseClass} sm:grid-cols-2`;
  }

  if (itemCount === 3) {
    return `${baseClass} sm:grid-cols-3`;
  }

  if (itemCount === 4) {
    return `${baseClass} sm:grid-cols-2 lg:grid-cols-4`;
  }

  if (itemCount === 5) {
    return `${baseClass} sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5`;
  }

  return `${baseClass} sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6`;
}
