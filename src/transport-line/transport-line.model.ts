/** @format */

export class TransportLine {
  constructor(
    public id: string,
    public slug: string,
    public line: string,
    public line_number: string | null,
    public opening_hours: string | null,
    public company_id: string,
    public transport_type_id: string,
    public city_id: string,
    public start_commune_id: string,
    public end_commune_id: string,
    public geometry: any, // Assuming geometry is a JSON object
    public data_version: number,
    public synced_at: Date,
    public metadata_id: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static fromDb(row: TransportLineRow): TransportLine {
    return new TransportLine(
      row.id,
      row.slug,
      row.line,
      row.line_number,
      row.opening_hours,
      row.company_id,
      row.transport_type_id,
      row.city_id,
      row.start_commune_id,
      row.end_commune_id,
      row.geometry,
      row.data_version,
      row.synced_at,
      row.metadata_id,
      row.created_at,
      row.updated_at,
    );
  }

  toDTO(): TransportLineDTO {
    return {
      id: this.id,
      slug: this.slug,
      line: this.line,
      lineNumber: this.line_number,
      openingHours: this.opening_hours,
      companyId: this.company_id,
      transportTypeId: this.transport_type_id,
      cityId: this.city_id,
      startCommuneId: this.start_commune_id,
      endCommuneId: this.end_commune_id,
      geometry: this.geometry,
      dataVersion: this.data_version,
      syncedAt: this.synced_at,
      metadataId: this.metadata_id,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
    };
  }
}

export interface TransportLineRow {
  id: string;
  slug: string;
  line: string;
  line_number: string | null;
  opening_hours: string | null;
  company_id: string;
  transport_type_id: string;
  city_id: string;
  start_commune_id: string;
  end_commune_id: string;
  geometry: any; // Assuming geometry is a JSON object
  data_version: number;
  synced_at: Date;
  metadata_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TransportLineDTO {
  id: string;
  slug: string;
  line: string;
  lineNumber: string | null;
  openingHours: string | null;
  companyId: string;
  transportTypeId: string;
  cityId: string;
  startCommuneId: string;
  endCommuneId: string;
  geometry: any; // Assuming geometry is a JSON object
  dataVersion: number;
  syncedAt: Date;
  metadataId: string;
  createdAt: Date;
  updatedAt: Date;
}
