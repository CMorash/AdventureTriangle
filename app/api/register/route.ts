import { NextRequest, NextResponse } from 'next/server';
import { saveRegistration, saveLog } from '@/lib/data/storage';
import type { BetaRegistration, LogEntry } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, interests } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create registration
    const registration: BetaRegistration = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      interests: Array.isArray(interests) ? interests : [],
      createdAt: new Date().toISOString(),
    };

    // Save registration
    await saveRegistration(registration);

    // Log the registration
    const log: LogEntry = {
      id: crypto.randomUUID(),
      level: 'info',
      message: `Beta user registered: ${registration.email}`,
      timestamp: new Date().toISOString(),
      metadata: { registrationId: registration.id },
    };
    await saveLog(log);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        id: registration.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Log error
    const log: LogEntry = {
      id: crypto.randomUUID(),
      level: 'error',
      message: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
    };
    await saveLog(log).catch(console.error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

