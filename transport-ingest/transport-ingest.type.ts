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
