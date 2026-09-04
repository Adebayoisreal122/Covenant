const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://covenant-backend-jm77.onrender.com/api"

//  "http://localhost:5000/api";

type RequestOptions = RequestInit & { auth?: boolean };

async function request(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("tcg_admin_token") : null;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export const api = {
  get: (path: string, auth = false) => request(path, { method: "GET", auth }),
  post: (path: string, body: unknown, auth = false) =>
    request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      auth,
    }),
  put: (path: string, body: unknown, auth = false) =>
    request(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      auth,
    }),
  del: (path: string, auth = false) => request(path, { method: "DELETE", auth }),
};

export default api;
