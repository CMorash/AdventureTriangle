import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * 
 * Returns the API status and version information.
 * Useful for monitoring, load balancers, and deployment verification.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      service: 'Adventure Triangle API',
      endpoints: {
        register: '/api/register',
        partner: '/api/partner',
        event: '/api/event',
        logs: '/api/logs',
        health: '/api/health',
      },
    },
    { status: 200 }
  );
}

