/** @format */

export class Commune {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public code: string,
    public city_id: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static fromDb(row: CommuneRow): Commune {
    return new Commune(
      row.id,
      row.name,
      row.slug,
      row.code,
      row.city_id,
      row.created_at,
      row.updated_at,
    );
  }
}

export interface CommuneRow {
  id: string;
  name: string;
  slug: string;
  code: string;
  city_id: string;
  created_at: Date;
  updated_at: Date;
}
