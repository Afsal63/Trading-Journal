// =======================
// API CONFIGURATION
// =======================
let API_URL = process.env.NEXT_PUBLIC_API_URL;

// Normalize: remove trailing slash if present
if (API_URL?.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

// Hard fail if no API_URL
if (!API_URL) {
  throw new Error(
    "❌ Missing NEXT_PUBLIC_API_URL — create .env.local and restart the dev server.\nExample:\nNEXT_PUBLIC_API_URL=http://localhost:5001"
  );
}

// Shared response handler
async function handleResponse(res: Response) {
  let json: any = {};
  try {
    json = await res.json();
  } catch {
    // If not JSON, fallback generic error
    if (!res.ok) throw new Error("❌ Server returned invalid response.");
    return {};
  }

  if (!res.ok) {
    throw new Error(json.msg || json.error || "❌ Request failed");
  }

  return json;
}

// Helper to create full URL
function buildUrl(path: string) {
  return `${API_URL}/api${path.startsWith("/") ? path : `/${path}`}`;
}

// =======================
// HTTP HELPERS
// =======================

// POST
export async function post(path: string, data: any) {
  const url = buildUrl(path);
  console.log("📡 POST →", url);

  const res = await fetch(url, {
    method: "POST",
    credentials: "include", // ⬅ required for cookie auth
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

// GET
export async function get(path: string) {
  const url = buildUrl(path);
  console.log("📡 GET →", url);

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(res);
}

// PUT
export async function put(path: string, data: any) {
  const url = buildUrl(path);
  console.log("📡 PUT →", url);

  const res = await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

// DELETE
export async function del(path: string) {
  const url = buildUrl(path);
  console.log("📡 DELETE →", url);

  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res);
}

// ✅ LOGOUT helper (calls backend to clear cookie)
export async function logout() {
  return post("/auth/logout", {});
}
