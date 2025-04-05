/** @format */

import { describe, expect, it } from 'vitest';
import { Commune } from './commune.model';
import CommuneService from './commune.service';

describe('CommuneService', () => {
  it('should get all communes', async () => {
    const communes = await CommuneService.getAllCommunes({});

    expect(communes).toHaveLength(7);
  });

  it('should get a commune by slug', async () => {
    const commune = await CommuneService.getCommuneBySlug('abobo');
    expect(commune).toBeInstanceOf(Commune);
    expect(commune.name).toBe('Abobo');
  });
});
