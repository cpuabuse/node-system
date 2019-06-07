/*
	File: src/atomic.ts
	cpuabuse.com
*/

/**
 * Atomic operations.
 */

import { Resolve } from "./system"; /* eslint-disable-line no-unused-vars */ // ESLint type import detection bug

/**
 * Creates an instance of AtomicLock.
 * Single thread only, queue present.
 */
export class AtomicLock {
	/** Counter for current instance in queue. */
	private count: number = 0;

	/** Indicates the locked/unlocked state. */
	private locked: boolean = false;

	/** Counter for current amount of instances in a queue. */
	private maxCount: number = 0;

	/** Public getter for testing purposes. */
	public get isLocked(): boolean {
		return this.locked;
	}

	/**
	 * Lock an atomic lock.
	 *
	 * **Usage**
	 *
	 * ```typescript
	 * // Lock
	 * exampleAtomicLock.lock();
	 * ```
	 * @returns Resolves when lock succeeds
	 */
	public async lock(): Promise<void> {
		// Assign current queue counter
		var count: number = this.maxCount;

		/** Function to increment the counters in an safe manner. */
		function increment(counter: number): number {
			return counter === Number.MAX_SAFE_INTEGER ? 0 : counter + 1;
		}

		// Increment max counter
		this.maxCount = increment(this.maxCount);

		while (true) {
			/* eslint-disable-line no-constant-condition */ // Necessary to achieve the exclusive functionality
			if (this.locked) {
				await new Promise(function(resolve: Resolve): void {
					/* eslint-disable-line no-await-in-loop */ // The purpose of this file is to execute this line
					setImmediate(function(): void {
						resolve();
					});
				});
			} else if (count === this.count) {
				// Lock
				this.locked = true;

				// Increment next unlock counter
				this.count = increment(this.count);

				return;
			}
		}
	}

	/**
	 * Release atomic lock
	 *
	 * **Usage**
	 *
	 * // Release
	 * exampleAtomicLock.release();
	 */
	public release(): void {
		this.locked = false;
	}
}
