# Adventure Triangle Pre-Launch Landing Page

A professional pre-launch landing page for Adventure Triangle, built with Next.js 14, TypeScript, and TailwindCSS. This project serves as the official pre-beta launch page until the core platform goes live.

## ⚠️ Important Notice

**This project is developed solely for assessment purposes for Adventure Triangle. Commercial use, reproduction, or deployment of this code, design, or content outside of the evaluation context is not permitted.**

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). See the [LICENSE](LICENSE) file for details.

## Features

- ✅ All 9 required sections implemented
- ✅ Professional UI with earthy color palette (blue, green, brown)
- ✅ Smooth animations and transitions using Framer Motion
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Form validation with react-hook-form and Zod
- ✅ Backend API endpoints with JSON file storage
- ✅ Modern, clean design with soft edges and rounded shapes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion
- **Forms**: react-hook-form + Zod
- **Validation**: Zod schemas

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── register/          # Beta user registration
│   │   ├── partner/           # Partner onboarding
│   │   ├── event/             # Launch event registration
│   │   └── logs/              # Logging endpoint
│   ├── components/
│   │   ├── sections/           # Page sections
│   │   ├── ui/                # Reusable UI components
│   │   └── forms/             # Form components
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main landing page
│   └── globals.css            # Global styles
├── lib/
│   ├── data/                  # Data persistence layer
│   └── types/                 # TypeScript types
└── data/                      # JSON data storage (created at runtime)
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AdventureTriangle
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## API Documentation

### Endpoints

#### POST `/api/register`
Register a beta user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "interests": ["Water Activities", "Air Activities"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "id": "uuid"
}
```

#### POST `/api/partner`
Submit partner onboarding application.

**Request Body:**
```json
{
  "companyName": "Adventure Co.",
  "contactName": "Jane Smith",
  "email": "contact@company.com",
  "phone": "+1 (555) 123-4567",
  "adventureType": "water|air|land|multiple",
  "location": "Toronto, Canada",
  "website": "https://www.example.com",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Partner onboarding successful",
  "id": "uuid"
}
```

#### POST `/api/event`
Register for launch event.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "attendanceType": "in-person|virtual|both"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event registration successful",
  "id": "uuid"
}
```

#### POST `/api/logs`
Create a log entry.

**Request Body:**
```json
{
  "level": "info|warn|error",
  "message": "Log message",
  "metadata": {}
}
```

#### GET `/api/logs`
Retrieve all logs (last 1000 entries).

**Response:**
```json
{
  "logs": [...]
}
```

### Data Storage

All data is stored in JSON files in the `data/` directory:
- `registrations.json` - Beta user registrations
- `partners.json` - Partner applications
- `events.json` - Event registrations
- `logs.json` - Application logs

The `data/` directory is created automatically on first API call.

## Sections

1. **Hero Section** - Powerful tagline and primary CTAs
2. **About Adventure Triangle** - Company overview and mission
3. **Mission Section** - Water | Air | Land adventures showcase
4. **Partner Onboarding CTA** - Call-to-action for partners
5. **Partner Application Form** - Partner onboarding form
6. **Launch Event Registration** - Event registration form
7. **Beta User Registration** - Beta signup form
8. **#FeelTheAdventure Campaign** - Campaign section
9. **Social Media Integration** - Links to social platforms
10. **Footer** - Legal, contact, and about links

## Design System

### Color Palette

- **Blues** (`blue-50` to `blue-900`): Ocean/sky tones for water adventures
- **Greens** (`green-50` to `green-900`): Nature tones for land adventures
- **Browns** (`brown-50` to `brown-900`): Earth tones for grounding elements
- **Neutrals** (`neutral-50` to `neutral-900`): Backgrounds and text

### Typography

- **Headings**: Bold, large sizes (text-4xl to text-7xl)
- **Body**: Regular weight, readable sizes (text-base to text-xl)
- **Font**: Geist Sans (via Next.js)

### Spacing & Border Radius

- **Border Radius**: 12px (rounded-xl) to 24px (rounded-2xl) for soft edges
- **Spacing**: Consistent Tailwind spacing scale

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy automatically

The project is configured for Vercel deployment out of the box.

### Environment Variables

No environment variables are required for basic functionality. All data is stored locally in JSON files.

## Development

### Code Style

- ESLint is configured for code quality
- TypeScript for type safety
- Prettier recommended for formatting

### File Naming

- Components: PascalCase (e.g., `Hero.tsx`)
- Utilities: camelCase (e.g., `storage.ts`)
- API routes: lowercase (e.g., `route.ts`)

## Contributing

This is an assessment project. Please refer to the assignment requirements for submission guidelines.

## Contact

For questions about this project, please contact: support@adventuretriangle.com

---

**Note**: This project is developed for assessment purposes only. See the license file for usage restrictions.
