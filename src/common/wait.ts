/**
 * Waits asynchronously for the specified amount of time.
 *
 * @summary
 * A tiny promise-based delay utility that resolves after `timeout` milliseconds.
 * It wraps `setTimeout` in a `Promise`, making it convenient to use with
 * `async/await` or as part of larger promise chains.
 *
 * @param timeout - The delay duration in **milliseconds** before the promise resolves.
 * @defaultValue 0
 *
 * @returns A `Promise<void | true>` that settles after the given delay.
 *
 * @example
 * // Basic usage: pause for ~500 ms
 * await wait(500);
 * console.log('Half a second later…');
 *
 * @example
 * // Measure elapsed time
 * const started = Date.now();
 * await wait(1200);
 * const elapsed = Date.now() - started; // ~= 1200ms (subject to timer clamping and scheduling)
 *
 * @example
 * // Use inside a retry/backoff loop
 * for (let attempt = 1; attempt <= 5; attempt++) {
 *   try {
 *     await doWork();
 *     break;
 *   } catch (err) {
 *     // exponential backoff between attempts
 *     await wait(2 ** attempt * 100);
 *   }
 * }
 *
 * @example
 * // Parallel delays (resolve when the longest finishes)
 * await Promise.all([wait(100), wait(250), wait(50)]);
 *
 * @remarks
 * - **Timing accuracy:** JavaScript timers are **best-effort** and may be delayed
 *   by event-loop load, CPU throttling, tab being backgrounded, or platform-specific
 *   clamping. Treat `timeout` as a *minimum* delay, not an exact scheduler.
 * - **Negative or non-finite values:** Passing `<= 0`, `NaN`, or a non-finite value
 *   effectively behaves like `0` and resolves on a future macrotask tick.
 * - **Cancellation:** This helper **does not support cancellation**. If you need to
 *   abort a wait, consider a variant that accepts an `AbortSignal` and clears the
 *   timer when aborted.
 * - **Event loop semantics:** `setTimeout(0)` schedules a **macrotask**; it does not
 *   run synchronously. Code after `await wait(0)` will execute on a subsequent turn
 *   of the event loop.
 * 
 * Notes:
 * - Suitable for throttling UI interactions, pacing network retries, and writing
 *   deterministic tests (with caution re: flakiness).
 * - Keep delays small in performance-critical code paths; prefer debouncing or
 *   requestAnimationFrame for UI-animation pacing when appropriate.
 * 
 * 	Complexity:
 * - Time: **O(1)** (scheduling a single timer)
 * - Space: **O(1)** (a promise and a timer reference)
 *
 * Performance:
 * - The function allocates a single promise and a timer handle.
 * - Timer resolution is platform dependent; Node.js and browsers may clamp very
 *   small delays to a minimum threshold under load.
 *
 * Security:
 * - No I/O, side effects, or data exposure. Purely schedules a future resolution.
 * 
 * <b>Returns remarks</b>:
 * The internal promise resolves with the value `true`, but callers typically
 * use `await wait(...)` and ignore the value. If you need a strictly `void`
 * result, you can cast or ignore the resolution value.
 *
 * @category Utilities • Timing
 * @since 1.0.0
 * @see {@link https://developer.mozilla.org/docs/Web/API/setTimeout MDN: setTimeout}
 */
export async function wait(timeout: number = 0) {
	await (new Promise((resolve) => setTimeout(() => resolve(true), timeout)));
}
