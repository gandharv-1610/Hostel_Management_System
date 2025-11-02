# SVNIT Hostel Management System - Replit Setup

## Project Overview
A comprehensive web-based hostel management system for SVNIT institute featuring role-based access control for Students, Wardens, and Administrators.

## Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js with Express
- **Database**: PostgreSQL (via Neon) - currently running in prototype mode without database
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query
- **Build Tool**: Vite 5

## Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/   # Reusable UI components (Shadcn UI)
│       ├── pages/        # Page components (Login, Dashboards)
│       ├── lib/          # Utilities and helpers
│       └── hooks/        # Custom React hooks
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── db.ts         # Database configuration
│   ├── storage.ts    # Data storage interface
│   └── vite.ts       # Vite dev server integration
└── shared/           # Shared TypeScript types and schemas
    └── schema.ts     # Drizzle ORM schemas
```

## Current Setup (Replit Environment)

### Configuration
- **Server**: Binds to 0.0.0.0:5000 (required for Replit proxy)
- **Vite Dev Server**: Configured with host allowance for Replit's iframe proxy
- **HMR**: Configured for WebSocket Secure (WSS) protocol on port 443
- **Database**: Running in prototype mode (DATABASE_URL not set)

### Workflow
- **dev**: Runs `npm run dev` which starts the Express server with tsx in watch mode
  - Serves both API routes and frontend via Vite middleware in development
  - Port: 5000 (webview)
  - Status: Running

### Environment Variables
- `PORT`: 5000 (default)
- `NODE_ENV`: development
- `DATABASE_URL`: Not set (prototype mode without database)
- `SESSION_SECRET`: Not set (using in-memory sessions)

## Login Information (Prototype Mode)

The current implementation works without a database. Login is determined by email format:

- **Student Dashboard**: Any email like `u24cs100@coes.svnit.ac.in`
- **Warden Dashboard**: Email containing "warden" (e.g., `warden@admin.svnit.ac.in`)
- **Admin Dashboard**: Email containing "admin" (e.g., `admin@admin.svnit.ac.in`)

Password: Any password is accepted in prototype mode
CAPTCHA: Must match displayed characters

## Features
- Role-based authentication system
- Student portal with room allotment
- Warden portal for hostel management
- Admin portal for system-wide controls
- Dark mode support
- Responsive design with Tailwind CSS

## Development Notes

### Key Files Modified for Replit
1. **vite.config.ts**: Added host allowance, HMR config for Replit proxy
2. **server/index.ts**: Changed bind address to 0.0.0.0
3. **server/db.ts**: Made database optional for prototype mode
4. **drizzle.config.ts**: Added fallback for missing DATABASE_URL

### Available Scripts
- `npm run dev` - Start development server (currently running)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema (requires DATABASE_URL)

## Recent Changes
- **2024-11-02**: Initial Replit setup
  - Configured Vite for Replit proxy support
  - Updated server to bind to 0.0.0.0:5000
  - Made database configuration optional
  - Set up development workflow
