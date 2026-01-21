# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. User Authentication

#### Register User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:**
```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
```
- **Success Response:**
```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
```

#### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
```

[Add all your other endpoints similarly]