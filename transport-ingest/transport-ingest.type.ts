/** @format */

export interface IGeoJsonResource {
  name: string;
  key: string;
  title: string;
  mimetype: string;
  size: number;
  updatedAt: string;
  url: string;
}

export interface ITransportLine {
  name: string;
  code: string;
  operator: string;
  network: string;
  mode: string;
  opening_hours: string;
  geometry: {
    type: TMultiLineString;
    coordinates: number[][][];
  };
}

export interface IGeoJsonFeatureCollection {
  type: TFeatureCollection;
  features: Array<{
    type: TFeature;
    properties: Record<string, any>;
    geometry: {
      type: string;
      coordinates: any;
    };
  }>;
}

export interface IngestTransportResponse {
  lines: ITransportLine[];
}

export type TMultiLineString = 'MultiLineString';
export type TFeatureCollection = 'FeatureCollection';
export type TFeature = 'Feature';

export const MIMETYPE_GEOJSON = 'application/geo+json';
export const GEOJSON_FEATURE_COLLECTION = 'FeatureCollection';
export const GEOJSON_FEATURE = 'Feature';
export const GEOJSON_MULTILINESTRING = 'MultiLineString';

export interface TransportLineResponse {
  results: TransportLineResult[];
}

export type TransportFeature = {
  geometry: {
    type: 'MultiLineString';
    coordinates: any;
  };
  properties: {
    code?: string;
    mode: string;
    name: string;
    network: string;
    opening_hours?: string;
    operator: string;
  };
};

export interface Commune {
  id: string;
  name: string;
  code: string;
  city_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TransportLine {
  id: string;
  name: string | null;
  line: string;
  line_number: string | null;
  opening_hours: string | null;
  mode_id: string;
  company_id: string;
  type_id: string;
  city_id: string;
  start_commune_id: string;
  end_commune_id: string;
  geometry_type: string;
  geometry_coordinates: any[];
  data_version: number;
  synced_at: Date;
  metadata_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface TransportLineResult {
  start: Commune;
  end: Commune;
  line: TransportLine;
}
