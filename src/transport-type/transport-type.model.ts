/** @format */

export class TransportType {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public code: string,
    public company_id: string,
    public mode_id: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static fromDb(row: TransportTypeRow): TransportType {
    return new TransportType(
      row.id,
      row.name,
      row.slug,
      row.code,
      row.company_id,
      row.mode_id,
      row.created_at,
      row.updated_at,
    );
  }

  static toDTO(transportType: TransportType): TransportTypeDTO {
    return {
      id: transportType.id,
      name: transportType.name,
      slug: transportType.slug,
      code: transportType.code,
      companyId: transportType.company_id,
      modeId: transportType.mode_id,
      createdAt: transportType.created_at,
      updatedAt: transportType.updated_at,
    };
  }
}

export interface TransportTypeRow {
  id: string;
  name: string;
  slug: string;
  code: string;
  company_id: string;
  mode_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TransportTypeDTO {
  id: string;
  name: string;
  slug: string;
  code: string;
  companyId: string;
  modeId: string;
  createdAt: Date;
  updatedAt: Date;
}
