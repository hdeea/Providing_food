# Ramadan 10 Days Donation Challenge System Architecture

## Overview
This architecture describes the Ramadan 10 Days Donation Challenge system for the ProvidingFood platform.
It includes:
- donor authentication
- daily donation tracking
- points system
- challenge progress
- winner selection
- payment session creation
- refund/failure logic
- protected donor routes
- frontend flow
- backend API contract

---

## Database Schema

### Donor
- `id` (PK)
- `name`
- `email` (unique)
- `passwordHash`
- `role` = `donor`
- `points` (integer)
- `lastDonationDate` (datetime | null)
- `completedDays` (integer)
- `isWinner` (boolean)
- `createdAt`
- `updatedAt`

### Donation
- `id` (PK)
- `donorId` (FK -> Donor.id)
- `amount` (decimal)
- `region` (string)
- `status` (`pending` | `confirmed` | `failed`)
- `paymentSessionId` (string)
- `donationDate` (datetime)
- `createdAt`

### ChallengeEntry
- `id` (PK)
- `donorId` (FK -> Donor.id)
- `dayNumber` (integer)
- `date` (date)
- `completed` (boolean)
- `pointsEarned` (integer)
- `donationId` (FK -> Donation.id)

---

## Backend APIs

### Auth
- `POST /api/user/register`
  - body: `{ name, email, password, role="donor" }`
  - response: `{ id, name, email, role, token }`

- `POST /api/user/login`
  - body: `{ email, password }`
  - response: `{ id, name, email, role, token }`

- `GET /api/user/profile`
  - headers: `Authorization: Bearer <token>`
  - response: `{ id, name, email, role }`

### Challenge
- `GET /api/challenge/status`
  - headers: `Authorization: Bearer <token>`
  - response:
    - `currentDay`
    - `completedDays`
    - `points`
    - `isWinner`
    - `lastDonationDate`
    - `remainingDays`
    - `progress`
    - `nextDonationDeadline`

- `POST /api/payment/create-challenge-session`
  - headers: `Authorization: Bearer <token>`
  - body: `{ amount, regionName }`
  - response: `{ url, sessionId }`

- `POST /api/payment/confirm`
  - body: `{ sessionId, status }`
  - behavior:
    - validate payment session
    - mark donation as confirmed
    - create donation record
    - update challenge progress
    - add points
    - if day missed -> reset donor points
    - if 10 consecutive days completed -> mark winner

- `GET /api/challenge/winners`
  - headers: `Authorization: Bearer <token>`
  - response: array of winner records

### Points
- `GET /api/donor/points`
  - headers: `Authorization: Bearer <token>`
  - response: `{ points, completedDays, currentDay, isWinner, lastDonationDate }`

- `POST /api/donor/add-points`
  - headers: `Authorization: Bearer <token>`
  - body: `{ points }`

- `POST /api/donor/reset-points`
  - headers: `Authorization: Bearer <token>`
  - body: `{}`

---

## Payment Flow
1. Donor clicks `Continue Payment`.
2. Frontend calls `POST /api/payment/create-challenge-session`.
3. Backend returns payment URL and session ID.
4. Frontend redirects donor to payment gateway.
5. Payment gateway calls `POST /api/payment/confirm` after success.
6. Backend verifies session, creates donation record, updates challenge state.
7. If payment failed, backend reverts challenge state and possibly refunds.

---

## Frontend Routes
- `/donor/ramadan` — Ramadan landing page
- `/donor/donation-type` — choose donation type
- `/donor/donate-cash-challenge` — donation checkout page
- `/donor/login` — donor login/register page
- `/donor/status` — challenge status page
- `/donor/points` — points summary page
- `/donor/winners` — winners list page

---

## Protected Route Logic
- if no user: redirect to `/donor/login?return=<original-path>`
- if role !== `donor`: redirect to `/donor/login`
- donor-only pages require `role === "donor"`

---

## Token Handling
- store token and donor profile in `sessionStorage`
- include token in `Authorization: Bearer <token>` headers
- do not use unsafe `localStorage` inconsistently

---

## Key Frontend Components
- `DonorLogin` handles login/register and return URL navigation
- `DonateCashChallenge` creates payment session and redirects to gateway
- `ChallengeStatus` shows current progress, completed days, points and winner status
- `DonorPoints` shows donor points snapshot
- `Winners` lists current challenge winners
- `ProtectedRoute` guards donor pages

---

## Winner Logic
- donor wins after 10 consecutive donation days
- if donor misses a day, points and streak reset
- winners are persisted in donor record plus challenge history

---

## Error Handling
- handle fetch failures with user-facing messages
- protect page access before loading secure API data
- show loading state while user and API state initialize
