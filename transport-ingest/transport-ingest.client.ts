/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import { config } from '../common/config';
import { fetchJson } from '../common/fetch';
import {
  IGeoJsonFeatureCollection,
  IGeoJsonResource,
  MIMETYPE_GEOJSON,
} from './transport-ingest.type';

export async function fetchTransportGeoJsonUrl(): Promise<string> {
  const url = config.transportMetadataUrl;

  const data = await fetchJson<IGeoJsonResource[]>(url);

  const file = data.find(file => file.mimetype === MIMETYPE_GEOJSON);
  if (!file) {
    throw new APIError(ErrCode.NotFound, 'Fichier GeoJSON non trouvé');
  }

  return file.url;
}

export async function fetchTransportGeoJson(): Promise<IGeoJsonFeatureCollection> {
  const geojsonUrl = await fetchTransportGeoJsonUrl();
  const geojson = await fetchJson<IGeoJsonFeatureCollection>(geojsonUrl);
  return geojson;
}
