import { NextRequest, NextResponse } from 'next/server';
import { saveEventRegistration, saveLog, getEventRegistrations } from '@/lib/data/storage';
import type { EventRegistration, LogEntry } from '@/lib/types';

/**
 * GET /api/event
 * 
 * Retrieve all event registrations.
 * In production, this would require authentication.
 */
export async function GET() {
  try {
    const events = await getEventRegistrations();
    
    return NextResponse.json(
      { 
        events,
        count: events.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get event registrations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/event
 * 
 * Register for the Adventure Triangle launch event.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, attendanceType } = body;

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

    // Attendance type validation
    const validTypes = ['in-person', 'virtual', 'both'];
    if (attendanceType && !validTypes.includes(attendanceType)) {
      return NextResponse.json(
        { error: 'Invalid attendance type' },
        { status: 400 }
      );
    }

    // Create event registration
    const eventRegistration: EventRegistration = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      attendanceType: attendanceType || 'in-person',
      createdAt: new Date().toISOString(),
    };

    // Save event registration
    await saveEventRegistration(eventRegistration);

    // Log the event registration
    const log: LogEntry = {
      id: crypto.randomUUID(),
      level: 'info',
      message: `Event registration: ${eventRegistration.name} (${eventRegistration.attendanceType})`,
      timestamp: new Date().toISOString(),
      metadata: { 
        eventRegistrationId: eventRegistration.id,
        attendanceType: eventRegistration.attendanceType 
      },
    };
    await saveLog(log);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Event registration successful',
        id: eventRegistration.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Event registration error:', error);
    
    // Log error
    const log: LogEntry = {
      id: crypto.randomUUID(),
      level: 'error',
      message: `Event registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
    };
    await saveLog(log).catch(console.error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

