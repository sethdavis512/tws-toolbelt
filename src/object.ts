/**
 * Object and data manipulation utilities
 */

/**
 * Safely executes a function and returns undefined if it throws
 */
export function getSafe<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch (e) {
    return undefined;
  }
}

/**
 * Safely retrieves a value from an object at the specified path.
 * Based on Lodash's get function
 *
 * @param obj - The object to retrieve the value from.
 * @param path - The path to the property as a string or an array of strings.
 * @param defValue - The default value to return if the property is not found.
 * @returns The value at the specified path or the default value.
 */
export function get<T, R = unknown>(
  obj: T,
  path: string | string[] | undefined,
  defValue?: R,
): R | unknown {
  // If path is not defined or has a false value
  if (!path) return undefined;

  // Convert the path to an array if it is a string
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);

  // If the path cannot be parsed, return the default value
  if (!pathArray) return defValue;

  // Use reduce to traverse the object along the path
  const result = pathArray.reduce(function (prevObj: any, key: string) {
    return prevObj && key in prevObj ? prevObj[key] : undefined;
  }, obj);

  // Return the result or the default value if the result is undefined
  return result === undefined ? defValue : result;
}

/**
 * Sets a value at the specified path in an object
 */
export function set<T extends Record<string, any>>(
  obj: T,
  path: string | string[],
  value: any,
): T {
  const pathArray = Array.isArray(path) ? path : path.split('.');
  let current: any = obj;

  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    if (!key) continue;
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = pathArray[pathArray.length - 1];
  if (lastKey) {
    current[lastKey] = value;
  }
  return obj;
}

/**
 * Creates a deep clone of an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        (cloned as any)[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

/**
 * Omits specified keys from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * Picks specified keys from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}
