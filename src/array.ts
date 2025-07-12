/**
 * Array utilities and random value generators
 */

/**
 * Picks a random element from an array
 */
export function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Builds a mock array filled with the same content
 */
export function buildMockArray<T>(content: T, num: number): T[] {
  return Array(num)
    .fill(null)
    .map(() =>
      typeof content === 'object' && content !== null
        ? JSON.parse(JSON.stringify(content)) // Deep clone objects
        : content,
    );
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

/**
 * Removes duplicates from an array
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Groups array elements by a key function
 */
export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return arr.reduce(
    (groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}

/**
 * Chunks an array into smaller arrays of specified size
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flattens a nested array by one level
 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>(
    (flat, item) =>
      Array.isArray(item) ? flat.concat(item) : flat.concat([item]),
    [],
  );
}

/**
 * Creates an array of numbers from start to end (inclusive)
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  if (step > 0) {
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
  } else if (step < 0) {
    for (let i = start; i >= end; i += step) {
      result.push(i);
    }
  }
  return result;
}
