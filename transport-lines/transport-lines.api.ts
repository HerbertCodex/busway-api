/** @format */

import { api } from 'encore.dev/api';
import { getTransportLinesBetween } from '../drizzle/queries/transport-lines';
import {
  IIngestTransportResponse,
  TransportLineResponse,
} from './transport-lines.model';
import {
  ingestAllFeatures,
  ingestTransportData,
} from './transport-lines.service';

interface Params {
  from: string;
  to: string;
}

export const ingestTransportPreview = api(
  {
    method: 'GET',
    path: '/transport-ingest',
    expose: true,
  },
  async (): Promise<IIngestTransportResponse> => {
    const lines = await ingestTransportData();
    return { lines };
  },
);

export const ingestTransportAction = api(
  { method: 'POST', path: '/transport-ingest' },
  async () => {
    await ingestAllFeatures('default');
    return { status: 'ok' };
  },
);

export const getLines = api(
  {
    method: 'GET',
    path: '/get-lines',
  },
  async (params: Params): Promise<TransportLineResponse> => {
    const lines = await getTransportLinesBetween(params.from, params.to);
    return { results: lines };
  },
);
