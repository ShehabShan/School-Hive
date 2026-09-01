export const waitForToken = (timeout = 5000) => {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      const token = localStorage.getItem("access-token");
      if (token) return resolve(token);
      if (Date.now() - start > timeout) return resolve(null);
      setTimeout(tick, 100);
    };
    tick();
  });
};