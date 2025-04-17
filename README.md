# Image Processing Application

This is a full-stack TypeScript application for uploading, processing, and displaying images. The application includes a NestJS backend with JWT authorization, background image processing via BullMQ, image compression using Sharp, and gRPC for inter-service communication.

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd image-uploader
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
