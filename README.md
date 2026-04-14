# FINAPP Frontend

A modern, high-performance financial management dashboard built with Next.js 15. FINAPP provides users with a comprehensive view of their financial health through interactive visualizations, AI-powered assistance, and real-time data sync.

## 🚀 Technologies

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Shadcn/UI, MUI Icons
- **State Management:** Zustand
- **Forms & Validation:** React Hook Form + Zod
- **Visualizations:** ApexCharts
- **Real-time:** Socket.io-client
- **PDF Generation:** jsPDF
- **Cloud Media:** Cloudinary & Next-Cloudinary
- **Database (Client-side):** Firebase

## ✨ Key Features

- **Interactive Dashboard:** Dynamic overview of financial status with real-time updates and responsive charts.
- **Deep Financial Analysis:**
  - **Expense & Income Analysis:** Detailed breakdown of cash flow.
  - **Debt Analysis:** Visualizing debt payoff progress and interest impacts.
  - **Goal Tracking:** Visual progress bars and milestone management for savings goals.
- **AI Chatbot:** Integrated financial assistant for answering queries and providing insights.
- **Advanced Admin Suite:**
  - User management and system overview.
  - Analytics reports and content management.
  - Real-time admin-user chat support.
- **Premium Access:** Integrated subscription checks; premium features are gated based on Stripe subscription status.
- **Responsive Design:** Optimized for all screen sizes with a premium, dark-themed aesthetic.

## 📁 Project Structure

```text
src/
├── app/              # Next.js pages and layouts (Routes)
├── components/       # UI components (Base, User, Admin, Guest)
├── hooks/            # Custom React hooks
├── lib/              # Shared library configurations
├── service/          # API service layer (Axios instances)
├── stores/           # Zustand store definitions
├── types/            # TypeScript interfaces and types
└── utils/            # Helper functions (Formatters, Validators)
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+)
- Backend server running (FINAPP_BACKEND)

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd FINAPP_FRONTEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with your `NEXT_PUBLIC_API_URL`, Firebase config, and Cloudinary credentials.
4. Start development server:
   ```bash
   npm run dev
   ```

## 🔐 Middleware & Security
The application uses Next.js middleware (`src/middleware.ts`) to handle:
- Route protection (Public vs. Private).
- Role-based redirection (Admin vs. User).
- Subscription validation for premium financial modules.
