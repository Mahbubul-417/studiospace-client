# StudioSpace

StudioSpace is a studio discovery and booking platform where users can explore creative spaces, view studio details, create listings, and manage bookings.

## Live Website

- **Frontend:** https://studiospace-site.vercel.app/
- **Backend API:** https://studiospace-server-gqag.onrender.com/

## Features

- Email and password authentication.
- Google sign-in.
- Browse and explore studio listings.
- Search and filter studios.
- View studio details, photos, amenities, location, and pricing.
- Create, edit, and manage studio listings.
- Upload studio images using ImgBB.
- Submit studio booking requests.
- View personal bookings and booking statuses.
- Studio owners can manage booking requests, including confirming or cancelling them.
- Prevent overlapping bookings for the same studio and time.
- Responsive interface for desktop, tablet, and mobile.
- Light and dark theme support.

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- DaisyUI
- Better Auth
- MongoDB
- Google OAuth
- ImgBB
- Sonner
- Lucide React

## Getting Started

### 1. Clone the repository

```bash
git clone <FRONTEND_GITHUB_REPOSITORY_URL>
cd <FRONTEND_PROJECT_FOLDER>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Replace each placeholder with your own values. Do not commit `.env.local` or publish secret values.

For local development, the frontend uses `http://localhost:3000` for Better Auth and `http://localhost:5000` for the backend API. The deployed application uses the production environment variables configured in Vercel.

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Create a production build

```bash
npm run build
```

To run the production build locally:

```bash
npm start
```

## Examiner Test Account

Use the dedicated test account below to evaluate the application.

- **Email:** `testaccount@gmail.com`
- **Password:** `abcDef123?`


## Backend Repository

The backend source code is maintained in a separate repository:

- **Backend GitHub:** <https://github.com/Mahbubul-417/studiospace-server>

## Deployment

The frontend is deployed on Vercel:

- https://studiospace-site.vercel.app/

The backend API is deployed on Render:

- https://studiospace-server-gqag.onrender.com/

---

Developed as a full-stack studio discovery and booking application.
