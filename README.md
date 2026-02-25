# DriveFlow - Enterprise Car Rental System

DriveFlow is a production-grade car rental and fleet management system. It is built with TypeScript and Express, using a strong Object-Oriented Programming (OOP) foundation to ensure the code is clean, stable, and easy to grow.

By following professional design patterns, the system avoids complex "if/else" logic and instead uses dedicated classes to handle different parts of the rental lifecycle.

## Strong OOP Foundation

The project is built around three core design patterns that make the codebase easy to maintain:

- **State Pattern**: We use this to manage vehicle status (Available, Rented, Maintenance). Instead of checking strings, each state is its own class. If a vehicle is in the "Rented" state, it automatically knows it cannot be rented again. Adding a new state (like "Damaged") is as simple as adding one new class.
- **Strategy Pattern**: This handles our pricing. Whether it's a standard rate, a loyalty discount, or a seasonal surge, the system can swap pricing rules at runtime without changing the main contract code.
- **Factory Pattern**: We use a factory to create vehicles. This ensures that every car, truck, or electric vehicle is initialized correctly with all its specific data (like battery capacity for EVs) in one centralized place.

## Project Structure

The codebase is organized into a clear three-tier architecture, separating the business logic from the technical infrastructure.

```text
src/
├── domain/                # Core business logic (Pure OOP)
│   ├── entities/          # Vehicle, Customer, RentalContract
│   ├── patterns/          # State and Strategy implementations
│   ├── factories/         # VehicleFactory
│   └── errors/            # Custom domain-specific errors
├── application/           # Orchestration layer
│   └── services/          # RentalService, AuthService, Maintenance
├── infrastructure/        # External systems (Database, Events)
│   ├── repositories/      # Database access (Prisma)
│   ├── scheduler/         # Automated maintenance jobs
│   ├── events/            # In-memory communication (Observer)
│   └── queue/             # Background task management
├── interface/             # Web API layer (Express)
│   ├── routes/            # API endpoints
│   ├── controllers/       # Request handling and responses
│   └── middleware/        # Security, Auth, and Error Handling
└── server.ts              # System entry point
```

## Technical Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React, Vite, Tailwind CSS
- **Tools**: node-cron (Scheduling), Winston (Logging)

## Getting Started

1. **Setup**:
   ```bash
   npm install
   cd frontend && npm install
   ```
2. **Database**:
   Update `.env` with your `DATABASE_URL`, then run:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
3. **Run**:
   ```bash
   npm run start          # Backend (Port 3000)
   cd frontend && npm run dev  # Frontend
   ```

## Test Accounts

The following accounts are ready to use after running the seed script (Password: `password123`):

- **Fleet Manager**: admin@driveflow.com
- **Regular Customer**: test@example.com

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/auth/login | Login and receive token |
| GET | /api/v1/vehicles | List all fleet vehicles |
| POST | /api/v1/vehicles | Add a new vehicle (Manager only) |
| POST | /api/v1/rentals | Create a rental booking |
| GET | /api/v1/health | Check system status |

## License
ISC
