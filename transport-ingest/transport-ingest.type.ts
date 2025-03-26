/** @format */

import * as GeoJSON from 'geojson';

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
  id: string;
  name: string;
  code: string;
  operator: string;
  mode: string;
  geometry: GeoJSON.MultiLineString;
}

export interface IGeoJsonFeatureCollection {
  type: EGeoJSONTypes.FeatureCollection;
  features: Array<{
    type: EGeoJSONTypes.Feature;
    properties: Record<string, any>;
    geometry: GeoJSON.Geometry;
  }>;
}

export enum EMimetype {
  GeoJson = 'application/geo+json',
  Csv = 'text/csv',
  Json = 'application/json',
  Xml = 'application/xml',
  Pdf = 'application/pdf',
}

export enum EGeoJSONTypes {
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  Polygon = 'Polygon',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection',
  Feature = 'Feature',
  FeatureCollection = 'FeatureCollection',
}
