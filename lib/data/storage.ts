import { promises as fs } from 'fs';
import path from 'path';
import type { BetaRegistration, PartnerOnboarding, EventRegistration, LogEntry } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic file operations
async function readJsonFile<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    // File doesn't exist, return empty array
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

// Beta Registration
export async function saveRegistration(registration: BetaRegistration): Promise<void> {
  const registrations = await readJsonFile<BetaRegistration>('registrations.json');
  registrations.push(registration);
  await writeJsonFile('registrations.json', registrations);
}

export async function getRegistrations(): Promise<BetaRegistration[]> {
  return readJsonFile<BetaRegistration>('registrations.json');
}

// Partner Onboarding
export async function savePartner(partner: PartnerOnboarding): Promise<void> {
  const partners = await readJsonFile<PartnerOnboarding>('partners.json');
  partners.push(partner);
  await writeJsonFile('partners.json', partners);
}

export async function getPartners(): Promise<PartnerOnboarding[]> {
  return readJsonFile<PartnerOnboarding>('partners.json');
}

// Event Registration
export async function saveEventRegistration(event: EventRegistration): Promise<void> {
  const events = await readJsonFile<EventRegistration>('events.json');
  events.push(event);
  await writeJsonFile('events.json', events);
}

export async function getEventRegistrations(): Promise<EventRegistration[]> {
  return readJsonFile<EventRegistration>('events.json');
}

// Logging
export async function saveLog(log: LogEntry): Promise<void> {
  const logs = await readJsonFile<LogEntry>('logs.json');
  logs.push(log);
  // Keep only last 1000 logs
  const recentLogs = logs.slice(-1000);
  await writeJsonFile('logs.json', recentLogs);
}

export async function getLogs(): Promise<LogEntry[]> {
  return readJsonFile<LogEntry>('logs.json');
}

