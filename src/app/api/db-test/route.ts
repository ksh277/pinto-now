import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';

const expected = [
  "users","products","orders","order_items","reviews","product_stats","product_likes","payments",
  "notices","inquiries","guides","faq","editor_designs","community_posts","comments","Design"
];

function parseDbName(): string | undefined {
  if (process.env.MYSQL_DB) return process.env.MYSQL_DB;
  if (process.env.DATABASE_URL) {
    const m = process.env.DATABASE_URL.match(/\/([^/?]+)(\\?.*)?$/);
    return m ? m[1] : undefined;
  }
  return undefined;
}

export async function GET(_req: NextRequest) {
  const started = Date.now();
  try {
    // a) Ping
    const ping = await query<{ two: number }[]>('SELECT 1 + 1 AS two');
    if (!ping[0] || ping[0].two !== 2) throw new Error('Ping failed');

    // b) Version
    const versionRows = await query<{ version: string }[]>('SELECT VERSION() AS version');
    const version = versionRows[0]?.version || '';

    // c) List tables
    const tablesRows = await query<{ TABLE_NAME: string }[]>(
      'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME'
    );
    const tables = tablesRows.map(r => r.TABLE_NAME);

    // d) Compare
    const missing = expected.filter(t => !tables.includes(t));

    // e) Response
    const pingMs = Date.now() - started;
    return Response.json({
      ok: missing.length === 0,
      version,
      db: parseDbName(),
      pingMs,
      tables,
      missing,
    });
  } catch (e: unknown) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
