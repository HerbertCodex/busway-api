/** @format */

export class Mode {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public code: string,
    public description: string | null,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static fromDb(row: ModeRow): Mode {
    return new Mode(
      row.id,
      row.name,
      row.slug,
      row.code,
      row.description,
      row.created_at,
      row.updated_at,
    );
  }

  static toDTO(mode: Mode): ModeDTO {
    return {
      id: mode.id,
      name: mode.name,
      slug: mode.slug,
      code: mode.code,
      description: mode.description,
      createdAt: mode.created_at,
      updatedAt: mode.updated_at,
    };
  }
}

export interface ModeRow {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ModeDTO {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
