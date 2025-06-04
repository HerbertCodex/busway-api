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

  static toDTO(commune: CommuneRow): CommuneDTO {
    return {
      id: commune.id,
      name: commune.name,
      slug: commune.slug,
      code: commune.code,
      cityId: commune.city_id,
      createdAt: commune.created_at,
      updatedAt: commune.updated_at,
    };
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

export interface CommuneDTO {
  id: string;
  name: string;
  slug: string;
  code: string;
  cityId: string;
  createdAt: Date;
  updatedAt: Date;
}
