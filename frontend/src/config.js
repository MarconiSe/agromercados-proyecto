export const API_URL =
    location.hostname === "localhost"
        ? "http://localhost:5132"
        : new URL("..", import.meta.url).href.replace(/\/$/, "");
