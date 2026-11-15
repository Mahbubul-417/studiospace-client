# StudioSpace

**StudioSpace** is a creative studio booking platform where users can discover, list, and book creative spaces for photography, videography, podcasting, music production, and other creative activities.

🌐 **Live Website:** [Add Your Deployed Client URL Here]

---

## ✨ Features

- **User Authentication:** Register and log in using email/password or Google authentication.
- **Explore Studios:** Browse available creative studios with search, category filtering, and price sorting.
- **Studio Details:** View studio descriptions, images, locations, pricing, capacity, and amenities.
- **Studio Management:** Hosts can add, edit, and delete their studio listings.
- **Multiple Image Options:** Upload studio images or provide an image URL.
- **Booking System:** Users can submit booking requests for their preferred studios.
- **Booking Management:** Customers can view their bookings and cancel pending requests.
- **Host Dashboard:** Hosts can view booking requests and confirm or cancel them.
- **Booking Conflict Prevention:** Prevents overlapping confirmed bookings for the same studio.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Dark and Light Mode:** Switch between different theme preferences.

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Lucide React
- Sonner
- Swiper
- Next Themes

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Better Auth
- JWT Authentication
- ImgBB API

---

## ⚙️ Local Setup

Follow these steps to run StudioSpace locally.

### Prerequisites

- Node.js
- npm
- MongoDB database
- Google OAuth credentials
- ImgBB API key

### 1. Clone the repositories

Clone both the frontend and backend repositories.

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
git clone <YOUR_BACKEND_REPOSITORY_URL>
```

### 2. Set up the Backend

Navigate to the backend directory:

```bash
cd studiospace-server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend root directory and configure:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
AUTH_BASE_URL=http://localhost:3000
AUTH_JWKS_URL=http://localhost:3000/api/auth/jwks
```

Start the backend development server:

```bash
npm run dev
```

The backend will run at:

`http://localhost:5000`

### 3. Set up the Frontend

Navigate to the frontend directory:

```bash
cd studiospace
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the frontend root directory and configure the required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

Make sure your Google OAuth configuration includes this authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

Start the frontend development server:

```bash
npm run dev
```

Open the application:

`http://localhost:3000`

---

## 🔐 Examiner Test Credentials

Use the following credentials to test the application.

| Field | Value |
|---|---|
| Website URL | Add deployed website URL |
| Test Email | Add examiner test email |
| Test Password | Add examiner test password |

---

## 📁 Project Structure

### Frontend
- `src/app/` – Application pages and routes.
- `src/components/` – Reusable UI components.
- `src/lib/` – Authentication and shared utilities.

### Backend
- `src/controllers/` – API request handlers.
- `src/routes/` – API routes.
- `src/middleware/` – Authentication middleware.
- `src/types/` – TypeScript interfaces and types.

---

## 👨‍💻 Developer

**Project Name:** StudioSpace

**Project Type:** Creative Studio Booking Platform

**Frontend:** Next.js and TypeScript

**Backend:** Express.js and MongoDB
