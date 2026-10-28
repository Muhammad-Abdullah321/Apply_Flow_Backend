# Apply Flow Backend

A professional job application management system backend built with **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

## Features

- ✅ User Authentication (Registration, Login, Email Verification)
- ✅ Password Management (Forgot/Reset, Change Password)
- ✅ User Profile Management
- ✅ Job Application Tracking (CRUD operations)
- ✅ Resume Upload & Management
- ✅ Application Status History
- ✅ Dashboard Statistics
- ✅ Settings Management (User & System)
- ✅ JWT Token-based Authentication
- ✅ File Upload with Multer

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js v5.x
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer
- **Email:** Nodemailer (Gmail SMTP)
- **Validation:** Zod
- **Code Quality:** ESLint + Prettier

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── database.config.ts    # Prisma & database setup
│   └── dotenv.config.ts      # Environment variables
├── constants/           # Application constants
│   └── response.constants.ts # API response messages
├── lib/                 # Utilities & libraries
│   └── prisma.ts        # Prisma client instance
├── middlewares/         # Express middlewares
│   ├── auth.middleware.ts    # JWT authentication
│   ├── error.middleware.ts   # Error handling
│   └── upload.middleware.ts  # File upload handling
├── modules/             # Feature modules (MVC pattern)
│   ├── auth/           # Authentication module
│   ├── users/          # User profile module
│   ├── applications/   # Job applications module
│   ├── resumes/        # Resume management module
│   ├── dashboard/      # Dashboard statistics
│   └── settings/       # System settings
├── prisma/             # Database schema & migrations
├── routes/             # Route documentation
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── app.ts              # Express app configuration
└── server.ts           # Server entry point
```

## Installation

### Prerequisites

- Node.js 18+ or higher
- npm or yarn
- PostgreSQL 12+ or higher

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Muhammad-Abdullah321/Apply_Flow_Backend.git
   cd Apply_Flow_Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp example.env .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/apply_flow"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_APP_PASSWORD="your-16-char-app-password"
   JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
   JWT_EXPIRES_IN="7d"
   ```

4. **Setup PostgreSQL Database:**
   ```bash
   # Create database (if not exists)
   createdb apply_flow
   ```

5. **Run Prisma migrations:**
   ```bash
   npm run prisma:migrate
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otpCode": "123456"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <JWT_TOKEN>
```

### User Profile Endpoints

#### Get Profile
```http
GET /api/users/me
Authorization: Bearer <JWT_TOKEN>
```

#### Update Profile
```http
PUT /api/users/me
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "city": "New York",
  "linkedinUrl": "https://linkedin.com/in/janedoe"
}
```

#### Change Password
```http
POST /api/users/me/password
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

#### Delete Account
```http
DELETE /api/users/me
Authorization: Bearer <JWT_TOKEN>
```

### Application Endpoints

#### Get All Applications
```http
GET /api/applications
Authorization: Bearer <JWT_TOKEN>
```

#### Create Application
```http
POST /api/applications
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "company": "Tech Corp",
  "jobTitle": "Senior Developer",
  "jobURL": "https://company.com/jobs/123",
  "jobType": "FULL_TIME",
  "location": "Remote",
  "applicationDate": "2024-10-28T00:00:00Z",
  "status": "APPLIED",
  "jobDescription": "Job description here..."
}
```

#### Update Application Status
```http
PATCH /api/applications/:id/status
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "status": "INTERVIEW"
}
```

#### Add Note to Application
```http
POST /api/applications/:id/notes
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "note": "Follow up scheduled for next week"
}
```

### Resume Endpoints

#### Upload Resume
```http
POST /api/resumes
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

file: <binary file>
name: "My Resume 2024"
```

#### Get All Resumes
```http
GET /api/resumes
Authorization: Bearer <JWT_TOKEN>
```

#### Delete Resume
```http
DELETE /api/resumes/:id
Authorization: Bearer <JWT_TOKEN>
```

### Dashboard Endpoint

#### Get Dashboard Statistics
```http
GET /api/dashboard?period=month
Authorization: Bearer <JWT_TOKEN>
```

Query Parameters:
- `period`: `week`, `month`, `year` (optional)

## Available Scripts

```bash
# Development server (auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format:fix

# Create migration
npm run prisma:migrate:create

# Run migrations
npm run prisma:migrate
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-min-32-chars` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `EMAIL_USER` | Gmail address for sending emails | `your-email@gmail.com` |
| `EMAIL_APP_PASSWORD` | Gmail app-specific password | `xxxx xxxx xxxx xxxx` |

## Database Schema

### User Model
- `id` (UUID)
- `name` (String)
- `email` (String, unique)
- `password` (String, encrypted)
- `phone`, `address`, `city`, `country` (Optional profile fields)
- `linkedinUrl`, `githubUrl`, `bio` (Optional social links)
- `isEmailVerified` (Boolean)
- `otpCode`, `otpExpiresAt` (For email verification)
- `resetPasswordOtp`, `resetPasswordOtpExpiresAt` (For password reset)
- `createdAt`, `updatedAt` (Timestamps)

### Application Model
- `id` (UUID)
- `userId` (Foreign Key)
- `company`, `jobTitle` (String)
- `jobURL`, `location` (Optional)
- `jobType` (Enum: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, TEMPORARY)
- `applicationDate` (DateTime)
- `status` (Enum: APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED, GHOSTED, WITHDRAWN)
- `minSalary`, `maxSalary`, `currency` (Optional)
- `jobDescription`, `Notes` (Optional)
- `resumeId` (Foreign Key, optional)

### Resume Model
- `id` (UUID)
- `userId` (Foreign Key)
- `name`, `fileName`, `fileType`, `fileUrl` (String)
- `createdAt`, `updatedAt` (Timestamps)

## Security Features

- ✅ JWT-based authentication
- ✅ Password encryption with bcrypt
- ✅ Email verification with OTP
- ✅ CORS configuration (restricted to frontend origin)
- ✅ Secure cookies (HttpOnly flag)
- ✅ Input validation with Zod
- ✅ Error handling middleware

## Development

### Code Quality

```bash
# Lint TypeScript files
npm run lint

# Format code with Prettier
npm run format:fix

# Check TypeScript types
npx tsc --noEmit
```

### Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "feat: description"`
3. Push to remote: `git push origin feature/feature-name`
4. Create Pull Request on GitHub

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run migrations: `npm run prisma:migrate`

### JWT Authentication Failed
- Check if token is included in `Authorization` header
- Verify `JWT_SECRET` matches between login and verification
- Check token expiration time

### File Upload Issues
- Ensure `/uploads` directory exists
- Check file size limits in multer middleware
- Verify file permissions

### Email Not Sending
- Enable "Less secure app access" or use App Password
- Verify `EMAIL_USER` and `EMAIL_APP_PASSWORD` in `.env`
- Check SMTP settings for Gmail

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions, create an issue on [GitHub Issues](https://github.com/Muhammad-Abdullah321/Apply_Flow_Backend/issues)

## Changelog

### v1.0.0 (Current)
- ✅ Initial release with core features
- ✅ Authentication system
- ✅ Application management
- ✅ Resume management
- ✅ Dashboard
