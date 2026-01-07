# Donation Campaign Application

A full-stack web platform for donation campaigns with payment integration via Midtrans.

## Project Structure

```
tangansatu/
├── backend/          # Express.js API server
├── frontend/         # Public-facing React app
└── admin/            # Admin dashboard (shadcn-admin)
```

## Tech Stack

### Backend
- Express.js with TypeScript
- MySQL database
- JWT authentication
- Midtrans payment gateway
- Nodemailer for emails
- Sharp for image processing

### Frontend (Public)
- React 19 with TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Router
- TanStack Query

### Admin Dashboard
- React with TypeScript
- shadcn-admin template
- TanStack Router
- TanStack Query

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run migrate
npm run dev
```

Backend runs on http://localhost:3000

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on http://localhost:5173

### 3. Admin Dashboard Setup

```bash
cd admin
npm install
cp .env.example .env
npm run dev
```

Admin dashboard runs on http://localhost:5174

## Features

### For Donors
- Browse active donation campaigns
- Filter campaigns by category
- Make donations via Midtrans
- Leave prayers/messages with donations
- View donation history
- Anonymous donation option

### For Campaign Creators
- Create and manage campaigns
- Upload multiple photos
- Post campaign updates
- View campaign statistics
- Receive withdrawal notifications

### For Admins
- Dashboard with statistics
- Manage all campaigns
- Verify campaign creators
- Process withdrawals
- Manage categories and banners
- Review reports
- Moderate content

## Development

Each project has its own README with detailed setup instructions:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Admin README](./admin/README.md)

## License

ISC
"# SatuTangan" 
"# SatuTangan" 
"# SatuTangan" 
"# SatuTangan" 
