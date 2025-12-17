import { NextRequest, NextResponse } from 'next/server';
import { ensureTablesExist } from '@/lib/data/storage';

export async function GET(request: NextRequest) {
  try {
    // 1. Check for DB Config
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ 
        error: 'Database not configured. Make sure POSTGRES_URL is set in your environment variables.' 
      }, { status: 500 });
    }

    // 2. Simple Security Check
    // We check for a query parameter "key" to prevent accidental public triggering
    // Usage: /api/setup-db?key=setup123
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    // In a real app, you would use process.env.ADMIN_SECRET
    // For this assignment, we use a simple hardcoded key you can type in the browser
    if (key !== 'setup123') {
       return NextResponse.json({ error: 'Unauthorized. Please provide the correct ?key=' }, { status: 401 });
    }

    await ensureTablesExist();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created successfully.' 
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to setup database', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
