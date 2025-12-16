# 🌍 Adventure Triangle - Pre-Launch Landing Page

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-FF0055?style=for-the-badge&logo=framer)
![Three.js](https://img.shields.io/badge/Three.js-0.182-black?style=for-the-badge&logo=three.js)

**A stunning pre-launch landing page for Adventure Triangle - the global marketplace connecting travelers with verified adventure experiences.**

[Live Demo](https://your-vercel-url.vercel.app) • [API Documentation](./docs/API.md) • [Postman Collection](./Adventure_Triangle_API.postman_collection.json)

</div>

---

## 📸 Preview

> *Interactive 3D Earth globe with real-time day/night visualization, smooth scroll animations, and responsive design across all devices.*

---

## ⚠️ License Notice

**This project is developed for assessment purposes for Adventure Triangle's internship program.** 

Licensed under [CC BY-NC 4.0](LICENSE) - Commercial use, reproduction, or deployment outside of the evaluation context is not permitted.

---

## ✨ Features

### Frontend
- 🌐 **Interactive 3D Earth** - WebGL-powered globe with realistic day/night cycle using Three.js
- 🎨 **Modern UI/UX** - Clean, adventure-driven design with earthy color palette
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🌙 **Dark Mode** - Automatic theme detection with manual toggle
- 🎭 **Smooth Animations** - Page transitions and scroll animations via Framer Motion
- ✅ **Form Validation** - Client-side validation with react-hook-form and Zod

### Backend API
- 📝 **User Registration** - Beta signup with interests tracking
- 🤝 **Partner Onboarding** - Full application workflow for adventure providers
- 📅 **Event Registration** - Launch event signup (in-person/virtual)
- 📊 **Logging System** - Application-wide logging with metadata support
- 💾 **Persistent Storage** - JSON file-based storage (demo purposes)

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 (App Router) | React server components, API routes |
| **Language** | TypeScript | Type safety throughout |
| **Styling** | TailwindCSS v4 | Utility-first CSS |
| **3D Graphics** | Three.js | Interactive Earth visualization |
| **Animations** | Framer Motion | Page transitions, scroll effects |
| **Forms** | react-hook-form + Zod | Validation, state management |
| **Storage** | JSON Files | Demo data persistence |

---

## 📂 Project Structure

```
adventure-triangle/
├── app/
│   ├── api/                      # API Route Handlers
│   │   ├── register/             # POST - Beta user registration
│   │   ├── partner/              # POST - Partner onboarding
│   │   ├── event/                # POST - Event registration
│   │   └── logs/                 # GET/POST - Application logging
│   ├── components/
│   │   ├── sections/             # Page section components
│   │   │   ├── Hero.tsx          # Hero with 3D Earth
│   │   │   ├── About.tsx         # About Adventure Triangle
│   │   │   ├── Mission.tsx       # Water/Air/Land adventures
│   │   │   ├── PartnerCTA.tsx    # Partner call-to-action
│   │   │   ├── PartnerForm.tsx   # Partner form section
│   │   │   ├── LaunchEvent.tsx   # Event registration
│   │   │   ├── BetaRegistration.tsx # Beta signup
│   │   │   ├── Campaign.tsx      # #FeelTheAdventure
│   │   │   ├── SocialMedia.tsx   # Social links
│   │   │   └── Footer.tsx        # Footer with legal/contact
│   │   ├── forms/                # Form components
│   │   └── ui/                   # Reusable UI components
│   ├── contexts/                 # React contexts (Theme)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main landing page
│   └── globals.css               # Global styles + Tailwind
├── lib/
│   ├── data/storage.ts           # Data persistence layer
│   └── types/index.ts            # TypeScript interfaces
├── docs/
│   └── API.md                    # Comprehensive API documentation
├── data/                         # JSON data storage (created at runtime)
└── Adventure_Triangle_API.postman_collection.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/adventure-triangle.git
cd adventure-triangle

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📡 API Reference

Complete API documentation is available in [`docs/API.md`](./docs/API.md).

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register beta user |
| `POST` | `/api/partner` | Submit partner application |
| `POST` | `/api/event` | Register for launch event |
| `POST` | `/api/logs` | Create log entry |
| `GET` | `/api/logs` | Retrieve all logs |

### Example: Register a Beta User

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "interests": ["Water Activities", "Air Activities"]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Testing with Postman

Import the included [Postman Collection](./Adventure_Triangle_API.postman_collection.json) for a complete testing environment with:
- All endpoints pre-configured
- Example request bodies
- Success/error response examples
- Test scenarios (validation, user journeys)

---

## 🎨 Design System

### Color Palette

| Category | Usage | Colors |
|----------|-------|--------|
| **Blues** | Water adventures, CTAs | `blue-50` → `blue-900` |
| **Greens** | Air/nature elements | `green-50` → `green-900` |
| **Browns** | Earth/land elements | `brown-50` → `brown-900` |
| **Neutrals** | Backgrounds, text | `neutral-50` → `neutral-900` |

### Typography

- **Font**: Geist Sans (Next.js optimized)
- **Headings**: Bold, `text-4xl` to `text-7xl`
- **Body**: Regular, `text-base` to `text-xl`

### Component Styling

- **Border Radius**: `rounded-xl` (12px) to `rounded-2xl` (24px)
- **Shadows**: `shadow-lg`, `shadow-xl` for depth
- **Transitions**: 300ms ease for smooth interactions

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Deploy automatically (zero configuration needed)

The project is pre-configured for Vercel deployment with:
- Automatic API route handling
- Edge function support
- Optimal caching strategies

### Environment Variables

No environment variables are required for basic functionality. All data is stored locally in JSON files.

---

## 📋 Assignment Checklist

### Frontend Developer Requirements ✅

- [x] Next.js 14+ (App Router)
- [x] TailwindCSS
- [x] Clean UI with animations
- [x] Forms save data to local API
- [x] All 9 required sections implemented
- [x] README documentation
- [x] GitHub repository

### Backend/API Engineer Requirements ✅

- [x] User registration endpoint
- [x] Partner onboarding endpoint
- [x] Event registration endpoint
- [x] Basic logging endpoints
- [x] API documentation (Markdown)
- [x] Postman collection
- [x] GitHub repository

---

## 📁 Data Storage

For this demo, all data is stored in JSON files in the `data/` directory:

| File | Contents |
|------|----------|
| `registrations.json` | Beta user registrations |
| `partners.json` | Partner applications |
| `events.json` | Event registrations |
| `logs.json` | Application logs (last 1000) |

> **Note**: In production, this would be replaced with a proper database (PostgreSQL, MongoDB, etc.).

---

## 🧪 Development

### Code Quality

```bash
# Run ESLint
npm run lint

# Type checking
npx tsc --noEmit
```

### File Conventions

- **Components**: PascalCase (`Hero.tsx`, `BetaForm.tsx`)
- **Utilities**: camelCase (`storage.ts`)
- **API Routes**: lowercase directories (`route.ts`)

---

## 🤝 About Adventure Triangle

Adventure Triangle is building a global adventure ecosystem connecting travelers with verified experiences across:

- 🌊 **Water** - Diving, surfing, kayaking, rafting
- ✈️ **Air** - Skydiving, paragliding, hot air balloons
- 🏔️ **Land** - Hiking, climbing, safari, camping

**Launching January 26, 2026 • Toronto, Canada**

---

## 📬 Contact

- **Email**: support@adventuretriangle.com
- **Location**: Toronto, Canada

---

## 📄 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](LICENSE).

---

<div align="center">

**Built with ❤️ for Adventure Triangle**

*#FeelTheAdventure*

</div>
