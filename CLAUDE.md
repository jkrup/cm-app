# CLAUDE.md - Guidance for Agentic Coding Assistants

## Build & Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `docker-compose up -d` - Start PostgreSQL database

## Code Style Guidelines
- **Components**: PascalCase, functional with explicit prop interfaces
- **Files**: Match component name, "use client" directive for client components
- **Imports**: React first, then external libs, then local, no delimiters
- **State**: Use Zustand, define interfaces for store state
- **Error Handling**: Try/catch with status codes in API routes
- **Database**: Prisma client as singleton, environment-aware
- **Auth**: NextAuth with JWT strategy and Prisma adapter
- **TypeScript**: Strict mode, explicit return types on functions
- **CSS**: Tailwind utility classes, component-based styling

## Project Structure
- `/app`: Next.js App Router pages and API routes
- `/components`: Reusable UI components
- `/lib`: Utility functions and configuration
- `/prisma`: Database schema and migrations