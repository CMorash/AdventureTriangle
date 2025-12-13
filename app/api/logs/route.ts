import { NextRequest, NextResponse } from 'next/server';
import { saveLog } from '@/lib/data/storage';
import type { LogEntry } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level, message, metadata } = body;

    // Validation
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const validLevels = ['info', 'warn', 'error'];
    const logLevel = (level && validLevels.includes(level)) ? level : 'info';

    // Create log entry
    const log: LogEntry = {
      id: crypto.randomUUID(),
      level: logLevel,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      metadata: metadata || {},
    };

    // Save log
    await saveLog(log);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Log saved successfully',
        id: log.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Logging error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { getLogs } = await import('@/lib/data/storage');
    const logs = await getLogs();
    
    return NextResponse.json(
      { logs },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

