# Adventure Triangle API Documentation

> **Version**: 1.0.0  
> **Base URL**: `https://adventure-triangle-theta.vercel.app/api` (or `http://localhost:3000/api` for development)

## Overview

The Adventure Triangle API provides endpoints for managing beta user registrations, partner onboarding, event registrations, and application logging. Built with Next.js 14+ API Route Handlers, the API follows RESTful conventions and uses JSON for request/response payloads.

### Technology Stack

- **Runtime**: Next.js API Route Handlers (Edge-compatible)
- **Language**: TypeScript
- **Validation**: Server-side with custom validators + Zod schemas on client
- **Storage**: JSON file-based persistence (for demo purposes)
- **Authentication**: None (pre-launch demo)

---

## Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check / API status |
| `GET` | `/api/register` | List all beta registrations |
| `POST` | `/api/register` | Register a beta user |
| `GET` | `/api/partner` | List all partner applications |
| `POST` | `/api/partner` | Submit partner application |
| `GET` | `/api/event` | List all event registrations |
| `POST` | `/api/event` | Register for launch event |
| `GET` | `/api/logs` | Retrieve all logs |
| `POST` | `/api/logs` | Create a log entry |

---

## Endpoints

### 0. Health Check

Check API availability and get version information.

#### Request

```http
GET /api/health
```

#### Success Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-12-15T10:30:00.000Z",
  "service": "Adventure Triangle API",
  "endpoints": {
    "register": "/api/register",
    "partner": "/api/partner",
    "event": "/api/event",
    "logs": "/api/logs",
    "health": "/api/health"
  }
}
```

---

### 1. Beta User Registration

Register and retrieve beta users for early access to the Adventure Triangle platform.

#### List All Registrations

```http
GET /api/register
```

**Response:**
```json
{
  "registrations": [...],
  "count": 10
}
```

#### Create Registration

```http
POST /api/register
Content-Type: application/json
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Full name (min 1 character) |
| `email` | string | ✅ Yes | Valid email address |
| `interests` | string[] | ❌ No | Array of adventure interests |

**Valid Interest Values:**
- `"Water Activities"`
- `"Air Activities"`
- `"Land Activities"`
- `"All Adventures"`

#### Example Request

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "interests": ["Water Activities", "Land Activities"]
}
```

#### Success Response

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Registration successful",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Error Responses

**400 Bad Request** - Missing required fields:
```json
{
  "error": "Name and email are required"
}
```

**400 Bad Request** - Invalid email format:
```json
{
  "error": "Invalid email format"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

---

### 2. Partner Onboarding

Submit and retrieve partner applications to join Adventure Triangle's network of adventure providers.

#### List All Partners

```http
GET /api/partner
```

**Response:**
```json
{
  "partners": [...],
  "count": 5
}
```

#### Create Partner Application

```http
POST /api/partner
Content-Type: application/json
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `companyName` | string | ✅ Yes | Company/business name |
| `contactName` | string | ✅ Yes | Primary contact person |
| `email` | string | ✅ Yes | Business email address |
| `phone` | string | ❌ No | Contact phone number |
| `adventureType` | enum | ❌ No | Type of adventures offered |
| `location` | string | ❌ No | Business location |
| `website` | string | ❌ No | Company website URL |
| `message` | string | ❌ No | Additional information |

**Adventure Type Values:**
- `"water"` - Water-based activities (diving, surfing, kayaking)
- `"air"` - Air-based activities (skydiving, paragliding)
- `"land"` - Land-based activities (hiking, climbing, safari)
- `"multiple"` - Multiple adventure types (default)

#### Example Request

```json
{
  "companyName": "Ocean Adventures Inc.",
  "contactName": "Jane Smith",
  "email": "jane@oceanadventures.com",
  "phone": "+1 (555) 123-4567",
  "adventureType": "water",
  "location": "Miami, Florida, USA",
  "website": "https://www.oceanadventures.com",
  "message": "We specialize in scuba diving and snorkeling tours in the Caribbean."
}
```

#### Success Response

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Partner onboarding successful",
  "id": "550e8400-e29b-41d4-a716-446655440001"
}
```

#### Error Responses

**400 Bad Request** - Missing required fields:
```json
{
  "error": "Company name, contact name, and email are required"
}
```

**400 Bad Request** - Invalid adventure type:
```json
{
  "error": "Invalid adventure type"
}
```

---

### 3. Event Registration

Register for and retrieve registrations for the Adventure Triangle launch event (January 26, 2026 - Toronto, Canada).

#### List All Event Registrations

```http
GET /api/event
```

**Response:**
```json
{
  "events": [...],
  "count": 25
}
```

#### Create Event Registration

```http
POST /api/event
Content-Type: application/json
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Attendee's full name |
| `email` | string | ✅ Yes | Contact email address |
| `attendanceType` | enum | ❌ No | How attendee will participate |

**Attendance Type Values:**
- `"in-person"` - Attending in Toronto (default)
- `"virtual"` - Joining online stream
- `"both"` - In-person with virtual access

#### Example Request

```json
{
  "name": "Alex Johnson",
  "email": "alex.johnson@example.com",
  "attendanceType": "virtual"
}
```

#### Success Response

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Event registration successful",
  "id": "550e8400-e29b-41d4-a716-446655440002"
}
```

#### Error Responses

**400 Bad Request** - Invalid attendance type:
```json
{
  "error": "Invalid attendance type"
}
```

---

### 4. Logging

Create and retrieve application logs for monitoring and debugging.

#### Create Log Entry

```http
POST /api/logs
Content-Type: application/json
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `level` | enum | ❌ No | Log severity level |
| `message` | string | ✅ Yes | Log message content |
| `metadata` | object | ❌ No | Additional contextual data |

**Log Level Values:**
- `"info"` - Informational messages (default)
- `"warn"` - Warning conditions
- `"error"` - Error conditions

#### Example Request

```json
{
  "level": "info",
  "message": "User completed registration flow",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://google.com"
  }
}
```

#### Success Response

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "success": true,
  "message": "Log saved successfully",
  "id": "550e8400-e29b-41d4-a716-446655440003"
}
```

