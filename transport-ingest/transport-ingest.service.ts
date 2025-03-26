/** @format */

import { fetchTransportGeoJson } from './transport-ingest.client';
import { EGeoJSONTypes, ITransportLine } from './transport-ingest.type';

export async function ingestTransportData(): Promise<ITransportLine[]> {
  const geojson = await fetchTransportGeoJson();

  if (geojson.type !== EGeoJSONTypes.FeatureCollection) {
    throw new Error('Le fichier GeoJSON doit être une collection de features');
  }

  const lines: ITransportLine[] = geojson.features
    .filter(feature => {
      const isValid = feature.geometry.type === EGeoJSONTypes.MultiLineString;
      if (!isValid) {
        console.warn(
          `⛔️ Feature ignorée (geometry: ${feature.geometry.type})`,
        );
      }
      return isValid;
    })
    .map(feature => {
      const { line_id, name, code, operator, mode } = feature.properties ?? {};
      const geometry = feature.geometry as GeoJSON.MultiLineString;

      return {
        id: line_id ?? '',
        name: name ?? '',
        code: code ?? '',
        operator: operator ?? '',
        mode: mode ?? '',
        geometry,
      };
    });

  return lines;
}
