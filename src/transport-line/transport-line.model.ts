/** @format */

export type TMultiLineString = 'MultiLineString';
export type TFeatureCollection = 'FeatureCollection';
export type TFeature = 'Feature';
export type TProperties = {
  code?: string;
  mode: string;
  name: string;
  network: string;
  opening_hours?: string;
  operator: string;
};

export type TransportGeometry = {
  type: string;
  coordinates: number[][][];
};
export type TTransportFeature = {
  geometry: TransportGeometry;
  properties: TProperties;
};

export const MIMETYPE_GEOJSON = 'application/geo+json';
export const GEOJSON_FEATURE_COLLECTION = 'FeatureCollection';
export const GEOJSON_FEATURE = 'Feature';
export const GEOJSON_MULTILINESTRING = 'MultiLineString';

export interface Params {
  from: string;
  to: string;
}

export interface IGeoJsonResource {
  name: string;
  key: string;
  title: string;
  mimetype: string;
  size: number;
  updatedAt: string;
  url: string;
}

export class TransportLine {
  constructor(
    public id: string,
    public line: string,
    public slug: string,
    public line_number: string | null,
    public opening_hours: string | null,
    public company_id: string,
    public transport_type_id: string,
    public city_id: string,
    public start_commune_id: string,
    public end_commune_id: string,
    public geometry: TransportGeometry,
    public data_version: number,
    public synced_at: Date,
    public metadata_id: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}
}

export interface ITransportLineDownloadResponse {
  name: string;
  code: string;
  operator: string;
  network: string;
  mode: string;
  opening_hours: string;
  geometry: TransportGeometry;
}

export interface IGeoJsonFeatureCollection {
  type: TFeatureCollection;
  features: Array<{
    type: TFeature;
    properties: Record<string, string>;
    geometry: TransportGeometry;
  }>;
}

export interface IIngestTransportResponse {
  lines: ITransportLineDownloadResponse[];
}

export interface TransportLineResponse {
  results: TransportLineResult[];
}

export interface ICommune {
  id: string;
  name: string;
  code: string;
  city_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TransportLineResult {
  start: ICommune;
  end: ICommune;
  line: ITransportLine;
}

export interface ITransportLine {
  id: string;
  line: string;
  slug: string;
  line_number: string | null;
  opening_hours: string | null;
  company_id: string;
  transport_type_id: string;
  city_id: string;
  start_commune_id: string;
  end_commune_id: string;
  geometry: TransportGeometry;
  data_version: number;
  synced_at: Date;
  metadata_id: string;
  created_at: Date;
  updated_at: Date;
}
