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

New Business and Artist signups require a phone number containing 7 to 15 digits. An optional leading `+`, spaces, parentheses, periods, and hyphens are accepted. Phone numbers are saved with the account in MongoDB or demo memory; SMS verification is not included. Existing accounts can still log in without a phone number.

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

Administrator account:

```text
Email: admin@example.com
Password: password123
```

Administrator accounts are not available through public signup. In MongoDB mode, create an administrator user directly with a bcrypt-hashed password and `role: "admin"`.

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

## Business Profile Workflow

Open **Business profile** from the business dashboard to edit the business name, industry, location, and optional company photo or logo. The completion indicator tracks the three required fields and distinguishes saved information from unsaved changes.

Choose **Review profile** to validate and preview the information. Use **Edit profile** to make corrections, or **Save & Continue** to save and open project creation. Failed saves stay on the review screen and display an error. Business names and industries containing only whitespace are not accepted. You can return to the business profile at any time to edit it.

## Project Draft Workflow

Open **My Projects** and choose **Create New Project**. New projects require a title, category, detailed description, deliverables, timeline, due date, and a fixed project budget from **$100 to $10,000 USD**, with at most two decimal places. The initial categories use the existing art types: Mural, Canvas painting, Digital illustration, Sculpture, Mixed media, Installation art, Portrait, and Abstract.

Dimensions, special requirements, preferred artist style/experience, and reference files are optional. Reference uploads support up to eight JPG, PNG, WebP, GIF, or PDF files, up to 10 MB each, and require Cloudinary configuration (including in demo mode).

Choose **Review project** to preview all details, then **Save Draft**. Saved drafts appear in **My Projects** and can be edited or deleted. Drafts are private: they cannot use artist matching, send requests, or be opened through the existing reopen action. Publishing is a separate workflow and is not included yet. Existing open/closed projects retain their original budget-range editing and artist-request flow. MongoDB saves drafts persistently; demo drafts reset when the server restarts.
