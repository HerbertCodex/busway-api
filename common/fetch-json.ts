/** @format */

import log from 'encore.dev/log';

export async function fetchJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    log.error(error, `Error fetching JSON from ${url}: ${error}`);
    throw error;
  }
}
