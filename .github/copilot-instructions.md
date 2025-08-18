# Copilot Instructions for ULEAM Conecta Frontend

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is the frontend for ULEAM Conecta, a student marketplace platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Code Style Guidelines

- Use TypeScript for all components and utilities
- Follow Next.js 14 App Router conventions
- Use Tailwind CSS for styling with custom ULEAM brand colors
- Implement responsive design (mobile-first approach)
- Use modular component architecture
- Follow React hooks best practices
- Implement proper error handling and loading states

## Project Structure

- `/src/app` - App Router pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and API clients
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks
- `/src/context` - React context providers
- `/src/constants` - Application constants and configurations

## API Integration

- Base API URL: http://localhost:3000/api
- Use fetch or axios for API calls
- Implement proper error handling for API responses
- Use React Query/TanStack Query for data fetching and caching

## Authentication

- JWT-based authentication
- Store tokens securely
- Implement route protection for authenticated pages
- Handle token refresh automatically

## Design System

- Primary Colors: ULEAM blue (#1e40af), accent colors from university branding
- Typography: Use modern, clean fonts (Inter or similar)
- Components should be accessible (ARIA labels, keyboard navigation)
- Consistent spacing and sizing using Tailwind's design tokens

## Features to Implement

- User authentication (login, register, email verification)
- Service marketplace (listing, search, filters)
- User profiles (buyer and seller views)
- Order management system
- Review and rating system
- Admin dashboard
- Real-time chat system
- File upload functionality
- Responsive design for all screen sizes
