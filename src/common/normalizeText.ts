/** @format */

export function normalizeText(text: string): string {
  return text
    .normalize('NFD') // décompose les accents
    .replace(/[\u0300-\u036f]/g, '') // retire accents
    .replace(/['’]/g, '') // retire apostrophes
    .replace(/[^a-zA-Z0-9\s-]/g, '') // enlève ponctuation inutile
    .replace(/\s+/g, ' ') // espaces multiples
    .trim()
    .toLowerCase();
}
