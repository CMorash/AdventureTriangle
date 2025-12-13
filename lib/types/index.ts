export interface BetaRegistration {
  id: string;
  name: string;
  email: string;
  interests: string[];
  createdAt: string;
}

export interface PartnerOnboarding {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  adventureType: 'water' | 'air' | 'land' | 'multiple';
  location?: string;
  website?: string;
  message?: string;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  name: string;
  email: string;
  attendanceType: 'in-person' | 'virtual' | 'both';
  createdAt: string;
}

export interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

