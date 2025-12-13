import { NextRequest, NextResponse } from 'next/server';
import { savePartner, saveLog } from '@/lib/data/storage';
import type { PartnerOnboarding, LogEntry } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      companyName, 
      contactName, 
      email, 
      phone, 
      adventureType, 
      location, 
      website, 
      message 
    } = body;

    // Validation
    if (!companyName || !contactName || !email) {
      return NextResponse.json(
        { error: 'Company name, contact name, and email are required' },
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

    // Adventure type validation
    const validTypes = ['water', 'air', 'land', 'multiple'];
    if (adventureType && !validTypes.includes(adventureType)) {
      return NextResponse.json(
        { error: 'Invalid adventure type' },
        { status: 400 }
      );
    }

    // Create partner record
    const partner: PartnerOnboarding = {
      id: crypto.randomUUID(),
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      adventureType: adventureType || 'multiple',
      location: location?.trim(),
      website: website?.trim(),
      message: message?.trim(),
      createdAt: new Date().toISOString(),
    };

    // Save partner
    await savePartner(partner);

    // Log the partner onboarding
    const log: LogEntry = {
      id: crypto.randomUUID(),
      level: 'info',
      message: `Partner onboarded: ${partner.companyName} (${partner.email})`,
      timestamp: new Date().toISOString(),
      metadata: { partnerId: partner.id, adventureType: partner.adventureType },
    };
    await saveLog(log);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Partner onboarding successful',
        id: partner.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Partner onboarding error:', error);
    
    // Log error
    const log: LogEntry = {
      id: crypto.randomUUID(),
      level: 'error',
      message: `Partner onboarding failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString(),
    };
    await saveLog(log).catch(console.error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

