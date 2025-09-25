# Yeebli - Event Management Platform

Elevate your events with ease. Our platform is designed to be your all-in-one solution for seamlessly managing courses, events, and podcasts, offering unparalleled customization to perfectly align with your brand. Experience blazing-fast performance and a suite of intuitive tools that transform even the most complex workflows into effortless tasks, empowering you to focus on creating and engaging with your audience.

## Features

- **Event Management**: Create, manage, and host live venues, prerecorded events, and live video calls
- **Course Academy**: Build comprehensive courses with articles, lessons, and student management
- **Podcast Platform**: Host and distribute podcasts with advanced audio management
- **Lead Management**: Track and manage leads with automated email sequences and follow-ups
- **Team Collaboration**: Multi-user support with role-based permissions (master, owner, host)
- **Payment Integration**: Stripe integration for seamless payment processing
- **Email Automation**: Automated email sequences for event reminders, follow-ups, and marketing
- **Real-time Communication**: WebSocket support for live interactions and notifications
- **Responsive Design**: Optimized for all devices with modern UI components
- **Multi-language Support**: Internationalization ready with RTL support

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- React Hook Form for form handling
- React Router for navigation
- FullCalendar for event scheduling
- Firebase integration

### Backend
- Hono.js framework
- TypeScript
- MySQL database with Drizzle ORM
- Redis for caching and queues
- WebSocket support
- AWS S3 integration for file storage
- Stripe for payments
- Brevo for email services

## Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm package manager
- MySQL database
- Redis server
- AWS account (for S3 storage)

## Getting Started

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yeebli-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

4. **Development Server**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for Production**
   ```bash
   pnpm build
   ```
   The built files will be in the `build` directory

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd yeebli-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file with the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   SECRET_KEY=your_secret_key
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   REDIS_HOST=localhost
   REDIS_PORT=6379
   STRIPE_SECRET_KEY=your_stripe_secret_key
   BREVO_API_KEY=your_brevo_api_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_S3_BUCKET=your_s3_bucket_name
   ```

4. **Database Setup**
   ```bash
   # Generate database migrations
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   ```

5. **Development Server**
   ```bash
   pnpm dev
   ```
   The API will be available at `http://localhost:3000`

6. **Build for Production**
   ```bash
   pnpm build
   ```

## Deployment

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables**
   Set the following environment variables in your Vercel dashboard:
   - `VITE_API_BASE_URL`: Your production API URL
   - `VITE_FIREBASE_API_KEY`: Your Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID

### Backend Deployment (Docker)

1. **Using Docker Compose**
   ```bash
   # Start all services
   docker-compose up -d
   ```

2. **Manual Docker Build**
   ```bash
   # Build the image
   docker build -t yeebli-backend .
   
   # Run the container
   docker run -p 3000:3000 --env-file .env yeebli-backend
   ```

3. **Production Environment Variables**
   Ensure all required environment variables are set for production:
   - Database connection details
   - Redis connection details
   - AWS credentials
   - Stripe keys
   - Email service credentials

## Development

### Code Quality

- **Linting**: `pnpm lint`
- **Linting with fixes**: `pnpm lint:fix`
- **Type checking**: `pnpm check`
- **Format code**: `pnpm format`

### Database Management

- **Generate migrations**: `pnpm db:generate`
- **Run migrations**: `pnpm db:migrate`
- **Drop database**: `pnpm db:drop`

## Project Structure

```
yeebli-frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── views/         # Page components
│   ├── services/      # API services
│   ├── store/         # State management
│   ├── utils/         # Utility functions
│   └── configs/       # Configuration files

yeebli-backend/
├── src/
│   ├── web/           # Web controllers and routes
│   ├── service/       # Business logic
│   ├── repository/    # Data access layer
│   ├── schema/        # Database schema
│   └── lib/           # Shared utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

