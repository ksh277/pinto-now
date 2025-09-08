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
    
    const config: PoolOptions = {
      host: m[3],
      port: m[4] ? Number(m[4]) : 3306,
      user: m[1],
      password: m[2],
      database: m[5],
      connectTimeout: 60000,
      connectionLimit: 10,
    };
    
    // Google Cloud SQL의 경우 SSL 필수
    if (process.env.NODE_ENV === 'production' || m[3].includes('planetscale') || m[3].includes('cloud') || !m[3].includes('localhost')) {
      config.ssl = { rejectUnauthorized: false };
    }
    
    return config;
  } catch (e) {
    throw new Error('Failed to parse DATABASE_URL');
  }
}

function getConfig(): PoolOptions {
  if (process.env.DATABASE_URL) {
    return parseDatabaseUrl(process.env.DATABASE_URL);
  }
  
  const config: PoolOptions = {
    host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : (process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306),
    user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQL_DB || process.env.DB_NAME || 'pinto',
  };
  
  // 로컬 개발환경에서는 SSL 비활성화
  if (config.host === 'localhost' || config.host === '127.0.0.1') {
    // SSL 설정 제거 (로컬에서는 사용하지 않음)
  }
  
  return config;
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

export async function createConnection() {
  const config = getConfig();
  return mysql.createConnection(config);
}
