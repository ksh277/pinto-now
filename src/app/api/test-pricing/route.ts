import { NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/pricing-data';

export async function GET() {
  try {
    const tests = [
      {
        name: '아크릴키링 3T - 20x20, 101개',
        result: calculatePrice('acrylic-keyring-3t', 'single', '20x20', 101)
      },
      {
        name: '라미키링 - 20x20, 500개',
        result: calculatePrice('laminated-keyring', 'single', '20x20', 500)
      },
      {
        name: '아크릴코롯 - 30x30 단면, 50개',
        result: calculatePrice('acrylic-coaster', 'single', '30x30', 50)
      },
      {
        name: '아크릴코롯 - 30x30 양면, 50개',
        result: calculatePrice('acrylic-coaster', 'double', '30x30', 50)
      }
    ];

    return NextResponse.json({
      success: true,
      tests
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}