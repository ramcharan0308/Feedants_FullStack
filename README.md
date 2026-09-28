# Feedants Full-Stack Competition Assignment

A production-oriented full-stack feature implementing the **Feedants Competition Details Screen** with dynamic backend database integration, server-side time lifecycle calculations, real-time seat availability tracking, atomic concurrency controls, and responsive React Native UI widgets.

---

## 🎥 Demo Video

[Watch the Feedants Competition Details Demo](https://drive.google.com/file/d/1nbsMpfuHXUfj4PCUSKwLsO0aYkgd9hNe/view?usp=sharing)

---

## 🌟 Overview & Highlights

- **Visual Fidelity:** Built directly from the official Feedants assignment specification (`Feedants_Full_Stack_Development_Internship_Technical_Assignment.pdf`) and design reference (`Objective_Page.png`).
- **Zero Static Mockup Data:** Every piece of information rendered on the frontend — title, entry fee, prize pool, remaining spots, judge credentials, dates, rewards, winners, and user registration state — is served dynamically via Express.js REST APIs connected to MongoDB.
- **Deterministic Auto-Seeding:** On server startup (`npm run dev`), the database is automatically seeded with deterministic demo identifiers (`Competition ID: 6ab8ffc731f29eaaf5047daa`, `User ID: 6ab8ffc731f29eaaf5047da8`).
- **Zero-Dependency MongoMemoryReplSet Fallback:** If standalone MongoDB at `127.0.0.1:27017` is unavailable, the server automatically launches `MongoMemoryReplSet` in memory for local development and ACID multi-document transaction support.
- **Race Condition Prevention:** Implements atomic MongoDB operations (`findOneAndUpdate` with `$inc` and `$lt` capacity conditions) wrapped in ACID multi-document transactions to strictly guarantee `bookedSpots <= totalSpots` under high concurrent user load.
- **Server-Time Driven Lifecycle Engine:** Solves device clock tampering by evaluating competition states (`UPCOMING`, `REGISTRATION_OPEN`, `REGISTRATION_CLOSED`, `SUBMISSION_OPEN`, `UNDER_JUDGING`, `COMPLETED`, `SOLD_OUT`) strictly on the backend.
- **Cross-Platform React Native App:** Built with Expo (SDK 57), React Navigation, Safe Area handling, interactive navigation screens (Home, Explore, Create, Competitions, Profile), language toggle (ENG | हिंदी), video modals, and responsive layout styling.

---

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo SDK 57), TypeScript, React Navigation, Expo Vector Icons, Expo Clipboard
- **Backend:** Node.js, Express.js, TypeScript, Mongoose (MongoDB ODM), Zod Validation, Express Rate Limit, Helmet, CORS
- **Database:** MongoDB / Mongoose with `MongoMemoryReplSet` automatic fallback for zero-dependency local transaction testing
- **Testing:** Node Native Test Runner (`node:test`), TypeScript (`tsc`)

---

## 📁 Project Structure

```
Feedants_FullStack/
├── client/                               # React Native (Expo) Application
│   ├── src/
│   │   ├── components/                   # Modular UI components
│   │   │   ├── common/                   # Badge, SkeletonLoader, ErrorView
│   │   │   └── competition/              # TopHeaderNavBar, CompetitionHeaderCard, SeatsProgressBar,
│   │   │                                 # JudgeCard, CountdownBanner, ImportantDatesGrid,
│   │   │                                 # PreviousWinnersCarousel, CompetitionTabsView, RewardsList,
│   │   │                                 # DisclaimerBanner, TrustBadges, ReferAndEarnCard,
│   │   │                                 # UserFeedbackCard, AdBanner, StickyBottomCTA, BottomNavBar,
│   │   │                                 # SubmissionModal
│   │   ├── constants/                    # Theme design tokens, API config, Demo identifiers
│   │   ├── hooks/                        # useCompetitionDetails, useCountdown
│   │   ├── navigation/                   # RootNavigator (React Navigation Stack)
│   │   ├── screens/                      # CompetitionDetailsScreen, HomeScreen, ExploreScreen, CreateScreen, ProfileScreen
│   │   ├── services/                     # apiClient, competitionService
│   │   ├── types/                        # TypeScript API and domain contracts
│   │   └── utils/                        # Formatters (currency, dates, timer), ctaStateResolver
│   ├── App.tsx                           # Main entry point with SafeAreaProvider
│   ├── package.json
│   └── tsconfig.json
│
├── server/                               # Node.js + Express TypeScript Backend
│   ├── src/
│   │   ├── config/                       # Environment configuration, database connection handler
│   │   ├── controllers/                  # competitionController
│   │   ├── database/                     # seed.ts (Idempotent seed script with deterministic ObjectIds)
│   │   ├── middlewares/                  # userContext, errorHandler, validateRequest, rateLimiter
│   │   ├── models/                       # Mongoose Schemas (Competition, User, Judge, Registration, Winner, Submission)
│   │   ├── routes/                       # healthRoutes, competitionRoutes
│   │   ├── services/                     # competitionService, competitionLifecycleService
│   │   ├── utils/                        # AppError class
│   │   └── validations/                  # Zod validation schemas
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                               # Shared TypeScript interface models
└── README.md                             # Comprehensive project documentation
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/feedants_competition
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:8081
DEMO_DATE_OFFSET_DAYS=7
```

