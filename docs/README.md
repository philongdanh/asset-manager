# Asset Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![NestJS](https://img.shields.io/badge/NestJS-%5E10.0-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14.0-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-%5E5.0-purple.svg)

A comprehensive, multi-tenant Asset Management System built with NestJS and Prisma. This system helps organizations track, maintain, and optimize their physical assets throughout their lifecycle with a modern, scalable architecture.

## Features

### Core System

- **Multi-tenancy**: Isolated data for multiple organizations using row-level security
- **Department Hierarchy**: Flexible organizational structure with parent-child relationships
- **User Management**: Role-based access control with comprehensive audit trails
- **Soft Delete**: Safe data deletion with recovery capabilities

### Asset Management

- **Asset Catalog**: Hierarchical categorization of asset types with specifications
- **Individual Asset Tracking**: Serial number, barcode, and unique code tracking
- **Condition & Status Monitoring**: Real-time tracking of asset health and availability
- **Warranty Management**: Automated warranty expiry alerts and tracking

### Asset Lifecycle Operations

- **Asset Transfers**: Controlled transfers between departments and users with approval workflows
- **Maintenance Management**: Schedule and track preventive and corrective maintenance
- **Disposal Management**: Complete disposal workflow with approval process
- **Depreciation Tracking**: Current value calculations and reporting

### Inventory & Procurement

- **Inventory Management**: Stock tracking for consumables with min/max levels
- **Supplier Management**: Vendor information and performance tracking
- **Purchase Orders**: Complete procurement workflow with status tracking
- **Budget Control**: Departmental budget planning and spending tracking

### Reporting & Analytics

- **Asset Register Reports**: Comprehensive asset listings with advanced filtering
- **Financial Reports**: Depreciation, budget utilization, and cost analysis
- **Maintenance Reports**: Maintenance history, costs, and frequency analysis
- **Custom Reporting**: Flexible report builder for customized business intelligence

## Technology Stack

### Backend Framework

- **NestJS**: Progressive Node.js framework for building efficient, reliable, and scalable server-side applications
- **TypeScript**: Strongly typed programming language that builds on JavaScript

### Database & ORM

- **PostgreSQL**: Powerful, open-source object-relational database system
- **Prisma**: Next-generation ORM with type safety and intuitive data modeling
- **Database Schema**: Multi-tenant design with soft delete pattern and comprehensive relationships

### Authentication & Security

- **JWT (JSON Web Tokens)**: Secure token-based authentication
- **Passport.js**: Authentication middleware for Node.js
- **Role-Based Access Control (RBAC)**: Fine-grained permission system

### API Design

- **RESTful API**: Well-structured, resource-oriented API design
- **OpenAPI/Swagger**: Automatic API documentation generation
- **Validation**: Comprehensive request validation using class-validator

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/asset-management-system.git
   cd asset-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and other settings
   ```

4. **Set up Prisma and database**

   ```bash
   npx prisma generate
   npx prisma db push
   # Or for production: npx prisma migrate dev
   ```

5. **Start the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Access the application**
   - API: http://localhost:3000
   - API Documentation: http://localhost:3000/api

## Project Structure

```
src/
├── common/
│   ├── decorators/     # Custom decorators (e.g., @Public(), @Roles())
│   ├── filters/        # Exception filters
│   ├── guards/         # Authentication and authorization guards
│   ├── interceptors/   # Request/response interceptors
│   └── middleware/     # Global middleware
├── modules/
│   ├── auth/           # Authentication module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── strategies/
│   │   └── dto/
│   ├── tenants/        # Tenant management
│   ├── departments/    # Department hierarchy
│   ├── users/         # User management
│   ├── assets/        # Asset management (categories, templates, items)
│   ├── maintenance/   # Maintenance scheduling
│   ├── transfers/     # Asset transfer management
│   ├── disposals/     # Asset disposal management
│   ├── inventory/     # Inventory item management
│   ├── suppliers/     # Supplier management
│   ├── procurement/   # Purchase order management
│   ├── budgets/       # Budget planning and tracking
│   └── audit/         # Audit logging
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── migrations/    # Database migrations
├── config/            # Configuration files
├── utils/            # Utility functions
└── main.ts           # Application entry point
```

## API Architecture

The system follows NestJS modular architecture with:

### Module Structure

Each module contains:

- **Controller**: Handles HTTP requests and responses
- **Service**: Contains business logic
- **DTO (Data Transfer Objects)**: Defines data structures for requests/responses
- **Entities**: Prisma-generated types for database models

### Key Endpoints

- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `GET /api/tenants` - Tenant management (admin only)
- `GET /api/assets` - Asset listing and management
- `POST /api/transfers` - Initiate asset transfers
- `GET /api/reports/assets` - Asset reports

## Database Schema Highlights

### Multi-tenancy Pattern

All tenant-specific tables include a `tenantId` foreign key, ensuring complete data isolation between organizations.

### Soft Delete Pattern

All major entities use `deletedAt` timestamp for soft deletion, allowing data recovery and maintaining referential integrity.

### Key Relationships

- **Tenant → Department → User**: Hierarchical organizational structure
- **AssetCategory → AssetTemplate → AssetItem**: Asset classification and instantiation
- **AssetItem → MaintenanceSchedule → AssetTransfer → AssetDisposal**: Complete asset lifecycle

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/asset_management"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRATION="1h"
JWT_REFRESH_EXPIRATION="7d"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:8080"

# Logging
LOG_LEVEL="debug"
```

