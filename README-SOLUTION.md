# Image Processing Application

This is a full-stack TypeScript application for uploading, processing, and displaying images. The application includes a NestJS backend with JWT authorization, background image processing via BullMQ, image compression using Sharp, and gRPC for inter-service communication.

## Architecture

The application consists of the following components:

### Backend Services

1. **Auth Service**: Handles user registration, login, and token validation. Runs on HTTP port 3001 and gRPC port 50051.
2. **Image Service**: Manages image uploads, storage, and processing. Runs on HTTP port 3002 and gRPC port 50052.
3. **API Gateway**: Provides HTTP endpoints for the frontend and WebSocket support. Runs on HTTP port 3003 and communicates with the Auth and Image services via gRPC.

### Service Communication

- The Auth Service and Image Service expose gRPC endpoints that the API Gateway consumes.
- The API Gateway acts as a client to both services, forwarding requests from the frontend.
- The frontend communicates only with the API Gateway via HTTP REST endpoints and WebSockets.

### Frontend

A React application with TypeScript, Chakra UI, and React Query for data fetching.

## Technologies Used

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- BullMQ + Redis
- Sharp
- gRPC
- JWT
- Minio (S3-compatible storage)

### Frontend
- React 18+
- TypeScript
- React Query
- Chakra UI
- Vite

## Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd image-processing-app
```

### 2. Start the infrastructure services

```bash
docker-compose -f docker/docker-compose.yml up -d
```

This will start PostgreSQL, Redis, and Minio.

### 3. Install dependencies

```bash
# Install backend dependencies
cd backend/auth-service && npm install
cd ../image-service && npm install
cd ../api-gateway && npm install

# Install frontend dependencies
cd ../../frontend && npm install
```

### 4. Generate gRPC client code

```bash
cd backend/auth-service && npm run proto:generate
cd ../image-service && npm run proto:generate
cd ../api-gateway && npm run proto:generate
```

### 5. Start the backend services

```bash
# Start Auth Service (HTTP on port 3001, gRPC on port 50051)
cd backend/auth-service && npm run start:dev

# Start Image Service (HTTP on port 3002, gRPC on port 50052)
cd backend/image-service && npm run start:dev

# Start API Gateway (HTTP on port 3003)
cd backend/api-gateway && npm run start:dev
```

### 6. Start the frontend

```bash
cd frontend && npm run dev
```

The frontend will be available at http://localhost:3000.

## Features

- User registration and login
- JWT authentication
- Image upload
- Background image processing (conversion to WebP with 80% quality)
- Real-time updates via WebSockets
- Responsive UI with Chakra UI

## API Endpoints

### Auth

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

### Images

- `POST /api/images/upload` - Upload an image
- `GET /api/images/last` - Get the user's last uploaded image
- `GET /api/images/:id` - Get image by ID
- `GET /api/images/:id/optimized` - Get optimized image by ID

## WebSocket Events

- `subscribe:image` - Subscribe to updates for a specific image
- `unsubscribe:image` - Unsubscribe from updates for a specific image
- `image:update` - Event emitted when an image is updated

## Project Structure

```
/
├── frontend/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   ├── context/           # Context providers
│   │   ├── types/             # TypeScript types/interfaces
│   │   └── utils/             # Utility functions
│   ├── vite.config.ts         # Vite configuration
│   └── package.json           # Frontend dependencies
│
├── backend/
│   ├── api-gateway/           # API Gateway service
│   │   ├── src/
│   │   │   ├── auth/          # Auth module
│   │   │   ├── image/         # Image module
│   │   │   └── websocket/     # WebSocket module
│   │   └── package.json       # Service dependencies
│   │
│   ├── auth-service/          # Auth service
│   │   ├── src/
│   │   │   ├── auth/          # Auth module
│   │   │   └── entities/      # TypeORM entities
│   │   └── package.json       # Service dependencies
│   │
│   ├── image-service/         # Image service
│   │   ├── src/
│   │   │   ├── image/         # Image module
│   │   │   └── entities/      # TypeORM entities
│   │   └── package.json       # Service dependencies
│   │
│   └── proto/                 # Shared gRPC protocol definitions
│       ├── auth.proto         # Auth service protocol
│       └── image.proto        # Image service protocol
│
└── docker/                    # Docker configuration
    └── docker-compose.yml     # Service orchestration
```

## Environment Variables

Create `.env` files in each service directory with the following variables:

### Auth Service

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=image_app
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
GRPC_URL=0.0.0.0:50051
HTTP_PORT=3001
```

### Image Service

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=image_app
REDIS_HOST=localhost
REDIS_PORT=6379
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_S3_ENDPOINT=http://localhost:9000
AWS_S3_BUCKET=images
GRPC_URL=0.0.0.0:50052
HTTP_PORT=3002
```

### API Gateway

```
AUTH_SERVICE_URL=localhost:50051
IMAGE_SERVICE_URL=localhost:50052
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
PORT=3003
CORS_ORIGIN=http://localhost:3000
```

## License

This project is licensed under the MIT License.
