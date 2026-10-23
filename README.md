# Flame Phoenix

**Company Operations and Project Management Platform**

Flame Phoenix is a full-stack web application designed to help manage client projects, coordinate staff activities, and track project progress through a centralized platform.

## Features

### Client
- Register and log in.
- Submit project requirements.
- View project information and track progress, according to implemented features.

### Staff
- Log in to the staff dashboard.
- View assigned projects.
- Update project statuses where permitted.

### Admin
- Access the administration dashboard.
- View and manage project information.
- Create staff accounts and assign projects.
- View registered users through User Management.

## Technology Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **API communication:** Axios
- **Authentication:** JWT-based authentication

## Project Structure

```text
flame-phoenix/
├── client/       # React frontend
├── server/       # Express backend
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB Atlas access and a database connection string
- Git

## Local Setup

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd flame-phoenix
```

Replace `YOUR_REPOSITORY_URL` with the repository URL from GitHub.

### 2. Configure the backend

Navigate to the server folder:

```bash
cd server
npm install
```

Create or configure your local `.env` file using the variable names documented in `.env.example`. Add your MongoDB connection string and JWT secret privately. Never publish real credentials.

Start the backend:

```bash
npm run dev
```

The backend is configured to use port `5000` in the current development setup.

### 3. Configure the frontend

Open a second terminal at the project root:

```bash
cd client
npm install
npm run dev
```

Open the local frontend URL printed by Vite in the terminal.

## API Routes

The backend currently mounts these route prefixes:

- `/api/auth`
- `/api/projects`
- `/api/staff`
- `/api/admin`

The exact endpoints and request fields should be confirmed from the current route and controller files.

## Security

- Keep `.env` files and all secrets private.
- Never commit passwords, tokens, or private credentials.
- Use appropriate role-based authorization for protected features.
- Do not expose user passwords or sensitive information through API responses.

## Development Status

Flame Phoenix is under active development. Features, setup instructions, and documentation may change as requirements evolve.

## License

No license has been selected yet. All rights reserved unless a license is added by the project owner.
