# RENGY CRM - Mini CRM Application

A full-stack MERN (MongoDB, Express, React, Node.js) mini-CRM application with secure authentication, contact management, and activity logging.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes (frontend and backend)
- Token refresh mechanism
- Rate limiting (3 requests per 10 minutes for login)

### CRM Module
- Contact management (CRUD operations)
- Contact fields: Name, Email, Phone, Company, Status, Notes
- Status options: Lead, Prospect, Customer
- Search by name or email
- Filter by status
- Pagination (10 items per page)
- Activity logging (create, update, delete events)
- CSV export for contacts

### Frontend
- React with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling 
- Responsive design
- Form validation
- Protected routes
- Activity logs display

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-rate-limit for rate limiting

### Frontend
- React 18
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios
- React Paginate

## Project Structure

```
RENGY/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   └── activityController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Contact.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── contacts.js
│   │   └── activities.js
│   ├── utils/
│   │   └── activityLogger.js
│   ├── tests/
│   │   └── api.test.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx
    │   ├── store/
    │   │   ├── index.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── contactSlice.js
    │   │       └── activitySlice.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rengy_crm
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Contacts
- `GET /api/contacts` - Get all contacts (with pagination, search, filter)
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/contacts/export` - Export contacts as CSV

### Activities
- `GET /api/activities` - Get all activities

## Deployment

### Backend Deployment (Render/Railway)
1. Push your code to GitHub
2. Connect your repository to Render or Railway
3. Set environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret
   - `JWT_EXPIRE` - Token expiration time
   - `NODE_ENV` - production

### Frontend Deployment (Vercel/Netlify)
1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Set environment variables:
   - `VITE_API_URL` - Your backend API URL

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/rengy_crm |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT token expiration | 7d |
| NODE_ENV | Environment | development |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## Architecture

### Authentication Flow
1. User registers or logs in with credentials
2. Backend validates and returns JWT token
3. Token is stored in localStorage
4. Token is included in Authorization header for protected requests
5. Middleware verifies token on protected routes
6. Token auto-refresh mechanism maintains session

### State Management (Redux Toolkit)
- **authSlice**: User authentication state
- **contactSlice**: Contacts list and CRUD operations
- **activitySlice**: Activity logs

### Data Models

#### User
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (enum: admin, user)
- createdAt: Date

#### Contact
- user: ObjectId (ref: User)
- name: String (required)
- email: String (required)
- phone: String
- company: String
- status: String (enum: lead, prospect, customer)
- notes: String
- createdAt: Date
- updatedAt: Date

#### ActivityLog
- user: ObjectId (ref: User)
- action: String (enum: create, update, delete, login, logout)
- contact: ObjectId (ref: Contact)
- description: String
- createdAt: Date

