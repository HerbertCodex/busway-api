/** @format */

export class Metadata {
  constructor(
    public id: string,
    public last_version: number,
    public last_updated_at: Date,
  ) {}

  static fromDb(row: MetadataRow): Metadata {
    return new Metadata(row.id, row.last_version, row.last_updated_at);
  }

  toDTO(): MetadataDTO {
    return {
      id: this.id,
      lastVersion: this.last_version,
      lastUpdatedAt: this.last_updated_at,
    };
  }
}

export interface MetadataRow {
  id: string;
  last_version: number;
  last_updated_at: Date;
}

export interface MetadataDTO {
  id: string;
  lastVersion: number;
  lastUpdatedAt: Date;
}
