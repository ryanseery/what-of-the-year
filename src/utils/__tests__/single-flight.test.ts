import { describe, expect, it } from "bun:test";

import { singleFlight } from "utils/single-flight";

/** A promise plus the handles to settle it, so the test controls the flight window. */
function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("singleFlight", () => {
  it("runs once while a call is in flight and hands both callers the same promise", async () => {
    const first = deferred();
    const runs: number[] = [];
    const run = () => {
      runs.push(runs.length);
      return first.promise;
    };
    const flight = singleFlight<void>();

    const a = flight(run);
    const b = flight(run);

    expect(runs).toEqual([0]);
    expect(b).toBe(a);

    first.resolve();
    await a;
  });

  it("runs again once the previous call has settled", async () => {
    const runs: number[] = [];
    const run = () => {
      runs.push(runs.length);
      return Promise.resolve();
    };
    const flight = singleFlight<void>();

    await flight(run);
    await flight(run);

    expect(runs).toEqual([0, 1]);
  });

  it("releases the slot when the call rejects, so the next caller retries", async () => {
    const failed = deferred();
    const runs: number[] = [];
    const run = () => {
      runs.push(runs.length);
      return runs.length === 1 ? failed.promise : Promise.resolve();
    };
    const flight = singleFlight<void>();

    const first = flight(run);
    failed.reject(new Error("sign-in failed"));
    await expect(first).rejects.toThrow("sign-in failed");

    await flight(run);

    expect(runs).toEqual([0, 1]);
  });
});
