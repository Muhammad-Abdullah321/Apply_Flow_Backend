/**
 * Central Route Aggregation File
 * 
 * This file serves as a reference for all available routes in the application.
 * Individual route handlers are defined in their respective module router files.
 * 
 * Routes are mounted in src/app.ts
 */

// Auth Routes: /api/auth/*
// - POST /auth/register - User registration
// - POST /auth/verify-otp - Email verification
// - POST /auth/login - User login
// - GET /auth/me - Get current session
// - POST /auth/forgot-password - Request password reset
// - POST /auth/reset-password - Reset password
// - POST /auth/logout - User logout
// - POST /auth/resend-otp - Resend OTP

// User Routes: /api/users/*
// - GET /users/me - Get user profile
// - PUT /users/me - Update user profile
// - DELETE /users/me - Delete account
// - POST /users/me/password - Change password

// Application Routes: /api/applications/*
// - GET /applications - List all applications (paginated)
// - POST /applications - Create new application
// - GET /applications/:id - Get application details
// - PATCH /applications/:id - Update application
// - PATCH /applications/:id/status - Update application status
// - POST /applications/:id/notes - Add note to application
// - DELETE /applications/:id - Delete application

// Resume Routes: /api/resumes/*
// - GET /resumes - List all resumes
// - GET /resumes/:id - Get resume details
// - POST /resumes - Upload new resume
// - PATCH /resumes/:id - Update resume
// - DELETE /resumes/:id - Delete resume

// Dashboard Routes: /api/dashboard/*
// - GET /dashboard - Get dashboard statistics

// Settings Routes: /api/settings/*
// - GET /settings - Get all settings
// - GET /settings/:key - Get specific setting
// - PATCH /settings - Update user settings
// - PUT /settings - Replace user settings
// - PATCH /settings/system - Update system settings

// Middleware: authMiddleware required for all routes except /auth/*

export {};
