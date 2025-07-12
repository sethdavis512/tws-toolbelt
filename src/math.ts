/**
 * Mathematical utilities and function composition helpers
 */

// Building-blocks to use for composition
export const double = (x: number): number => x + x;
export const triple = (x: number): number => 3 * x;
export const quadruple = (x: number): number => 4 * x;

/**
 * Function composition enabling pipe functionality
 * Takes a series of functions and returns a new function that applies them in sequence
 */
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (input: T): T =>
    fns.reduce((acc, fn) => fn(acc), input);

// Composed functions for multiplication of specific values
export const multiply6 = pipe(double, triple);
export const multiply9 = pipe(triple, triple);
export const multiply16 = pipe(quadruple, quadruple);
export const multiply24 = pipe(double, triple, quadruple);

/**
 * Basic arithmetic operations
 */
export const add = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const multiply = (a: number, b: number): number => a * b;
export const divide = (a: number, b: number): number => a / b;

/**
 * Returns a random number between min and max (inclusive)
 */
export const randomBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Clamps a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
