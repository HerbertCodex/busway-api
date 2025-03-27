/** @format */

import { fetchTransportGeoJson } from './transport-ingest.client';
import {
  GEOJSON_FEATURE_COLLECTION,
  GEOJSON_MULTILINESTRING,
  ITransportLine,
  TMultiLineString,
} from './transport-ingest.type';

export async function ingestTransportData(): Promise<ITransportLine[]> {
  const geojson = await fetchTransportGeoJson();

  if (geojson.type !== GEOJSON_FEATURE_COLLECTION) {
    throw new Error('Le fichier GeoJSON doit être une collection de features');
  }

  const lines: ITransportLine[] = geojson.features
    .filter(feature => {
      const isValid = feature.geometry.type === GEOJSON_MULTILINESTRING;
      if (!isValid) {
        console.warn(
          `⛔️ Feature ignorée (geometry: ${feature.geometry.type})`,
        );
      }
      return isValid;
    })
    .map(feature => {
      const { name, code, operator, network, mode, opening_hours } =
        feature.properties ?? {};
      const geometry = feature.geometry as {
        type: TMultiLineString;
        coordinates: number[][][];
      };

      return {
        name: name ?? '',
        code: code ?? '',
        operator: operator ?? '',
        network: network ?? '',
        mode: mode ?? '',
        opening_hours: opening_hours ?? '',
        geometry,
      };
    });

  return lines;
}