## Development Commands

```bash
# Development
npm run start:dev      # Start development server with hot reload

# Production
npm run build         # Build the application
npm run start:prod    # Start production server

# Database
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema changes to database
npm run db:seed       # Seed database with sample data
npm run db:studio     # Open Prisma Studio for database management

# Code quality
npm run lint          # Run ESLint
npm run format        # Format code with Prettier

# API Documentation
# Access Swagger UI at http://localhost:3000/api when server is running
```

## Prisma Database Operations

### Generate Prisma Client

After any schema change:

```bash
npx prisma generate
```

### Create and Apply Migrations

```bash
npx prisma migrate dev --name init
```

### Open Prisma Studio

```bash
npx prisma studio
```

### Reset Database (Development)

```bash
npx prisma migrate reset
```

## API Documentation

When the application is running in development mode, Swagger documentation is automatically available at:

```
http://localhost:3000/api
```

The documentation includes:

- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

## Authentication Flow

1. **Login**: User provides credentials to `/auth/login` and receives access and refresh tokens
2. **Access Protected Routes**: Include `Authorization: Bearer <token>` header
3. **Token Refresh**: Use refresh token at `/auth/refresh` to get new access token
4. **Logout**: Client discards tokens (stateless JWT implementation)

## Error Handling

The system implements global exception filters for consistent error responses:

- **Validation errors**: 400 Bad Request with field-specific messages
- **Authentication errors**: 401 Unauthorized
- **Authorization errors**: 403 Forbidden
- **Not found errors**: 404 Not Found
- **Business logic errors**: 409 Conflict or 422 Unprocessable Entity
- **Server errors**: 500 Internal Server Error (with detailed logging)

## Logging

The application uses structured logging with different levels:

- **DEBUG**: Detailed information for development
- **INFO**: General operational information
- **WARN**: Warning conditions
- **ERROR**: Error conditions that need attention

## Contributing

I welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Complete Documentation

### Architecture Documentation

- [**System Overview**](/docs/architecture/01-system-overview.md) - High-level architecture and design decisions
- [**Database Schema**](/docs/architecture/02-database-schema.md) - Complete database schema with Prisma models
- [**ER Diagram**](/docs/architecture/03-er-diagram.md) - Entity Relationship Diagram (visual database schema)
- [**Class Diagram**](/docs/architecture/04-class-diagram.md) - Object-oriented class structure with methods
- [**Cascade Rules**](/docs/architecture/05-cascade-rules.md) - Database cascade delete relationships and constraints
- [**API Architecture**](/docs/architecture/07-api-architecture.md) - REST API design patterns and standards

### API Documentation

- [**Authentication API**](/docs/api/01-authentication.md) - Login, registration, token management
- [**Tenant Management API**](/docs/api/02-tenants.md) - Multi-tenant organization management
- [**User Management API**](/docs/api/03-users.md) - User CRUD operations and permissions
- [**Department API**](/docs/api/04-departments.md) - Organizational structure management
- [**Asset Category API**](/docs/api/05-asset-categories.md) - Asset classification hierarchy
- [**Asset Template API**](/docs/api/06-asset-templates.md) - Asset type definitions and specifications
- [**Asset Item API**](/docs/api/07-asset-items.md) - Individual asset management and tracking
- [**Maintenance API**](/docs/api/08-maintenance.md) - Maintenance scheduling and work orders
- [**Transfer API**](/docs/api/09-transfers.md) - Asset transfer workflows
- [**Disposal API**](/docs/api/10-disposals.md) - Asset disposal approval process
- [**Inventory API**](/docs/api/11-inventory.md) - Stock management and tracking
- [**Supplier API**](/docs/api/12-suppliers.md) - Vendor management
- [**Purchase Order API**](/docs/api/13-purchase-orders.md) - Procurement workflows
- [**Budget API**](/docs/api/14-budgets.md) - Financial planning and tracking
- [**Audit Log API**](/docs/api/15-audit-logs.md) - System activity logging
- [**Reporting API**](/docs/api/16-reports.md) - Analytics and report generation
- [**API Error Handling**](/docs/api/17-error-handling.md) - API error codes and responses

