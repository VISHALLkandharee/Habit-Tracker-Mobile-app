🎯 Micro-Habit Stacker

A minimalist mobile habit tracker that helps you build lasting habits by focusing on just 3 at a time.

📱 About
Micro-Habit Stacker is a mobile-first habit tracking app designed around a simple principle: focus on 3 habits at a time.
Unlike overwhelming habit trackers with unlimited habits, this app enforces a 3-habit limit. Complete a habit for 21 consecutive days to unlock the ability to add more habits.
✨ Key Features

🎯 3-Habit Limit - Stay focused on what matters most
🔥 Streak Tracking - Visual progress with fire emoji motivation
📅 Calendar View - See your monthly completion history
✅ One-Tap Completion - Mark habits complete with a single tap
🎨 Custom Icons & Colors - Personalize each habit
🏆 21-Day Challenge - Unlock new habit slots after 21-day streaks
✨ Maintenance Mode - Completed habits move to auto-pilot


🎥 Demo
Note: This app is designed for mobile devices only (iOS/Android). It does not support web or desktop viewing.
Screenshots

🛠️ Tech Stack
Frontend (Mobile)

React Native - Cross-platform mobile framework
Expo - Development platform and tooling
TypeScript - Type-safe JavaScript
Expo Router - File-based navigation
AsyncStorage - Local data persistence
Axios - HTTP client for API calls

Backend (API)

Node.js - JavaScript runtime
Express.js - Web framework
MongoDB - NoSQL database
Mongoose - MongoDB ODM
JWT - Authentication tokens
bcryptjs - Password hashing


📋 Prerequisites
Before you begin, make sure you have:
Required Software

Node.js (v18 or higher) → Download
npm or yarn (comes with Node.js)
MongoDB → Download
Git → Download

For Testing on Mobile

Expo Go app on your smartphone:

iOS App Store
Android Play Store



OR

Android Studio (for Android emulator)
Xcode (for iOS simulator - Mac only)


⚠️ Important: This app is mobile-only. You cannot test it in a web browser.


🚀 Installation & Setup
1️⃣ Clone the Repository
bashgit clone https://github.com/yourusername/micro-habit-stacker.git
cd micro-habit-stacker

2️⃣ Backend Setup
Step 1: Install Dependencies
bashcd habit-tracker-backend
npm install
Step 2: Configure Environment Variables
Create a .env file in the habit-tracker-backend folder:
bashtouch .env
Add the following configuration:
envPORT=5000
MONGO_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=your_super_secret_jwt_key_change_this_12345
NODE_ENV=development

💡 Tip: Change JWT_SECRET to a random secure string in production.

Step 3: Start MongoDB
macOS/Linux:
bashmongod
Windows:
bash"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
Or use MongoDB Compass (GUI) - it will start MongoDB automatically.
Step 4: Run the Backend Server
bashnpm run dev
✅ Backend should now be running at: http://localhost:5000
Test it:
bashcurl http://localhost:5000
# Should return: {"message":"🎯 Micro-Habit Stacker API is running!","status":"healthy"}

3️⃣ Frontend (Mobile App) Setup
Step 1: Install Dependencies
bash# From project root, navigate to mobile folder
cd habit-tracker-mobile
npm install
Step 2: Update API URL (Important!)
Open src/services/api.ts and update the API URL with your computer's local IP address:
typescript// Find your local IP:
// Mac: System Preferences → Network
// Windows: ipconfig (look for IPv4)
// Linux: ip addr show

const API_URL = 'http://YOUR_LOCAL_IP:5000/api'; // Example: http://192.168.1.100:5000/api
How to find your local IP:
macOS:
bashipconfig getifaddr en0
Windows:
bashipconfig
# Look for "IPv4 Address"
Linux:
bashhostname -I | awk '{print $1}'

⚠️ Do NOT use localhost or 127.0.0.1 - your phone won't be able to reach it!

