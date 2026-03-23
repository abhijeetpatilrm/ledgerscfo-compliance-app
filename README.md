# Compliance Tracker App

A simple full-stack app to manage compliance tasks for multiple clients.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Axios
- Node.js
- Express
- MongoDB

## Project Structure

- `server/` - Express + MongoDB API
- `client/` - React frontend with Vite + Tailwind

## Backend Setup (`server`)

1. Create a `.env` file in `server/` with:

	```env
	MONGO_URI=your_mongodb_connection_string
	PORT=5000
	```

2. Install and run:

	```bash
	npm install
	npm run dev
	```

Backend runs on `http://localhost:5000` and `GET /` returns `API is running`.

## Frontend Setup (`client`)

1. Install and run:

	```bash
	npm install
	npm run dev
	```

Optional API URL override in `client/.env`:

```env
VITE_API_URL=https://ledgerscfo-compliance-app.onrender.com
```
