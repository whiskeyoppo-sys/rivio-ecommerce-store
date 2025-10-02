# Type: Conceptualized
# Description: Project overview, setup, and usage instructions.

# Rivio E-commerce Store

A modern, scalable, and maintainable headless e-commerce platform built with Next.js, NestJS, Prisma, and deployed via a CI/CD pipeline.

## Features

- **Product Catalog**: Full CRUD for products, variants, and categories.
- **JWT Authentication**: Secure user login and session management.
- **Cart & Checkout**: Redis-backed cart with Stripe/PayPal integration.
- **AI/ML Enhancements**: Stubs for recommendations, semantic search, and dynamic pricing.
- **DevOps Ready**: Dockerized for local development, with CI/CD pipelines for automated testing and deployment.

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: Next.js, TailwindCSS, React
- **Backend**: NestJS, Prisma ORM
- **Database**: PostgreSQL
- **Cache/Session**: Redis
- **Testing**: Jest (Unit), Playwright (E2E)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## Getting Started (Local Development)

### Prerequisites

- Node.js (v18+)
- pnpm
- Docker & Docker Compose
- Termux (for mobile development)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd rivio-ecommerce-store
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Setup environment variables:**
    Copy `.env.example` to `.env` and fill in the required values.
    ```bash
    cp .env.example .env
    ```

4.  **Start services:**
    This command starts Postgres and Redis containers.
    ```bash
    docker-compose up -d
    ```

5.  **Run database migrations:**
    This applies the Prisma schema to your local Postgres database.
    ```bash
    pnpm migrate
    ```

6.  **Seed the database (optional):**
    ```bash
    pnpm seed
    ```

7.  **Run the development servers:**
    This starts the frontend, backend, and all microservices concurrently.
    ```bash
    pnpm dev
    ```

-   **Frontend**: `http://localhost:3000`
-   **Backend API**: `http://localhost:3001`

## Running in Termux

Our scripts are designed to be compatible with Termux.

```bash
# Use the bash runner for common tasks
./scripts/runner.sh dev
./scripts/runner.sh test