Step 3: Start Expo Development Server
bashnpx expo start
```

You'll see a QR code in the terminal.

---

### 4️⃣ Run on Mobile Device

#### Option A: Test on Your Smartphone (Recommended)

1. **Install Expo Go** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. **Make sure your phone and computer are on the same WiFi network**
3. **Scan the QR code:**
   - **iOS:** Open Camera app → Point at QR code → Tap notification
   - **Android:** Open Expo Go app → Tap "Scan QR code"
4. App will load on your phone! 📱

#### Option B: Use Emulator/Simulator

From the Expo terminal, press:
- **`a`** - Open Android emulator (requires Android Studio)
- **`i`** - Open iOS simulator (Mac only, requires Xcode)

> ⚠️ **Web is NOT supported** - pressing `w` will not work for this mobile-only app.

---

## 📖 How to Use

### First Time Setup

1. **Create Account**
   - Open the app
   - Tap "Sign up"
   - Enter your name, email, and password
   - Tap "Create Account"

2. **Add Your First Habit**
   - Tap the "+" button (bottom right)
   - Enter habit name (e.g., "Morning Walk")
   - Choose an icon (🏃, 💧, 📖, etc.)
   - Select a color
   - Tap "Create Habit"

3. **Track Daily Progress**
   - On home screen, tap the ☐ checkbox to mark complete
   - Watch your streak counter grow! 🔥
   - Tap the habit card to view details and calendar

### The 21-Day Challenge

1. Complete a habit for **21 consecutive days**
2. Habit automatically moves to **"Maintenance Mode"** ✨
3. You can now add a **4th habit** to your active list
4. Keep building!

### Habit Limits

- **Maximum 3 active habits** at a time
- Complete a 21-day streak to unlock more slots
- Maintenance habits don't count toward the limit

---

## 📁 Project Structure
```
micro-habit-stacker/
│
├── habit-tracker-backend/              # Backend API Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js       # Authentication logic
│   │   │   └── habitController.js      # Habit CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.js                 # JWT verification
│   │   ├── models/
│   │   │   ├── Habit.js                # Habit schema
│   │   │   └── User.js                 # User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # Auth endpoints
│   │   │   └── habitRoutes.js          # Habit endpoints
│   │   └── server.js                   # Express app entry point
│   ├── .env                            # Environment variables (create this)
│   ├── .env.example                    # Environment template
│   ├── package.json
│   └── README.md
│
├── habit-tracker-mobile/               # React Native Mobile App
│   ├── app/                            # Expo Router screens
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx               # Login screen
│   │   │   └── register.tsx            # Register screen
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   └── index.tsx               # Home screen
│   │   ├── _layout.tsx                 # Root layout
│   │   ├── add-habit.tsx               # Add habit modal
│   │   └── habit-detail.tsx            # Habit detail screen
│   ├── src/
│   │   ├── components/
│   │   │   ├── HabitCard.tsx           # Habit list item
│   │   │   └── StreakCalendar.tsx      # Monthly calendar
│   │   ├── constants/
│   │   │   └── colors.ts               # App color scheme
│   │   ├── context/
│   │   │   ├── AuthContext.tsx         # Authentication state
│   │   │   └── HabitContext.tsx        # Habit state management
│   │   ├── services/
│   │   │   ├── api.ts                  # Axios configuration
│   │   │   ├── authService.ts          # Auth API calls
│   │   │   └── habitService.ts         # Habit API calls
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript definitions
│   │   └── utils/
│   │       ├── dateUtils.ts            # Date helper functions
│   │       └── errorHandler.tsx        # Error boundary
│   ├── assets/                         # Images and icons
│   ├── app.json                        # Expo configuration
│   ├── package.json
│   └── tsconfig.json                   # TypeScript config
│
└── README.md                           # This file

🔌 API Endpoints
Authentication
MethodEndpointDescriptionPOST/api/auth/registerCreate new user accountPOST/api/auth/loginLogin and get JWT tokenGET/api/auth/meGet current user info (requires auth)
Habits
MethodEndpointDescriptionGET/api/habitsGet all user's habitsGET/api/habits/:idGet single habit detailsPOST/api/habitsCreate new habitPOST/api/habits/:id/completeMark habit as complete for todayPOST/api/habits/:id/uncompleteUnmark habit for todayPUT/api/habits/:idUpdate habit detailsDELETE/api/habits/:idDelete habit
Example API Request:
bash# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

🧪 Testing
Manual Testing Checklist
bash✅ Backend
  ✅ MongoDB running
  ✅ Server starts without errors
  ✅ Health check endpoint responds

