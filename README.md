# DriveFlow - Enterprise Car Rental System

DriveFlow is a production-ready fleet management and car rental system. It is built using TypeScript, Express, and Prisma, and it demonstrates advanced object-oriented programming principles, design patterns, and scalable system architecture.

The system handles the entire lifecycle of a rental fleet, from vehicle onboarding to automated maintenance scheduling and rental contract management.

## Technical Stack

- Backend: Node.js, TypeScript, Express.js
- Database: PostgreSQL with Prisma ORM (Version 7)
- Frontend: React, Vite, Tailwind CSS
- Patterns: State, Strategy, Factory, Singleton, Observer
- Infrastructure: Winston Logging, node-cron, in-memory JobQueue

## Architecture and Design Patterns

### State Pattern - Vehicle Lifecycle Management
DriveFlow uses the State pattern to manage the transitions of a vehicle through various stages: Available, Reserved, Rented, Maintenance, and Retired. Each state is represented by its own class, ensuring that transition rules are encapsulated and easy to extend without modifying the core Vehicle entity.

### Strategy Pattern - Pricing Engine
The pricing logic is decoupled from the rental contract using the Strategy pattern. This allows the system to support multiple pricing models, such as standard rates, loyalty discounts, and seasonal surges, which can be swapped at runtime based on customer profiles or business rules.

### Factory Pattern - Vehicle Creation
All vehicle instantiation is centralized through a Vehicle Factory. This abstraction ensures that complex validation and default configurations are applied consistently across different vehicle types (Cars, Trucks, Electric Vehicles).

### Layered Architecture
The project follows a strict three-tier architecture:
- Interface Layer: Express routes, controllers, and middleware.
- Application Layer: Service classes orchestrating domain logic and infrastructure.
- Domain Layer: Pure business logic, entities, and design patterns.
- Infrastructure Layer: Database repositories, event buses, and background workers.

## Key Features

### Concurrency Control
The system implements optimistic locking using a version field in the database to prevent race conditions during rental bookings.

### Automated Maintenance
A daily cron job monitors vehicle mileage and automatically transitions vehicles to a maintenance state when service thresholds are met, minimizing downtime and manual oversight.

### Background Task Processing
The system offloads non-critical operations, such as email dispatch and insurance verification, to background workers. This is implemented via an internal EventBus and JobQueue, ensuring a fast and responsive API.

### Security and Validation
- JWT-based authentication for secure session management.
- Role-Based Access Control (RBAC) to distinguish between Customers and Fleet Managers.
- Input validation using Zod for all API endpoints.

## Installation and Setup

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Configure environment:
   Create a `.env` file in the root directory with the following variables:
   - `DATABASE_URL`: Connection string for PostgreSQL.
   - `JWT_SECRET`: Secure string for token signing.
   - `PORT`: Server port (default 3000).

4. Synchronize database:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

## Development Commands

- Start Backend: `npm run start`
- Start Frontend: `cd frontend && npm run dev`
- Run Seeding: `npx prisma db seed`

## Test Accounts

The following accounts are created by the seeding script for testing:

- Fleet Manager: admin@driveflow.com (Password: password123)
- Regular Customer: test@example.com (Password: password123)

## API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/v1/auth/register | Public | Register a new account |
| POST | /api/v1/auth/login | Public | Obtain authentication token |
| GET | /api/v1/vehicles | Authorized | List available fleet |
| POST | /api/v1/vehicles | Manager | Add new vehicle |
| POST | /api/v1/rentals | Authorized | Create rental contract |
| GET | /api/v1/health | Public | System health check |

## License
ISC