---

#### Retrieve Logs

```http
GET /api/logs
```

#### Success Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "logs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "level": "info",
      "message": "Beta user registered: john@example.com",
      "timestamp": "2025-12-15T10:30:00.000Z",
      "metadata": {
        "registrationId": "550e8400-e29b-41d4-a716-446655440000"
      }
    }
  ]
}
```

**Note:** The logs endpoint returns the most recent 1000 log entries, ordered by creation time.

---

## Data Models

### BetaRegistration

```typescript
interface BetaRegistration {
  id: string;           // UUID v4
  name: string;         // User's full name
  email: string;        // Email address (lowercase)
  interests: string[];  // Selected adventure interests
  createdAt: string;    // ISO 8601 timestamp
}
```

### PartnerOnboarding

```typescript
interface PartnerOnboarding {
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
```

### EventRegistration

```typescript
interface EventRegistration {
  id: string;
  name: string;
  email: string;
  attendanceType: 'in-person' | 'virtual' | 'both';
  createdAt: string;
}
```

### LogEntry

```typescript
interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success (GET requests) |
| `201` | Created (successful POST) |
| `400` | Bad Request (validation error) |
| `500` | Internal Server Error |

---

## Data Storage

This demo implementation uses JSON file-based storage located in the `data/` directory:

| File | Contents |
|------|----------|
| `registrations.json` | Beta user registrations |
| `partners.json` | Partner applications |
| `events.json` | Event registrations |
| `logs.json` | Application logs (last 1000) |

The `data/` directory is created automatically on the first API call if it doesn't exist.

> **Note**: In a production environment, this would be replaced with a proper database (PostgreSQL, MongoDB, etc.).

---

## Rate Limiting

No rate limiting is implemented in this demo version. Production deployment should include:
- Request rate limiting per IP
- Authentication for sensitive endpoints
- CORS configuration for allowed origins

---

## Testing

### Using cURL

```bash
# Register a beta user
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "interests": ["Water Activities"]}'

# Submit partner application
curl -X POST http://localhost:3000/api/partner \
  -H "Content-Type: application/json" \
  -d '{"companyName": "Test Co", "contactName": "Test", "email": "partner@test.com"}'

# Register for event
curl -X POST http://localhost:3000/api/event \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "event@test.com", "attendanceType": "virtual"}'

# Get logs
curl http://localhost:3000/api/logs
```

### Using Postman

Import the provided Postman collection (`Adventure_Triangle_API.postman_collection.json`) for a complete testing environment with pre-configured requests.

---

## Changelog

### v1.0.0 (2025-12-15)
- Initial release
- Beta user registration endpoint
- Partner onboarding endpoint
- Event registration endpoint
- Logging endpoints (create/retrieve)

