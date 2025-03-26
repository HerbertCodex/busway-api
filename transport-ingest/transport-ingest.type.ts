/** @format */

export interface GeoJsonResource {
  name: string;
  key: string;
  title: string;
  mimetype: string;
  size: number;
  updatedAt: string;
  url: string;
}

export enum Mimetype {
  GeoJson = 'application/geo+json',
  Csv = 'text/csv',
  Json = 'application/json',
  Xml = 'application/xml',
  Pdf = 'application/pdf',
}