### Features & Modules

- [**Core Features**](/docs/features/01-core-features.md) - Authentication, multi-tenancy, user management
- [**Asset Management**](/docs/features/02-asset-management.md) - Complete asset lifecycle management
- [**Maintenance Module**](/docs/features/03-maintenance-module.md) - Preventive and corrective maintenance
- [**Inventory Module**](/docs/features/04-inventory-module.md) - Stock and consumables management
- [**Procurement Module**](/docs/features/05-procurement-module.md) - Supplier and purchase order management
- [**Financial Module**](/docs/features/06-financial-module.md) - Budget planning and tracking
- [**Reporting Module**](/docs/features/07-reporting-module.md) - Analytics, dashboards, and reports
- [**Administration Module**](/docs/features/08-administration.md) - System configuration and management

### Workflow Diagrams

- [**Asset Registration Flow**](/docs/sequence-diagrams/01-asset-registration.md) - Complete asset registration process
- [**Asset Transfer Workflow**](/docs/sequence-diagrams/02-asset-transfer.md) - Approval-based transfer process
- [**Maintenance Workflow**](/docs/sequence-diagrams/03-maintenance-workflow.md) - Maintenance scheduling and execution
- [**Disposal Approval Process**](/docs/sequence-diagrams/04-disposal-approval.md) - Asset disposal approval workflow
- [**Purchase Order Process**](/docs/sequence-diagrams/05-purchase-order.md) - Procurement workflow from request to receipt
- [**Budget Tracking Flow**](/docs/sequence-diagrams/06-budget-tracking.md) - Budget allocation and expense tracking
- [**User Authentication Flow**](/docs/sequence-diagrams/07-authentication-flow.md) - Login, token refresh, and logout

### Setup & Deployment

- [**Installation Guide**](/docs/setup/01-installation.md) - Step-by-step installation instructions
- [**Configuration Guide**](/docs/setup/02-configuration.md) - Environment variables and settings
- [**Database Setup**](/docs/setup/03-database-setup.md) - Database initialization and migrations
- [**Development Setup**](/docs/setup/04-development.md) - Development environment setup
- [**Testing Guide**](/docs/setup/05-testing.md) - Test setup and execution
- [**Deployment Guide**](/docs/setup/06-deployment.md) - Production deployment instructions
- [**Docker Configuration**](/docs/setup/07-docker.md) - Containerized deployment with Docker

### Developer Guides

- [**Prisma Guide**](/docs/guides/01-prisma-guide.md) - Database operations and best practices
- [**NestJS Guide**](/docs/guides/02-nestjs-guide.md) - Framework-specific patterns and conventions
- [**API Development**](/docs/guides/03-api-development.md) - Creating new API endpoints
- [**Authentication Implementation**](/docs/guides/04-authentication.md) - JWT and role-based access
- [**Testing Strategies**](/docs/guides/05-testing.md) - Unit, integration, and E2E testing
- [**Performance Optimization**](/docs/guides/06-performance.md) - Performance tuning and monitoring
- [**Security Best Practices**](/docs/guides/07-security.md) - Security considerations and implementation

### Database Schema Reference

- [**Full Schema Reference**](/docs/schema/01-full-schema.md) - Complete Prisma schema with descriptions
- [**Enum Definitions**](/docs/schema/02-enums.md) - All enum types and their values
- [**Model Relationships**](/docs/schema/03-relationships.md) - Detailed relationship mappings
- [**Indexes & Constraints**](/docs/schema/04-indexes.md) - Database indexes and constraints
- [**Data Validation Rules**](/docs/schema/05-validation.md) - Data validation at database level
- [**Migration Guide**](/docs/schema/06-migrations.md) - Database migration procedures

### Additional Resources

- [**Glossary**](/docs/resources/01-glossary.md) - Terminology and definitions
- [**FAQ**](/docs/resources/02-faq.md) - Frequently asked questions
- [**Troubleshooting**](/docs/resources/03-troubleshooting.md) - Common issues and solutions
- [**Changelog**](/docs/resources/04-changelog.md) - Version history and changes
- [**Contributing Guidelines**](/docs/resources/05-contributing.md) - How to contribute to the project
- [**Code of Conduct**](/docs/resources/06-code-of-conduct.md) - Community guidelines
