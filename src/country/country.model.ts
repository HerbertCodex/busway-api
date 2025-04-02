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
}

export interface CountryRow {
  id: string;
  name: string;
  slug: string;
  code_iso: string;
  created_at: Date;
  updated_at: Date;
}
