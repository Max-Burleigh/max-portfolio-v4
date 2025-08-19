export const rafThrottle = <T extends (...args: unknown[]) => void>(fn: T): T => {
  let running = false;
  return ((...args: unknown[]) => {
    if (running) return;
    running = true;
    requestAnimationFrame(() => {
      fn(...args as Parameters<T>);
      running = false;
    });
  }) as T;
};


