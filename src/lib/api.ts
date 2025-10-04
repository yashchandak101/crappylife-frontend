// src/lib/api.ts
export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options)
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`)
  }
  return res.json()
}

