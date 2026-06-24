/**
 * Calculates the Euclidean distance between two 2D points.
 */
export const calculateDistance = (
  a: { x: number; y: number },
  b: { x: number; y: number }
): number => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculates a dynamic value relative to distance for typography pressure mapping.
 */
export const getProportionalAttr = (
  distance: number,
  maxDist: number,
  minVal: number,
  maxVal: number
): number => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

/**
 * Creates a debounced function that delays invoking the func argument.
 */
export const debounce = <T extends (...args: unknown[]) => void>(func: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Finds the closest edge of a rectangle (top or bottom) to a given coordinate.
 */
export const findClosestEdge = (
  mouseX: number,
  mouseY: number,
  width: number,
  height: number
): 'top' | 'bottom' => {
  const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
  const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
};

