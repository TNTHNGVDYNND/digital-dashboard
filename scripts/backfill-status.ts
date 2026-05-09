import dbConnect from '../src/lib/db';
import Campaign from '../src/lib/models/Campaign';

interface AuditLog {
  startTime: string;
  endTime: string;
  matchedCount: number;
  modifiedCount: number;
  failures: string[];
}

async function backfillStatus(): Promise<AuditLog> {
  const startTime = new Date().toISOString();
  const failures: string[] = [];
  let matchedCount = 0;
  let modifiedCount = 0;

  try {
    await dbConnect();

    // Find documents where status is missing or null
    const query = { $or: [{ status: { $exists: false } }, { status: null }] };
    const matched = await Campaign.find(query).select('_id').lean();
    matchedCount = matched.length;

    if (matchedCount === 0) {
      console.log('No campaigns missing status. Backfill is up to date.');
    } else {
      console.log(`Found ${matchedCount} campaigns missing status. Backfilling...`);

      const result = await Campaign.updateMany(query, { $set: { status: 'active' } });
      modifiedCount = result.modifiedCount ?? 0;
      console.log(`Backfilled ${modifiedCount} campaigns with status: 'active'`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(message);
    console.error('Backfill failed:', message);
  }

  const endTime = new Date().toISOString();

  const auditLog: AuditLog = {
    startTime,
    endTime,
    matchedCount,
    modifiedCount,
    failures,
  };

  console.log('\n--- Backfill Audit Log ---');
  console.log(JSON.stringify(auditLog, null, 2));

  return auditLog;
}

backfillStatus()
  .then((log) => {
    if (log.failures.length > 0) {
      process.exit(1);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
