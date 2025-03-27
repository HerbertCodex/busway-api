/** @format */

import { api } from 'encore.dev/api';
import { ingestTransportData } from './transport-ingest.service';
import { IngestTransportResponse } from './transport-ingest.type';

export const ingestTransportPreview = api(
  {
    method: 'GET',
    path: '/transport-ingest',
    expose: true,
  },
  async (): Promise<IngestTransportResponse> => {
    const lines = await ingestTransportData();
    return { lines };
  },
);

export const ingestTransportAction = api(
  { method: 'POST', path: '/transport-ingest' },
  async ({ dryRun }: { dryRun?: boolean }): Promise<{ message: string }> => {
    const lines = await ingestTransportData();

    if (dryRun) {
      console.log(`🚧 dryRun activé – ${lines.length} lignes détectées`);
      return {
        message: `Dry run : ${lines.length} lignes prêtes à être importées`,
      };
    }

    // TODO: insérer les lignes en base (quand modèle prêt)
    // await insertTransportLines(lines);

    console.log(`✅ ${lines.length} lignes importées (simulation)`);
    return {
      message: `${lines.length} lignes importées avec succès`,
    };
  },
);
