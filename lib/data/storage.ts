import { promises as fs } from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';
import type { BetaRegistration, PartnerOnboarding, EventRegistration, LogEntry } from '@/lib/types';

// ==========================================
// CONFIGURATION
// ==========================================
const DATA_DIR = path.join(process.cwd(), 'data');
const USE_DB = !!process.env.POSTGRES_URL;

// Helper to safely convert DB date to ISO string
const toISO = (date: any) => (date instanceof Date ? date.toISOString() : String(date));

// ==========================================
// FILE SYSTEM STORAGE (Local/Dev)
// ==========================================

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ==========================================
// DATABASE STORAGE (Production/Vercel)
// ==========================================

// Helper to ensure tables exist - useful for initial setup
export async function ensureTablesExist() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        interests TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS partners (
        id UUID PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        adventure_type VARCHAR(50) NOT NULL,
        location VARCHAR(255),
        website VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        attendance_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS logs (
        id UUID PRIMARY KEY,
        level VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        metadata JSONB,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Database tables verified/created');
  } catch (e) {
    console.error('Failed to ensure tables exist:', e);
    throw e;
  }
}

// ==========================================
// UNIFIED DATA ACCESS LAYER
// ==========================================

// --- Beta Registration ---

export async function saveRegistration(registration: BetaRegistration): Promise<void> {
  if (USE_DB) {
    await sql`
      INSERT INTO registrations (id, name, email, interests, created_at)
      VALUES (${registration.id}, ${registration.name}, ${registration.email}, ${registration.interests}, ${registration.createdAt})
    `;
  } else {
    const registrations = await readJsonFile<BetaRegistration>('registrations.json');
    registrations.push(registration);
    await writeJsonFile('registrations.json', registrations);
  }
}

export async function getRegistrations(): Promise<BetaRegistration[]> {
  if (USE_DB) {
    const { rows } = await sql`SELECT * FROM registrations ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      interests: r.interests,
      createdAt: toISO(r.created_at)
    }));
  } else {
    return readJsonFile<BetaRegistration>('registrations.json');
  }
}

// --- Partner Onboarding ---

export async function savePartner(partner: PartnerOnboarding): Promise<void> {
  if (USE_DB) {
    await sql`
      INSERT INTO partners (id, company_name, contact_name, email, phone, adventure_type, location, website, message, created_at)
      VALUES (${partner.id}, ${partner.companyName}, ${partner.contactName}, ${partner.email}, ${partner.phone}, ${partner.adventureType}, ${partner.location}, ${partner.website}, ${partner.message}, ${partner.createdAt})
    `;
  } else {
    const partners = await readJsonFile<PartnerOnboarding>('partners.json');
    partners.push(partner);
    await writeJsonFile('partners.json', partners);
  }
}

export async function getPartners(): Promise<PartnerOnboarding[]> {
  if (USE_DB) {
    const { rows } = await sql`SELECT * FROM partners ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      companyName: r.company_name,
      contactName: r.contact_name,
      email: r.email,
      phone: r.phone,
      adventureType: r.adventure_type,
      location: r.location,
      website: r.website,
      message: r.message,
      createdAt: toISO(r.created_at)
    }));
  } else {
    return readJsonFile<PartnerOnboarding>('partners.json');
  }
}

// --- Event Registration ---

export async function saveEventRegistration(event: EventRegistration): Promise<void> {
  if (USE_DB) {
    await sql`
      INSERT INTO events (id, name, email, attendance_type, created_at)
      VALUES (${event.id}, ${event.name}, ${event.email}, ${event.attendanceType}, ${event.createdAt})
    `;
  } else {
    const events = await readJsonFile<EventRegistration>('events.json');
    events.push(event);
    await writeJsonFile('events.json', events);
  }
}

export async function getEventRegistrations(): Promise<EventRegistration[]> {
  if (USE_DB) {
    const { rows } = await sql`SELECT * FROM events ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      attendanceType: r.attendance_type,
      createdAt: toISO(r.created_at)
    }));
  } else {
    return readJsonFile<EventRegistration>('events.json');
  }
}

// --- Logging ---

export async function saveLog(log: LogEntry): Promise<void> {
  if (USE_DB) {
    await sql`
      INSERT INTO logs (id, level, message, metadata, timestamp)
      VALUES (${log.id}, ${log.level}, ${log.message}, ${JSON.stringify(log.metadata)}, ${log.timestamp})
    `;
  } else {
    const logs = await readJsonFile<LogEntry>('logs.json');
    logs.push(log);
    const recentLogs = logs.slice(-1000);
    await writeJsonFile('logs.json', recentLogs);
  }
}

export async function getLogs(): Promise<LogEntry[]> {
  if (USE_DB) {
    const { rows } = await sql`SELECT * FROM logs ORDER BY timestamp DESC LIMIT 1000`;
    return rows.map((r: any) => ({
      id: r.id,
      level: r.level,
      message: r.message,
      metadata: r.metadata,
      timestamp: toISO(r.timestamp)
    }));
  } else {
    return readJsonFile<LogEntry>('logs.json');
  }
}
