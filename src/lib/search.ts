import { algoliasearch, SearchClient } from 'algoliasearch';

const APP_ID = process.env.ALGOLIA_APP_ID;
const API_KEY = process.env.ALGOLIA_API_KEY;
const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

let client: SearchClient | null = null;

function getClient() {
  if (!client) {
    if (!APP_ID || !API_KEY || !INDEX_NAME) {
      throw new Error('Algolia environment variables are not set');
    }
    client = algoliasearch(APP_ID, API_KEY);
  }
  return client;
}

export type SearchRecord = Record<string, any> & { objectID?: string };

export async function indexRecords(records: SearchRecord[]) {
  const index = getClient().initIndex(INDEX_NAME!);
  await index.saveObjects(records, { autoGenerateObjectIDIfNotExist: true });
}

export async function search(query: string) {
  if (!query) return [];
  const index = getClient().initIndex(INDEX_NAME!);
  const { hits } = await index.search(query, { hitsPerPage: 10 });
  return hits;
}
