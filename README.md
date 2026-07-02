# ElectVote - Election Voting System

A full-stack election voting system with party registration, live leaderboards, timeline tracking, and real-time results.

## Features

- **Party Registration** — Parties can register and await admin approval
- **Voter Registration & Login** — Secure voter identification system
- **Live Voting** — Cast votes during the voting phase
- **Real-time Leaderboard** — Auto-refreshing vote counts with animated bars
- **Election Timeline** — Visual phase tracker (Registration → Voting → Results)
- **Countdown Timer** — Live countdown to next election phase
- **Admin Panel** — Create elections, approve parties, control phases

## Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, React Router 7, Lucide Icons
- **Backend:** Express 5, Mongoose/MongoDB, Node.js
- **Deployment:** Render (Web Service)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd voting-system
   ```

2. **Setup the server:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI
   ```

3. **Setup the client:**
   ```bash
   cd client
   npm install
   ```

4. **Run in development:**
   ```bash
   # Terminal 1 - Start server
   cd server
   npm run dev

   # Terminal 2 - Start client
   cd client
   npm run dev
   ```

5. **Open** http://localhost:5173

### First Time Setup

1. Go to **Admin Panel** (`/admin`)
2. Create a new election with dates for each phase
3. Set election status to "registration"
4. Register parties at `/parties/register`
5. Approve parties in Admin Panel
6. Set election status to "voting" when ready
7. Voters can register and cast votes

## Deploy to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render will auto-detect the `render.yaml` configuration
5. Add your `MONGODB_URI` environment variable in Render dashboard
6. Deploy!

**Build command:** `cd client && npm install && npm run build && cd ../server && npm install`
**Start command:** `cd server && node index.js`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/parties | Register a party |
| GET | /api/parties | List approved parties |
| GET | /api/parties/all | List all parties (admin) |
| PUT | /api/parties/:id/approve | Approve a party |
| POST | /api/voters/register | Register a voter |
| POST | /api/voters/login | Voter login |
| GET | /api/voters/status/:voterId | Check voter status |
| POST | /api/elections | Create election |
| GET | /api/elections | List elections |
| PUT | /api/elections/:id | Update election |
| POST | /api/votes | Cast a vote |
| GET | /api/votes/results/:electionId | Get results |
| GET | /api/votes/leaderboard/:electionId | Live leaderboard |

## Environment Variables

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB connection string |
| PORT | Server port (default: 3000) |
| NODE_ENV | `development` or `production` |
| VITE_API_URL | API URL for client (optional, uses proxy in dev) |
