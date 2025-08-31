// scripts: run `npm i mysql2` if not installed

import mysql, { Pool, PoolOptions, RowDataPacket } from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var __PintoPool: Pool | undefined;
}

function parseDatabaseUrl(url: string) {
  try {
    const m = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:/]+)(?::(\d+))?\/([^?]+)(\?.*)?$/);
    if (!m) throw new Error('Invalid DATABASE_URL');
    return {
      host: m[3],
      port: m[4] ? Number(m[4]) : 3306,
      user: m[1],
      password: m[2],
      database: m[5],
    };
  } catch (e) {
    throw new Error('Failed to parse DATABASE_URL');
  }
}

function getConfig(): PoolOptions {
  if (process.env.DATABASE_URL) {
    return parseDatabaseUrl(process.env.DATABASE_URL);
  }
  return {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || 'pinto',
  };
}

export function getPool(): Pool {
  if (!globalThis.__PintoPool) {
    globalThis.__PintoPool = mysql.createPool(getConfig());
  }
  return globalThis.__PintoPool;
}

export async function query<T = RowDataPacket[]>(sql: string, params?: any[]): Promise<T> {
  const pool = getPool();
  const [rows] = await pool.query(sql, params);
  return rows as T;
}
