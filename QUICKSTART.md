# 🎓 Quick Start Guide - Online Student Learning Tracker

## ⚡ Fast Setup (5 Minutes)

### Step 1: Setup Database

**Option A - Using MySQL Command Line:**
```bash
mysql -u root -p
# Enter your MySQL password
# Then run:
source "c:\Users\Dineshkumar N\Version2\schema.sql"
```

**Option B - Using MySQL Workbench:**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. File → Run SQL Script
4. Select `schema.sql`
5. Click Run

### Step 2: Configure Environment

Edit `.env.local` file with your MySQL password:
```env
DATABASE_PASSWORD=your_mysql_password_here
```

### Step 3: Start the App

```bash
npm run dev
```

Open browser: `http://localhost:3000`

---

## 🔑 Test Credentials

### Create Your Own Accounts

The app will redirect you to the registration page. Create accounts with these details:

#### Teacher Account
- **Name**: Dr. Sarah Johnson
- **Email**: teacher@test.com
- **Password**: teacher123
- **Role**: Teacher

#### Student Accounts
Create 3 student accounts:

1. **Alice Smith**
   - Email: alice@test.com
   - Password: student123
   - Role: Student

2. **Bob Williams**
   - Email: bob@test.com
   - Password: student123
   - Role: Student

3. **Charlie Brown**
   - Email: charlie@test.com
   - Password: student123
   - Role: Student

---

## 🧪 Testing Workflow

### As Teacher (teacher@test.com)

1. **Login** → Redirects to Teacher Dashboard
2. **Create Course**:
   - Go to "Courses" tab
   - Title: "Introduction to Programming"
   - Description: "Learn the basics of programming"
   - Click "Create Course"

3. **Add Assignment**:
   - Go to "Assignments" tab
   - Select your course
   - Title: "Assignment 1 - Variables"
   - Max Marks: 100
   - Click "Create Assignment"

4. **Wait for students to enroll** (do student steps below)

5. **Upload Marks**:
   - Go to "Upload Marks" tab
   - Select course and assignment
   - Enter marks for each student (e.g., 85, 92, 78)
   - Click Submit for each student
   - **Grades are calculated automatically!**

6. **View Analytics**:
   - Go to "Analytics" tab
   - Select your course
   - See bar charts, pie charts, top performers, etc.

---

### As Student (alice@test.com, bob@test.com, charlie@test.com)

1. **Login** → Redirects to Student Dashboard
2. **Enroll in Course**:
   - Go to "Courses" tab
   - Find "Introduction to Programming"
   - Click "Enroll Now"

3. **View Marks** (after teacher uploads):
   - Go to "Marks" tab
   - See your grades with color-coded badges

4. **Check Progress**:
   - Go to "Progress" tab
   - See completion percentage

5. **View Analytics**:
   - Go to "Analytics" tab
   - See your performance charts

---

## ✅ What to Test

- [ ] Registration (teacher and students)
- [ ] Login/Logout
- [ ] Teacher creates course
- [ ] Teacher adds assignment
- [ ] Students enroll in course
- [ ] Teacher uploads marks
- [ ] Automatic grade calculation (A-F)
- [ ] Progress percentage updates
- [ ] Teacher analytics charts
- [ ] Student analytics charts
- [ ] Responsive design (resize browser)

---

## 🎯 Expected Results

### Grading System
- **90-100%** → Grade A (Green)
- **75-89%** → Grade B (Light Green)
- **60-74%** → Grade C (Yellow)
- **40-59%** → Grade D (Orange)
- **Below 40%** → Grade F (Red)

### Progress Tracking
- Progress = (Completed Assignments / Total Assignments) × 100%
- Updates automatically when marks are uploaded

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if MySQL is running
mysql -u root -p
# If not, start MySQL service
```

### Port 3000 Already in Use
```bash
npx kill-port 3000
npm run dev
```

### Can't Login
- Make sure you registered through the app (not manual SQL)
- Passwords are hashed, can't use plain text in database

---

## 📱 Features to Explore

### Teacher Features
- ✅ Course management
- ✅ Assignment creation
- ✅ Bulk marks upload
- ✅ Performance analytics
- ✅ Grade distribution charts
- ✅ Top performers list
- ✅ Failing students alerts

### Student Features
- ✅ Course enrollment
- ✅ Marks viewing
- ✅ Grade tracking
- ✅ Progress monitoring
- ✅ Performance analytics
- ✅ Personal statistics

---

## 🚀 Ready for Production

Once tested locally:
1. Set up MySQL on Railway/PlanetScale
2. Deploy to Vercel
3. Update environment variables
4. Share with recruiters!

---

**Need Help?** Check the full [README.md](file:///c:/Users/Dineshkumar%20N/Version2/README.md) for detailed instructions.
