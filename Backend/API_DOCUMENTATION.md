# HabitStacker — API Documentation

## Base URL
```
http://<YOUR_LOCAL_IP>:8000/api
```
> Replace `<YOUR_LOCAL_IP>` with your machine's LAN IP (e.g. `192.168.10.23`).
> For production, update `BASE_URL` in `HabitStacker/src/constants/Config.ts`.

## Authentication
All protected endpoints require a valid JWT access token in the `Authorization` header:
```
Authorization: Bearer <accessToken>
```
Tokens expire after **1 day**. Use the **Refresh Token** endpoint to get a new one.

---

## Rate Limits
| Route Group | Limit       | Window  |
|-------------|-------------|---------|
| Auth        | 100 requests | 15 min  |
| Habits      | 300 requests | 5 min   |

---

## 1. Authentication (`/api/auth`)

### POST `/api/auth/signup`
Register a new user account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success `201`:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "64abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

**Errors:**
| Status | Cause |
|--------|-------|
| `400`  | Validation failed (name < 2 chars, invalid email, password < 6 chars) |
| `409`  | Email already registered |
| `429`  | Rate limit exceeded |

---

### POST `/api/auth/login`
Log in with email and password.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success `200`:**
```json
{
  "message": "Login Successful",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" },
  "token": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

**Errors:**
| Status | Cause |
|--------|-------|
| `400`  | Invalid email format or missing password |
| `401`  | Wrong email or password |
| `429`  | Rate limit exceeded |

---

### GET `/api/auth/me` 🔒
Get the currently authenticated user's profile.

**Success `200`:**
```json
{
  "user": {
    "id": "64abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### POST `/api/auth/logout` 🔒
Log out and invalidate the refresh token.

**Success `200`:**
```json
{ "message": "Logged out successfully" }
```

---

### POST `/api/auth/refresh-token`
Get a new access token using a valid refresh token.

**Body:**
```json
{ "refreshToken": "eyJhbGci..." }
```

**Success `200`:**
```json
{ "token": "eyJhbGci..." }
```

**Errors:**
| Status | Cause |
|--------|-------|
| `401`  | Missing or invalid refresh token |
| `403`  | Refresh token expired or revoked |

---

### GET `/api/auth/admin/users` 🔒 🛡️ Admin Only
Get a list of all registered users.

**Success `200`:**
```json
{
  "users": [
    { "id": "...", "name": "John", "email": "john@example.com", "role": "user" }
  ]
}
```

---

## 2. Habits (`/api/habits`) 🔒

All habit endpoints require authentication.

### GET `/api/habits`
Get all habits belonging to the authenticated user.

**Success `200`:**
```json
{
  "message": "Habits fetched successfully",
  "habits": [
    {
      "_id": "64abc...",
      "title": "Morning Run",
      "description": "Run 5km",
      "status": "active",
      "frequency": "daily",
      "targetDays": [],
      "category": "Health",
      "reminderTime": "07:00",
      "icon": "flame-outline",
      "color": "#6366f1",
      "currentStreak": 5,
      "longestStreak": 12,
      "CompletedDates": ["2024-01-15T00:00:00.000Z"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST `/api/habits`
Create a new habit.

**Body:**
```json
{
  "title": "Morning Run",
  "description": "Run 5km every day",
  "status": "active",
  "frequency": "daily",
  "targetDays": [],
  "category": "Health",
  "reminderTime": "07:00",
  "icon": "flame-outline",
  "color": "#6366f1"
}
```

> `frequency` must be `"daily"` | `"weekly"` | `"custom"`.
> `targetDays` is required (and non-empty) when `frequency` is `"custom"` — e.g. `["Mon","Wed","Fri"]`.
> `reminderTime` must be in `HH:mm` 24-hour format.

**Success `201`:**
```json
{
  "message": "Habit created successfully",
  "habit": { ...habitObject }
}
```

**Errors:**
| Status | Cause |
|--------|-------|
| `400`  | Validation failed (title < 3 chars, invalid time format, etc.) |

---

### GET `/api/habits/achievements`
Get all achievements earned by the authenticated user.

> ⚠️ This must be called **before** `GET /api/habits/:id` in the route file (already fixed).

**Success `200`:**
```json
{
  "achievements": [
    {
      "_id": "64abc...",
      "title": "7 Day Streak",
      "description": "Completed a habit 7 days in a row!",
      "icon": "trophy",
      "type": "streak",
      "unlockedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/habits/:id`
Get a single habit by its MongoDB ID.

**Success `200`:**
```json
{
  "message": "Habit fetched",
  "habit": { ...habitObject }
}
```

**Errors:**
| Status | Cause |
|--------|-------|
| `400`  | Invalid MongoDB ObjectId format |
| `404`  | Habit not found or belongs to different user |

---

### PUT `/api/habits/:id`
Update an existing habit's details.

**Body** (all fields optional):
```json
{
  "title": "Evening Run",
  "description": "Updated description",
  "frequency": "custom",
  "targetDays": ["Mon", "Wed", "Fri"],
  "reminderTime": "18:30",
  "category": "Fitness",
  "icon": "walk-outline",
  "color": "#10b981"
}
```

**Success `200`:**
```json
{
  "message": "Habit updated successfully",
  "habit": { ...updatedHabitObject }
}
```

---

### PATCH `/api/habits/:id/complete`
Mark a habit as completed for today. Triggers streak calculation and achievement check.

**Body:** _(empty)_

**Success `200`:**
```json
{
  "message": "Habit marked as completed",
  "habit": { ...habitWithUpdatedStreak }
}
```

**Errors:**
| Status | Cause |
|--------|-------|
| `409`  | Habit already marked as complete today |

---

### PATCH `/api/habits/:id/incomplete`
Remove today's completion from a habit. Decrements streak if necessary.

**Body:** _(empty)_

**Success `200`:**
```json
{
  "message": "Habit marked as incomplete",
  "habit": { ...habitWithUpdatedStreak }
}
```

---

### DELETE `/api/habits/:id`
Permanently delete a habit and all its completion history.

**Success `200`:**
```json
{ "message": "Habit deleted successfully" }
```

---

## 3. Analytics (`/api/analytics`) 🔒

### GET `/api/analytics`
Get aggregated statistics for the authenticated user's habits.

**Success `200`:**
```json
{
  "summary": {
    "totalHabits": 5,
    "overallCompletionRate": 72.5,
    "totalCompletions": 145
  },
  "categories": ["Health", "Work", "Personal"],
  "habits": [
    {
      "id": "64abc...",
      "title": "Morning Run",
      "streak": 5,
      "best": 12,
      "completionRate": 85.7
    }
  ]
}
```

---

## 4. Achievements (`/api/achievements`) 🔒

### GET `/api/achievements`
Get all achievements unlocked by the authenticated user.

> This is the primary achievements endpoint. `/api/habits/achievements` also exists as a secondary route.

**Success `200`:**
```json
{
  "achievements": [
    {
      "_id": "64abc...",
      "title": "7 Day Streak",
      "description": "Completed a habit 7 days in a row!",
      "icon": "trophy",
      "type": "streak",
      "unlockedAt": "2024-01-15T06:00:00.000Z"
    }
  ]
}
```

**Achievement types:**
| Type | Trigger |
|------|---------|
| `streak` | Streak milestone reached (7, 30, 100 days) |
| `total` | Total completions milestone |
| `early_bird` | Completing a habit before 8am |
| `stacker` | Having 3+ active habits simultaneously |

---

## 5. Community (`/api/community`) 🔒

### GET `/api/community/leaderboard`
Get the global user leaderboard sorted by longest streak.

**Success `200`:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "name": "Jane Smith",
      "longestStreak": 45,
      "totalHabits": 8
    }
  ]
}
```

---

### GET `/api/community/pulse`
Get aggregate community activity stats (total completions across all users today, most popular categories, etc.).

**Success `200`:**
```json
{
  "pulse": {
    "totalCompletionsToday": 1247,
    "activeUsers": 89,
    "topCategories": ["Health", "Fitness", "Mindfulness"]
  }
}
```

---

## Error Response Format

All error responses follow this consistent shape:
```json
{
  "message": "Human-readable error description",
  "errors": [
    { "path": ["fieldName"], "message": "Specific validation error" }
  ]
}
```
The `errors` array is only present for `400` validation errors.

---

## Testing with curl

```bash
# Register
curl -X POST http://192.168.10.23:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login and capture token
TOKEN=$(curl -s -X POST http://192.168.10.23:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' | jq -r '.token')

# Get habits
curl http://192.168.10.23:8000/api/habits \
  -H "Authorization: Bearer $TOKEN"

# Get achievements (note: /achievements before /:id in route order)
curl http://192.168.10.23:8000/api/habits/achievements \
  -H "Authorization: Bearer $TOKEN"

# Create habit
curl -X POST http://192.168.10.23:8000/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Morning Run","frequency":"daily","category":"Health","reminderTime":"07:00","color":"#6366f1","icon":"flame-outline"}'

# Mark complete (replace HABIT_ID)
curl -X PATCH http://192.168.10.23:8000/api/habits/HABIT_ID/complete \
  -H "Authorization: Bearer $TOKEN"
```