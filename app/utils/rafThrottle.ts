export const rafThrottle = <T extends (...args: any[]) => void>(fn: T): T => {
  let running = false;
  return ((...args: any[]) => {
    if (running) return;
    running = true;
    requestAnimationFrame(() => {
      fn(...args);
      running = false;
    });
  }) as T;
};


