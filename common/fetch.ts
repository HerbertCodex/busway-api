/** @format */

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} - ${url}`);
  }
  return (await response.json()) as T;
}
