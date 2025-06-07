/** @format */

import { describe, expect, it, vi } from 'vitest';
import { GEOJSON_MULTILINESTRING } from './transport-line-action.model';
import { ingestTransportData } from './transport-line-action.service';

// Mock d'Encore pour éviter l’erreur ENCORE_RUNTIME_LIB
vi.mock('encore.dev', () => ({
  // Mock des fonctions ou objets utilisés par transport-ingest.service
  someFunction: vi.fn(),
}));

// Mock du config
vi.mock('../common/config', () => ({
  config: {
    transportMetadataUrl: 'https://mocked-url.com/fake.json',
  },
}));

// Mock de fetchJson
vi.mock('../common/fetch', () => ({
  fetchJson: vi.fn(async (url: string) => {
    if (url.includes('fake.json')) {
      return [
        {
          mimetype: 'application/geo+json',
          url: 'https://fake-url.test/geo.json',
        },
      ];
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [
                  [-3.99, 5.3],
                  [-3.98, 5.31],
                ],
              ],
            ],
          },
          properties: {
            name: 'Ligne test',
            code: 'L1',
            operator: 'SOTRA',
            network: 'bus',
            mode: 'bus',
            opening_hours: '06:00-22:00',
          },
        },
      ],
    };
  }),
}));

describe('ingestTransportData', () => {
  it('should fetch and return valid transport lines', async () => {
    const lines = await ingestTransportData();

    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);

    const line = lines[0];
    expect(line.geometry.type).toBe(GEOJSON_MULTILINESTRING);
    expect(typeof line.name).toBe('string');
    expect(typeof line.code).toBe('string');
    expect(typeof line.operator).toBe('string');
    expect(typeof line.network).toBe('string');
    expect(typeof line.mode).toBe('string');
    expect(typeof line.opening_hours).toBe('string');
    expect(Array.isArray(line.geometry.coordinates)).toBe(true);
  });
});
