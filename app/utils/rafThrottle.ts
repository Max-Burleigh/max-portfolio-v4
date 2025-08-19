export function rafThrottle(fn: () => void): () => void;
export function rafThrottle<T>(fn: (arg: T) => void): (arg: T) => void;
export function rafThrottle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void
): (...args: TArgs) => void;
export function rafThrottle(fn: (...args: unknown[]) => void) {
  let running = false;
  return (...args: unknown[]) => {
    if (running) return;
    running = true;
    requestAnimationFrame(() => {
      (fn as (...a: unknown[]) => void)(...args);
      running = false;
    });
  };
}


