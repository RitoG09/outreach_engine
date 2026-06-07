import axios from "axios";

export async function retry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let error;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      error = err;
      let delayMs = 1000 * (i + 1);

      // Handle Axios rate limiting (HTTP 429) errors specifically
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        const retryAfter = err.response.headers["retry-after"];
        if (retryAfter) {
          const seconds = parseInt(retryAfter, 10);
          delayMs = !isNaN(seconds) ? seconds * 1000 : 5000;
        } else {
          delayMs = 5000; // default 5 seconds backoff for rate limit
        }
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw error;
}