- `PORT`: Port on which the Express backend server listens (default: `5000`).
- `MONGODB_URI`: Connection string for MongoDB (default: `mongodb://127.0.0.1:27017/feedants_competition`).
- `CLIENT_ORIGIN`: Allowed origin for CORS (default: `http://localhost:8081`).
- `DEMO_DATE_OFFSET_DAYS`: Defaults to `7` days in future so registration remains open by default during interactive testing. When set to `0` or another integer, shifts reference dates accordingly.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Backend Installation & Server Launch
```bash
cd server
npm install

# Start Backend Server (Auto-seeds database on startup)
npm run dev
```

*Note: Database seeding occurs automatically on startup when running `npm run dev`. You can also manually run `npm run seed` if desired. If local standalone MongoDB service (`127.0.0.1:27017`) is unavailable, the backend automatically launches `MongoMemoryReplSet` in memory for zero-config local development and transaction support.*

#### Key Deterministic Demo Identifiers:
- **Demo Competition ID:** `6ab8ffc731f29eaaf5047daa`
- **Demo User ID:** `6ab8ffc731f29eaaf5047da8`
- **Demo Judge ID:** `6ab8ffc731f29eaaf5047da7`

### 3. Frontend Installation & Execution
```bash
cd client
npm install

# Start Expo App (Press 'w' for Web Preview, 'a' for Android, 'i' for iOS)
npx expo start
```

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api/v1`

### 1. Health Check
`GET /api/v1/health`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Feedants API is running",
    "timestamp": "2026-09-27T11:39:05.668Z",
    "services": {
      "api": { "status": "healthy" },
      "database": { "status": "healthy", "state": "connected", "dbName": "test" }
    }
  }
  ```

### 2. Get Competition Details
`GET /api/v1/competitions/:id`
- **Headers:** `x-user-id` (optional, MongoDB ObjectId of user)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "competition": {
        "id": "6ab8ffc731f29eaaf5047daa",
        "title": "Feedants Classical Dance",
        "category": "Dance",
        "tags": ["Dance", "Multi-Win"],
        "certificateProvided": true,
        "prizePool": 1500,
        "entryFee": 99,
        "totalSpots": 20,
        "bookedSpots": 1,
        "remainingSpots": 19,
        "isSoldOut": false,
        "judge": {
          "name": "Manju Dubey",
          "designation": "Professional Kathak Dancer",
          "experienceYears": "12+ Years of Experience",
          "avatarUrl": "...",
          "introVideoUrl": "..."
        },
        "rewards": [
          { "position": 1, "title": "1st Winner", "amount": 550 },
          { "position": 2, "title": "2nd Winner", "amount": 300 }
        ]
      },
      "lifecycle": {
        "state": "SUBMISSION_OPEN",
        "isRegistrationOpen": true,
        "isSubmissionOpen": true,
        "isSoldOut": false,
        "secondsUntilRegistrationCloses": 604745,
        "serverTime": "2026-09-27T14:25:27.883Z"
      },
      "userState": {
        "isRegistered": false,
        "registrationId": null,
        "registeredAt": null,
        "hasSubmitted": false,
        "submissionId": null,
        "submissionStatus": null
      }
    }
  }
  ```

### 3. Get Past Winners
`GET /api/v1/competitions/:id/winners`
- **Response `200 OK`:** Returns array of winner objects sorted by `rankPosition`.

### 4. Register for Competition
`POST /api/v1/competitions/:id/register`
- **Headers:** `x-user-id` (required)
- **Body:** `{ "paymentToken": "pay_mock_success" }`
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "registrationId": "6ab9278a14effe40cc756db1",
      "competitionId": "6ab8ffc731f29eaaf5047daa",
      "bookedSpots": 2,
      "remainingSpots": 18,
      "registrationStatus": "CONFIRMED"
    }
  }
  ```

