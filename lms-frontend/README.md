# LMS Application

This is a Learning Management System (LMS) application with a React frontend and Express.js backend.

## Setup

### Frontend Setup

1. Install dependencies:
```bash
cd lms-frontend
npm install
```

2. Create a `.env` file in the root directory with:
```
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file in the server directory with:
```
PORT=5000
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

3. Start the server:
```bash
npm run dev
```

## Features

- User authentication with email/password
- Social login with Google and Facebook
- JWT-based authentication
- Protected routes
- Modern UI with responsive design
- Dark mode theme

## Tech Stack

### Frontend
- React
- React Router DOM
- Axios
- Material-UI

### Backend
- Express.js
- JSON Web Tokens (JWT)
- Passport.js
- CORS

## Development

The application is set up with a development environment that includes:
- Hot Module Replacement (HMR)
- ESLint for code linting
- Prettier for code formatting
- Development server with proxy configuration

## Production

To build for production:

1. Frontend:
```bash
cd lms-frontend
npm run build
```

2. Backend:
```bash
cd server
npm start
```

## License

MIT
