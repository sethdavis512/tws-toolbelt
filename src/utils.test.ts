import { describe, it, expect } from 'vitest';
import * as math from './math.js';
import * as format from './format.js';
import * as object from './object.js';
import * as array from './array.js';
import * as random from './random.js';
import * as guards from './guards.js';
import * as string from './string.js';
import { debounce, throttle, memoize } from './utils.js';

describe('Math utilities', () => {
  it('should perform basic arithmetic operations', () => {
    expect(math.add(2, 3)).toBe(5);
    expect(math.multiply(4, 5)).toBe(20);
    expect(math.subtract(10, 3)).toBe(7);
    expect(math.divide(15, 3)).toBe(5);
  });

  it('should work with function composition', () => {
    expect(math.double(5)).toBe(10);
    expect(math.triple(4)).toBe(12);
    expect(math.multiply6(6)).toBe(36);
  });

  it('should clamp values correctly', () => {
    expect(math.clamp(5, 1, 10)).toBe(5);
    expect(math.clamp(-5, 1, 10)).toBe(1);
    expect(math.clamp(15, 1, 10)).toBe(10);
  });
});

describe('Format utilities', () => {
  it('should format currency correctly', () => {
    expect(format.formatToDollar(1234.5)).toBe('$1,234.50');
  });

  it('should generate random dates', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-12-31');
    const randomDate = format.getRandomDate(start, end);

    expect(randomDate.getTime()).toBeGreaterThanOrEqual(start.getTime());
    expect(randomDate.getTime()).toBeLessThanOrEqual(end.getTime());
  });
});

describe('Object utilities', () => {
  it('should safely get values from objects', () => {
    const obj = { a: { b: { c: 'value' } } };
    expect(object.get(obj, 'a.b.c')).toBe('value');
    expect(object.get(obj, 'a.b.x', 'default')).toBe('default');
  });

  it('should set values in objects', () => {
    const obj = {};
    object.set(obj, 'a.b.c', 'value');
    expect(object.get(obj, 'a.b.c')).toBe('value');
  });

  it('should pick and omit keys correctly', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(object.pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    expect(object.omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
  });
});

describe('Array utilities', () => {
  it('should shuffle arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = array.shuffle(arr);
    expect(shuffled).toHaveLength(5);
    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('should remove duplicates', () => {
    expect(array.unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it('should chunk arrays', () => {
    expect(array.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should create ranges', () => {
    expect(array.range(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(array.range(5, 1, -1)).toEqual([5, 4, 3, 2, 1]);
  });
});

describe('Random utilities', () => {
  it('should generate unique IDs', () => {
    const id1 = random.getUniqueId();
    const id2 = random.getUniqueId();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^id-[A-Za-z0-9]{8}$/);
  });

  it('should generate random booleans', () => {
    const alwaysTrue = random.getRandomBool(100);
    const alwaysFalse = random.getRandomBool(0);
    expect(alwaysTrue).toBe(true);
    expect(alwaysFalse).toBe(false);
  });

  it('should generate UUIDs', () => {
    const uuid = random.uuid();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});

describe('Guard utilities', () => {
  it('should check all conditions', () => {
    expect(guards.allTrue([true, true, true])).toBe(true);
    expect(guards.allTrue([true, false, true])).toBe(false);
  });

  it('should check some conditions', () => {
    expect(guards.someTrue([false, true, false])).toBe(true);
    expect(guards.someTrue([false, false, false])).toBe(false);
  });

  it('should work as type guards', () => {
    expect(guards.isString('hello')).toBe(true);
    expect(guards.isString(123)).toBe(false);
    expect(guards.isNumber(123)).toBe(true);
    expect(guards.isNumber('123')).toBe(false);
  });
});

describe('String utilities', () => {
  it('should capitalize strings', () => {
    expect(string.capitalize('hello')).toBe('Hello');
    expect(string.capitalize('HELLO')).toBe('HELLO');
  });

  it('should convert case', () => {
    expect(string.camelCase('hello world')).toBe('helloWorld');
    expect(string.kebabCase('helloWorld')).toBe('hello-world');
    expect(string.snakeCase('helloWorld')).toBe('hello_world');
    expect(string.pascalCase('hello world')).toBe('HelloWorld');
  });

  it('should truncate strings', () => {
    expect(string.truncate('hello world', 8)).toBe('hello...');
    expect(string.truncate('hello', 10)).toBe('hello');
  });

  it('should generate slugs', () => {
    expect(string.slugify('Hello World!')).toBe('hello-world');
  });

  it('should mask strings', () => {
    expect(string.maskString('1234567890', 2, 2)).toBe('12******90');
  });
});

describe('General utilities', () => {
  it('should debounce function calls', async () => {
    let callCount = 0;
    const debouncedFn = debounce(() => {
      callCount++;
    }, 100);

    // Call multiple times quickly
    debouncedFn();
    debouncedFn();
    debouncedFn();

    // Should only be called once after delay
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(callCount).toBe(1);
  });

  it('should throttle function calls', () => {
    let callCount = 0;
    const throttledFn = throttle(() => {
      callCount++;
    }, 100);

    // Call multiple times quickly
    throttledFn();
    throttledFn();
    throttledFn();

    // Should only be called once immediately
    expect(callCount).toBe(1);
  });

  it('should memoize function results', () => {
    let callCount = 0;
    const expensiveFn = memoize((x: number) => {
      callCount++;
      return x * 2;
    });

    expect(expensiveFn(5)).toBe(10);
    expect(expensiveFn(5)).toBe(10); // Should use cached result
    expect(callCount).toBe(1); // Function should only be called once
  });
});
