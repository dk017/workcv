import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const pool = new Pool({ connectionString: databaseUrl, max: 1 });
try {
  const result = await pool.query(`
    DELETE FROM workcv_funnel_events
    WHERE created_at < NOW() - INTERVAL '180 days'
  `);
  console.log(`Removed ${result.rowCount || 0} first-party funnel events older than 180 days.`);
} finally {
  await pool.end();
}
