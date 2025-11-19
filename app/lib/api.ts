// =============================
// API CLIENT (Cookie Auth Safe)
// =============================

let API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Normalize API base URL
if (API_URL.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

// Helper to build URLs consistently
function buildUrl(path: string) {
  return `${API_URL}/api${path.startsWith("/") ? path : `/${path}`}`;
}

// Shared response handler
// Shared response handler
async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // If token invalid / expired → delete cookie
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        // Delete browser cookie
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      }
      // Redirect to login
      window.location.href = "/login";
    }

    const err: any = new Error(data.msg || data.error || "Request failed");
    err.status = res.status;
    throw err;
  }

  return data;
}

// =============================
// HTTP Methods
// =============================

// GET
export async function get(path: string) {
  const res = await fetch(buildUrl(path), {
    method: "GET",
    credentials: "include", // send cookies
  });

  return handleResponse(res);
}

// POST
export async function post(path: string, body: any) {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}

// PUT
export async function put(path: string, body: any) {
  const res = await fetch(buildUrl(path), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}

// DELETE
export async function del(path: string) {
  const res = await fetch(buildUrl(path), {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res);
}

// LOGOUT (server clears cookie)
export async function logout() {
  try {
    // Call backend logout API
    await post("/auth/logout", {});

    // Remove cookie from browser (fallback)
    if (typeof window !== "undefined") {
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

    // Redirect to login
    window.location.href = "/login";
  } catch (err) {
    // Even if backend fails, still clear cookie locally
    if (typeof window !== "undefined") {
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    window.location.href = "/login";
  }
}
