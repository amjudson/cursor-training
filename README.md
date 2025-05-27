# API Key Builder Application

A full-stack application for managing and generating API keys, built with modern technologies and best practices.

## Frontend (Next.js Application)

### Technologies
- Next.js 15.2.4
- React 18
- Redux Toolkit & React-Redux
- TypeScript
- RTK Query for API integration
- TailwindCSS for styling
- React Hook Form with Zod validation
- Radix UI components
- Jest & Testing Library for testing

### Key Features
- Modern, responsive UI
- Form validation and error handling
- Toast notifications
- Dialog components
- Type-safe development

## Backend (.NET Core API)

### Technologies
- .NET Core
- Entity Framework Core with PostgreSQL
- ASP.NET Core Identity
- JWT Authentication
- Swagger/OpenAPI
- CORS enabled for frontend integration

### Key Features
- Secure API key management
- User authentication and authorization
- Database integration with PostgreSQL
- RESTful API endpoints
- Swagger documentation
- CORS configuration for frontend access

## Development Setup

### Frontend
```bash
cd api-key-builder
yarn install
yarn dev
```

### Backend
```bash
cd ApiKeyBuilder.Api
dotnet restore
dotnet run
```

## Testing

### Frontend
```bash
yarn test        # Run tests
yarn test:watch  # Run tests in watch mode
yarn test:coverage # Run tests with coverage
```

### Backend
Use JetBrains Rider for running and debugging backend tests.

## Docker Support
Both frontend and backend include Dockerfile configurations for containerized deployment.
