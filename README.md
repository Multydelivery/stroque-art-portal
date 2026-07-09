# Stroque Art Portal

Stroque Art Portal is a Next.js application for connecting businesses with artists for custom artwork projects. Businesses can browse artist profiles, filter by style, location, service, and budget, then send project requests. Artists can manage their profiles, portfolio images, services, pricing, and incoming requests.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose for production-style data storage
- In-memory test data for local demo mode

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

For local testing without MongoDB, set:

```env
USE_TEST_DATA=true
AUTH_SECRET=local-development-auth-secret-change-before-deploying
```

Run the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://127.0.0.1:3000
```

If port `3000` is already in use, Next.js will automatically choose another port.

## Demo Mode

When `USE_TEST_DATA=true`, the app uses in-memory demo data instead of connecting to MongoDB. This is useful for testing the UI and main workflows without setting up a database.

Demo data resets when the dev server restarts.

## Demo Logins

Use these accounts when `USE_TEST_DATA=true`:

Artist account:

```text
Email: artist@example.com
Password: password123
```

Business account:

```text
Email: business@example.com
Password: password123
```

## MongoDB Mode

To use a real database, set `USE_TEST_DATA=false` or remove it, then provide a valid MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/stroque-art-portal
AUTH_SECRET=replace-with-a-long-random-secret
```

Never commit real database credentials, API keys, or production secrets.

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Environment Variables

```env
USE_TEST_DATA=true
MONGODB_URI=mongodb://127.0.0.1:27017/stroque-art-portal
AUTH_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Cloudinary variables are only needed for image upload features.
