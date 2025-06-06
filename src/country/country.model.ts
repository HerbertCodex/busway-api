/** @format */

export class Country {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public code_iso: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static fromDb(row: CountryRow): Country {
    return new Country(
      row.id,
      row.name,
      row.slug,
      row.code_iso,
      row.created_at,
      row.updated_at,
    );
  }

  static toDTO(country: CountryRow): CountryDTO {
    return {
      id: country.id,
      name: country.name,
      slug: country.slug,
      codeIso: country.code_iso,
      createdAt: country.created_at,
      updatedAt: country.updated_at,
    };
  }
}

export interface CountryRow {
  id: string;
  name: string;
  slug: string;
  code_iso: string;
  created_at: Date;
  updated_at: Date;
}

export interface CountryDTO {
  id: string;
  name: string;
  slug: string;
  codeIso: string;
  createdAt: Date;
  updatedAt: Date;
}
