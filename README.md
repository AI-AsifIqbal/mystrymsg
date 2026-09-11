# 🕵️‍♂️ Mystery Message

A full-stack, anonymous messaging and feedback platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **MongoDB**. Users can create an account, verify their email via OTP, share their unique public profile link, receive anonymous messages, toggle message acceptance, and leverage **Google Gemini AI** for smart question suggestions.

---

## ✨ Features

- **🔐 Secure Authentication**: Custom credential-based authentication using **NextAuth.js** with JWT session management, bcryptjs password hashing, and Next.js 16 route protection (`proxy.ts`).
- **📧 Email Verification**: One-time password (OTP) verification sent directly to the user's inbox powered by **Resend** and **React-Email**.
- **🔗 Unique Public Profiles**: Shareable public link (`/u/[username]`) where anyone can submit anonymous questions or feedback without an account.
- **🤖 AI-Powered Suggestions**: Integrated with **Google Gemini (`gemini-3.5-flash-lite`)** via Vercel AI SDK to stream suggested, engaging questions.
- **📊 Interactive Dashboard**:
  - Live message feed with timestamp formatting via Day.js.
  - Delete individual messages with confirmation modals.
  - Instant toggle switch to pause or resume accepting incoming messages.
  - One-click copy for profile URLs with toast notifications.
- **🎨 Modern UI & Aesthetics**:
  - Styled with **Tailwind CSS v4** and **Shadcn / Base UI** components.
  - Typography powered by **Plus Jakarta Sans**.
  - Animated testimonial carousel using **Embla Carousel**.
  - Non-blocking toast notifications.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via `next/font/google`
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (JWT Strategy)
- **AI & LLM**: [Vercel AI SDK](https://sdk.vercel.ai/) (`@ai-sdk/google`)
- **Email Service**: [Resend](https://resend.com/) & [React Email](https://react.email/)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 📁 Project Structure

```text
mystrymsg/
├── emails/                         # React Email templates
│   └── VerificationEmail.tsx
├── public/                         # Static assets & icons
├── src/
│   ├── app/
│   │   ├── (app)/                  # Authenticated & main app routes
│   │   │   ├── dashboard/          # User message management dashboard
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx            # Landing page with animated carousel
│   │   ├── (auth)/                 # Authentication flow
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── verify/[username]/
│   │   ├── api/                    # Serverless Next.js API route handlers
│   │   │   ├── accept-messages/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── check-username-unique/
│   │   │   ├── delete-message/[messageid]/
│   │   │   ├── get-messages/
│   │   │   ├── send-message/
│   │   │   ├── sign-up/
│   │   │   ├── suggest-messages/
│   │   │   └── verify-code/
│   │   ├── u/[username]/           # Public anonymous message submission page
│   │   ├── globals.css             # Theme tokens & Tailwind CSS configuration
│   │   └── layout.tsx              # Root HTML layout & font declarations
│   ├── components/                 # Reusable React components & UI primitives
│   │   ├── ui/                     # Shadcn components (button, card, dialog, toast, etc.)
│   │   ├── MessageCard.tsx
│   │   └── Navbar.tsx
│   ├── context/                    # React Context providers (AuthProvider)
│   ├── helpers/                    # Helper functions (sendVerificationEmail)
│   ├── lib/                        # Connection instances (dbConnect, resend)
│   ├── model/                      # Mongoose data models (User, Message)
│   ├── proxy.ts                    # Next.js 16 Edge route protection & proxy
│   ├── schemas/                    # Zod validation schemas
│   └── types/                      # TypeScript declarations & NextAuth augmentation
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18.17 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- Package manager (`npm`, `pnpm`, or `yarn`)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mystrymsg.git
cd mystrymsg
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# MongoDB Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/mystrymsg?retryWrites=true&w=majority"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"

# Resend Email API Key
RESEND_API_KEY="re_your_resend_api_key"

# Google Generative AI (Gemini) API Key
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/sign-up` | Register a new user and dispatch verification OTP | ❌ |
| `POST` | `/api/verify-code` | Verify email with 6-digit OTP code | ❌ |
| `GET` | `/api/check-username-unique` | Validate whether a username is available | ❌ |
| `POST` | `/api/send-message` | Send an anonymous message to a target user | ❌ |
| `POST` | `/api/suggest-messages` | Generate conversational questions with Gemini AI | ❌ |
| `GET` | `/api/get-messages` | Retrieve all incoming messages for the logged-in user | ✅ |
| `DELETE` | `/api/delete-message/[messageid]` | Delete a specific message by ID | ✅ |
| `GET` | `/api/accept-messages` | Check if user is currently accepting messages | ✅ |
| `POST` | `/api/accept-messages` | Toggle acceptance state for incoming messages | ✅ |

---

## 🛡️ Route Protection

Route authorization is handled at the network edge using Next.js 16's `proxy.ts`:
- Unauthenticated visitors attempting to access `/dashboard` are automatically redirected to `/sign-in`.
- Logged-in users attempting to visit `/sign-in`, `/sign-up`, or `/verify` are redirected straight to `/dashboard`.

---

## 📦 Production Build

To test and build the production bundle:

```bash
npm run build
npm run start
```

---

## 📄 License

This project is licensed under the MIT License. Feel free to use and customize it for your own applications.

