export async function apiRequest(url: string, method: string, body?: any) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error((await res.json()).error || "There is an error");
  }

  return res.json();
}
