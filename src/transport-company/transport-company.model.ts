/** @format */

export class TransportCompany {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public code: string,
    public country_id: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}
  static fromDb(row: TransportCompanyRow): TransportCompany {
    return new TransportCompany(
      row.id,
      row.name,
      row.slug,
      row.code,
      row.country_id,
      row.created_at,
      row.updated_at,
    );
  }
}

export interface TransportCompanyRow {
  id: string;
  name: string;
  slug: string;
  code: string;
  country_id: string;
  created_at: Date;
  updated_at: Date;
}
