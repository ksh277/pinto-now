import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

function parseDb() {
  const url = process.env.DATABASE_URL;
  if (url) return { url };
  const {
    DB_HOST='localhost', DB_PORT='3306',
    DB_USER='root', DB_PASSWORD='12345', DB_NAME='pinto'
  } = process.env;
  return { host: DB_HOST, port: Number(DB_PORT), user: DB_USER, password: DB_PASSWORD, database: DB_NAME };
}

export async function GET(req: NextRequest) {
  try {
    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);
    
    // 회원가입 관련 테이블들 구조 확인
    const [usersStructure] = await conn.query('DESCRIBE users');
    const [profilesStructure] = await conn.query('DESCRIBE user_profiles');  
    const [addressesStructure] = await conn.query('DESCRIBE addresses');
    const [rolesStructure] = await conn.query('DESCRIBE roles');
    const [userRolesStructure] = await conn.query('DESCRIBE user_roles');
    
    // roles 테이블 데이터 확인
    const [rolesData] = await conn.query('SELECT * FROM roles ORDER BY id');
    
    await conn.end();
    
    return NextResponse.json({ 
      ok: true, 
      tables: {
        users: usersStructure,
        user_profiles: profilesStructure,
        addresses: addressesStructure,
        roles: rolesStructure,
        user_roles: userRolesStructure
      },
      rolesData: rolesData
    });
  } catch (e: unknown) {
    console.error('Database error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}