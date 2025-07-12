/**
 * Boolean logic and condition utilities
 */

/**
 * Returns true if all conditions are true
 */
export function allTrue(conditions: boolean[]): boolean {
  return conditions.every(Boolean);
}

/**
 * Returns true if at least one condition is true
 */
export function someTrue(conditions: boolean[]): boolean {
  return conditions.some(Boolean);
}

/**
 * Returns true if no conditions are true
 */
export function noneTrue(conditions: boolean[]): boolean {
  return !conditions.some(Boolean);
}

/**
 * Returns true if exactly one condition is true
 */
export function exactlyOneTrue(conditions: boolean[]): boolean {
  return conditions.filter(Boolean).length === 1;
}

/**
 * Checks if a string includes any of the provided substrings
 */
export function doesStringInclude(
  searchString: string,
  inclusionList: string[],
): boolean {
  return inclusionList.length === 0 || searchString === ''
    ? false
    : !!inclusionList.find((iteratee) => searchString.includes(iteratee));
}

/**
 * Checks if a string matches any of the provided patterns (can be strings or regex)
 */
export function doesStringMatch(
  searchString: string,
  patterns: (string | RegExp)[],
): boolean {
  return patterns.some((pattern) => {
    if (typeof pattern === 'string') {
      return searchString.includes(pattern);
    }
    return pattern.test(searchString);
  });
}

/**
 * Type guard to check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard to check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard to check if a value is an object (but not array or null)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
