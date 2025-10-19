/**
 * Checks whether a given value is a **function**.
 *
 * @summary
 * A strict type guard that returns `true` only if `value` is a callable function.  
 * It works with regular functions, arrow functions, async functions, class constructors,
 * and built-in functions like `setTimeout`.
 *
 * @typeParam T - The expected function type to narrow to (defaults to the base `Function` type).
 *
 * @param value - Any value to check.
 *
 * @returns `true` if the value is of type `"function"`, otherwise `false`.
 *
 * @remarks
 * ### Type narrowing
 * When this function returns `true`, TypeScript infers that:
 * ```ts
 * value is T
 * ```
 *  
 * This allows safe calling of the function or using its specific signature.
 *
 * ### Behavior
 * - Returns `true` for:
 *   - Normal functions: `function test() {}`
 *   - Arrow functions: `() => {}`
 *   - Async functions: `async () => {}`
 *   - Generator functions: `function* gen() {}`
 *   - Class constructors (typeof `MyClass`).
 * - Returns `false` for:
 *   - Non-callable objects or primitives.
 *   - Function-like objects that aren't real functions (e.g., `{ call() {} }`).
 *
 * ### Performance
 * - Time complexity: **O(1)**
 * - Space complexity: **O(1)**
 *
 * ### Examples
 *
 * @example
 * // Basic usage
 * isFunc(() => {});           // => true
 * isFunc(function test() {}); // => true
 * isFunc(class A {});         // => true
 * isFunc(123);                // => false
 * isFunc({});                 // => false
 *
 * @example
 * // Type narrowing
 * const fn: unknown = () => 'ok';
 * if (isFunc<() => string>(fn)) {
 *   const result = fn(); // result: string
 * }
 *
 * @example
 * // Class constructors are also "functions"
 * class MyClass {}
 * isFunc(MyClass);            // => true
 *
 * @category Type Guards
 * @public
 * @since 2.0.0
 */
export function isFunc<T extends Function = Function>(value: unknown): value is T {
	return typeof value === 'function';
}
