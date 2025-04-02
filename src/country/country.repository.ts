/** @format */

import { Country } from './country.model';

export interface ICountryRepository {
  getAllCountries(): Promise<Country[]>;
  getCountryById(id: string): Promise<Country>;
  getCountryByCode(code: string): Promise<Country>;
  createCountry(
    country: Omit<Country, 'id' | 'code' | 'created_at' | 'updated_at'>,
  ): Promise<Country>;
}
