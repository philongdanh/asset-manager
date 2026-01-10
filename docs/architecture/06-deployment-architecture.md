# Deployment Architecture

## Deployment Environments

### 1. Development Environment

```mermaid
---
config:
  theme: redux
  themeVariables:
    fontFamily: EB Garamond
---
flowchart LR
    A[Developer Machine] --> B[Docker Compose]

    subgraph B [Local Development Stack]
        C[NestJS Backend]
        D[PostgreSQL]
        E[Prisma Studio]
        F[Adminer]
    end

    C --> D
    E --> D
    F --> D

    G[Frontend Dev Server] --> C
```

**Purpose**: Local development and testing
**Components**:

- Docker Compose for service orchestration
- Local PostgreSQL database
- Prisma Studio for database management
- Hot-reload enabled backend service
- Development frontend server
