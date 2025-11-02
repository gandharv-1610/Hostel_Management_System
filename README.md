

# SVNIT Hostel Management System

A comprehensive web-based hostel management system for SVNIT institute featuring role-based access control for Students, Wardens, and Administrators.

## Features

### Phase 1 (Current Implementation)
- **Authentication System**
  - Institute email login (@dept.svnit.ac.in format)
  - Password authentication
  - CAPTCHA verification
  - Role-based access control

- **Student Portal**
  - Personal dashboard with profile information
  - Room and mess assignment details
  - In-app notifications
  - Room allotment system with hierarchical filtering
  - Quick actions for common tasks

- **Warden Portal**
  - Hostel occupancy overview
  - Student management
  - Pending approvals (swaps, leaves)
  - Room maintenance status

- **Admin Portal**
  - System-wide dashboard with analytics
  - Hostel/Wing/Floor/Room management
  - Allotment window controls
  - GPA-based priority settings

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Neon)
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Build Tool**: Vite

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

## Installation & Setup

1. **Extract the zip file**
   ```bash
   unzip hostel-management-system.zip
   cd hostel-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional for prototype)
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=your_database_url
   SESSION_SECRET=your_session_secret
   ```
   
   *Note: For the current prototype, the system works without a real database*

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## How to Use

### Login Credentials (Prototype)

The current prototype accepts any password. Your role is determined by your email:

- **Student Dashboard**: Use any email like `u24cs100@coes.svnit.ac.in`
- **Warden Dashboard**: Use email containing "warden", e.g., `warden@admin.svnit.ac.in`
- **Admin Dashboard**: Use email containing "admin", e.g., `admin@admin.svnit.ac.in`

**CAPTCHA**: Enter the displayed characters correctly

### Email Format
All emails must follow the pattern: `username@dept.svnit.ac.in`
- **dept** can be: coes, ece, mech, civil, chem, etc. (3-4 letters)

### Navigation

**Student Portal:**
- Dashboard: View profile, room, and mess information
- Room Allotment: Select hostel → wing → floor → room

**Warden Portal:**
- Dashboard: View hostel occupancy and pending approvals
- Student management and room maintenance controls

**Admin Portal:**
- Dashboard: System-wide analytics and controls
- Hostel management: Add/edit hostels, wings, floors, rooms
- Allotment settings: Open/close windows, set GPA priorities

## Project Structure

```
hostel-management-system/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express server
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage interface
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schemas
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type checking

## Features by Role

### Student
- ✅ View personal profile and hostel details
- ✅ Check room and mess assignments
- ✅ Receive in-app notifications
- ✅ Select rooms during allotment period
- 🔄 Room swap requests (Phase 2)
- 🔄 Mess change requests (Phase 2)
- 🔄 Leave applications (Phase 2)

### Warden
- ✅ View hostel occupancy statistics
- ✅ Student list management
- ✅ Pending approvals overview
- 🔄 Approve/reject room swaps (Phase 2)
- 🔄 Approve/reject leave applications (Phase 2)
- ✅ Toggle room maintenance status

### Admin
- ✅ System-wide dashboard with analytics
- ✅ Add/manage hostels, wings, floors, rooms
- ✅ Open/close allotment windows
- ✅ Set GPA-based priority rules
- 🔄 View reports and exports (Phase 2)
- 🔄 Manage messes (Phase 2)

## Dark Mode

Toggle between light and dark themes using the theme switcher in the top-right corner.

## Troubleshooting

### Port already in use
If port 5000 is already in use:
```bash
# Kill the process using port 5000
# On Mac/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build issues
```bash
# Clear cache and rebuild
npm run clean
npm run build
```

## Future Enhancements (Phase 2 & 3)

- Room swap system with DFS-based chain detection
- Monthly mess change with capacity validation
- Leave application workflow
- Email notifications
- Parent notifications
- Mess feedback system
- Reports and analytics
- Payment integration (demo)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for educational purposes - SVNIT Hostel Management System

## Support

For issues or questions, contact the development team or check the project documentation.
