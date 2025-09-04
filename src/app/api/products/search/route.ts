import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() ?? '';
    if (!q) return NextResponse.json([]);
    
    const products = await prisma.products.findMany({
      where: {
        name: { contains: q },
        status: 'ACTIVE',
      },
      take: 20,
      orderBy: { created_at: 'desc' },
    });
    
    return NextResponse.json(products.map(p => ({
      id: p.id.toString(),
      name: p.name,
      description: p.description ?? '',
    })));
  } catch (error) {
    console.error('Product search error:', error);
    return NextResponse.json([]);
  }
}