✅ Mobile App
  ✅ App loads on phone
  ✅ Register new account
  ✅ Login with credentials
  ✅ Create first habit
  ✅ Mark habit complete
  ✅ View habit details
  ✅ Check calendar view
  ✅ Test streak counting
  ✅ Try to add 4th habit (should block)
  ✅ Delete habit
  ✅ Logout and login again
```

### Test User Credentials

For quick testing, you can use:
```
Email: test@example.com
Password: test123

🐛 Troubleshooting
❌ "Cannot connect to backend" / "Network Error"
Solution:

Check backend is running: curl http://localhost:5000
Verify your local IP in src/services/api.ts
Make sure phone and computer are on same WiFi network
Try running: npx expo start --tunnel (slower but works across networks)

Find your local IP:
bash# Mac
ipconfig getifaddr en0

# Windows
ipconfig

# Linux
hostname -I

❌ "Signup failed" / "Login failed"
Check these:

MongoDB is running: ps aux | grep mongod
Backend shows no errors in terminal
Check backend logs for error messages
Verify .env file exists with correct values


❌ App won't load / White screen
Solution:
bash# Clear cache and restart
npx expo start --clear

# Or reinstall node_modules
cd habit-tracker-mobile
rm -rf node_modules
npm install
npx expo start

❌ Expo Go not scanning QR code
Solution:

Make sure phone and computer are on same WiFi
Try manual connection:

Note the URL from terminal (e.g., exp://192.168.1.100:8081)
Open Expo Go → Enter URL manually


Or use tunnel mode: npx expo start --tunnel


❌ MongoDB connection error
Solution:
bash# Check MongoDB is installed
mongod --version

# Start MongoDB manually
mongod

# Or use MongoDB Compass (GUI)
# Download: https://www.mongodb.com/try/download/compass

📝 Environment Variables
Backend .env file:
env# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/habittracker

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

⚠️ Never commit .env file to Git! It's already in .gitignore.


🎨 Customization
Change App Colors
Edit src/constants/colors.ts:
typescriptexport const COLORS = {
  primary: '#2563eb',    // Main brand color
  secondary: '#10b981',  // Success green
  danger: '#ef4444',     // Error red
  // ... add your colors
};
Add More Habit Icons
Edit src/constants/colors.ts:
typescriptexport const HABIT_ICONS = [
  '🏃', '💧', '📖', '🧘', '🥗', '💪',
  // Add your icons here
  '🎯', '✍️', '🎨', '🎵',
];

🚀 Future Features (Roadmap)

 Push notifications for habit reminders
 Dark mode support
 Export habit data to CSV
 Habit statistics and insights
 Share achievements with friends
 Habit templates
 Multiple habit categories
 Weekly/monthly reports


🤝 Contributing
Contributions are welcome! To contribute:

Fork the repository
Create a feature branch: git checkout -b feature/AmazingFeature
Commit your changes: git commit -m 'Add AmazingFeature'
Push to branch: git push origin feature/AmazingFeature
Open a Pull Request


📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Your Name

GitHub: @yourusername
Email: your.email@example.com
LinkedIn: Your LinkedIn


🙏 Acknowledgments

Expo - Amazing React Native framework
MongoDB - Flexible database
Express.js - Fast backend framework
React Navigation - Mobile navigation


⚠️ Important Notes

📱 Mobile-only app - Does not work in web browsers
🏠 Local development only - Backend must run on your local network
🔐 For testing purposes - Not production-ready (no HTTPS, rate limiting, etc.)
📶 Same WiFi required - Phone and computer must be on same network


💡 Tips for Testers

Use a test email - Don't use your real email for testing
Start simple - Test with 1-2 habits first
Test the 21-day flow - Create a habit and mark it complete for multiple days
Try edge cases - What happens when you try to add a 4th habit?
Test on different phones - iOS and Android if possible



Troubleshooting Section above
GitHub Issues - Report bugs
Expo Documentation - Expo-specific questions
Stack Overflow - General React Native help


⭐ Show Your Support
If you found this project helpful, please give it a ⭐ on GitHub!

Built with ❤️ and ☕ for better habits

