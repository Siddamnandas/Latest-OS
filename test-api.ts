import { leelaOSAPI } from './src/lib/api';

const testCouple = {
  partner_a_name: 'Rahul',
  partner_b_name: 'Priya',
  anniversary_date: '2020-02-14',
  city: 'Mumbai',
};

async function run() {
  try {
    const couple = await leelaOSAPI.createCouple(testCouple);
    console.log('Created couple', couple);
    const coupleId = (couple as { id: string } | undefined)?.id;
    const fetched = await leelaOSAPI.getCouple(String(coupleId));
    console.log('Fetched couple', fetched);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('API error', message);
  }
}

if (require.main === module) {
  run();
}

export { run };
