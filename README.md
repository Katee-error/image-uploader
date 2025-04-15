Test Assignment for a TypeScript Developer
Task:
Develop an application for uploading, processing, and displaying images. The application must include a NestJS backend with JWT authorization, background image processing via a queue (BullMQ), use of the Sharp library for image compression, and gRPC for inter-service communication. There should be a total of 3 services: API Gateway (HTTP interaction with the frontend), Auth Service, and Image Processing Service.
The frontend should be implemented using React with TypeScript.
Backend Requirements (NestJS)
	1.	Authorization Service (Auth service)
	▪	Implement user registration and login (email + password)	▪	Use JWT for authentication	▪	Secure routes requiring authorization	2.	Image Processing Service
	▪	Create a gRPC endpoint for image uploads (including authorization check)	▪	Save the original image to storage (S3 Minio)	▪	Record information about the uploaded image in the database (PostgreSQL)	▪	DB fields: id, original name, file path, processing status, dimensions, user id, upload date	▪	Create a gRPC endpoint to provide information about the user's last uploaded image	3.	Image Processing (BullMQ + Sharp)
	▪	Create a queue for processing uploaded images	▪	Use the Sharp library to:
	◦	Convert to webp with 80% quality	▪	Update the processing status in the DB	▪	Save processed images to S3	4.	API Gateway
	▪	Methods:
	◦	Image upload (stream)	◦	Get image information	◦	Get optimized image version	5.	Docker:
	▪	docker-compose
Frontend Requirements (React + TypeScript)
	1.	Authorization/Registration Page
	▪	Login form (email + password)	▪	Registration form (email + password + password confirmation)	▪	Error handling and display	2.	Main Page
	▪	Button to upload a new image	▪	Display of the uploaded image:
	◦	The image itself (if processed)	◦	Processing status	◦	Upload date
Use of UI libraries for the project is also permitted.
Technology Stack
Backend
	•	NestJS	•	Typescript	•	PostgreSQL	•	TypeORM	•	BullMQ + Redis	•	Sharp	•	gRPC	•	JWT
Frontend
	•	React 18+	•	TypeScript	•	React Query
Optional Tasks (Bonus)
	1.	Implement retrieving data about the processed image via WebSockets
Recommendations
	•	Use ready-made templates and solutions to speed up development.	•	Rely on TypeScript for typing throughout the project.	•	Pay attention to code structure and maintainability/readability.	•	Test functionality before submission, ensuring all specification requirements are correctly implemented.