### 5. Submit Entry
`POST /api/v1/competitions/:id/submit`
- **Headers:** `x-user-id` (required)
- **Body:** `{ "mediaUrl": "https://example.com/dance.mp4", "caption": "Kathak solo performance" }`
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Submission uploaded successfully",
    "data": {
      "submissionId": "...",
      "status": "SUBMITTED"
    }
  }
  ```

---

## 🔒 Concurrency & Data Consistency Strategy

1. **Atomic Spot Reservation:** Spot incrementing uses `Competition.findOneAndUpdate` with conditional query `{ bookedSpots: { $lt: totalSpots } }` and `$inc: { bookedSpots: 1 }`. If capacity is exhausted, the query matches 0 documents and returns `null`, preventing overselling even under high concurrent load.
2. **ACID Transaction Isolation:** Reservation and `Registration` record creation run inside a MongoDB Session Transaction (`session.startTransaction()`).
3. **Database Uniqueness Constraint:** A compound unique index `{ competitionId: 1, userId: 1 }` on `Registration` guarantees that even if parallel requests bypass pre-checks, MongoDB enforces uniqueness at the database level.
4. **Transient Conflict Retries:** Implements an exponential backoff retry loop handling MongoDB `WriteConflict` errors under concurrent request spikes.

---

## ⏰ Lifecycle Engine

Calculated dynamically in `CompetitionLifecycleService.ts` using server timestamp:
- **`REGISTRATION_OPEN`**: Server Time < `registerBefore` AND `bookedSpots < totalSpots`
- **`REGISTRATION_CLOSED`**: Server Time >= `registerBefore`
- **`SUBMISSION_OPEN`**: `submissionStarts` <= Server Time <= `submissionEnds`
- **`UNDER_JUDGING`**: `submissionEnds` < Server Time < `resultDate`
- **`COMPLETED`**: Server Time >= `resultDate`
- **`SOLD_OUT`**: `bookedSpots >= totalSpots`

---

## 🧪 Testing

### Run Backend Integration & Concurrency Tests
```bash
cd server
npm test
```

- **Result:** 21 tests passed, 0 failed, 0 skipped across 7 test suites verifying GET APIs, registration errors, duplicate submission restrictions, transaction rollbacks, and **10 concurrent registration requests competing for 1 spot**.

### Run Backend Type Check & Build Verification
```bash
cd server
npm run type-check
npm run build
```

- **Result:** `tsc --noEmit` passed with 0 errors, `tsc` build generated clean `dist/` production bundle.

### Run Frontend State Unit Tests & Type Checks
```bash
cd client
npx tsc --noEmit
npx tsx src/utils/ctaStateResolver.test.ts
npx expo export
```

- **Result:** `npx tsc --noEmit` passed with 0 errors, 6 CTA resolver assertions passed, `npx expo export` bundled successfully for Web, Android, and iOS.

---

## 📌 Important Assumptions & Technical Decisions

1. **User Identity:** Evaluated using `x-user-id` header to keep demo setup straightforward without requiring full password authentication.
2. **Payment Mocking:** Payment tokens (`pay_mock_...`) simulate successful Razorpay transactions.
3. **Derived Fields:** `remainingSpots` is computed dynamically (`totalSpots - bookedSpots`) rather than stored independently, avoiding dual sources of truth.
4. **Offline Local DB Support:** Integrated `MongoMemoryReplSet` for zero-setup local testing with transaction support.
5. **Deterministic Seeding:** Fixed ObjectIds ensure frontend config (`client/src/constants/config.ts`) seamlessly requests the seeded demo competition document without manual ID copying.

---

## 🔮 Production Improvements

- Integrate real payment webhooks (Razorpay / Stripe) with idempotent event signature verification.
- Add Redis distributed locks (Redlock) or message queues (BullMQ / RabbitMQ) for ultra-high throughput registration traffic (100k+ concurrent users).
- Integrate S3 / Cloudinary SDK for direct presigned video upload handling.
