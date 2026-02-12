# Online Student Learning Tracker

A full-stack Learning Management System (LMS) built with Next.js, MySQL, and Material-UI.

## Features

### For Teachers
- ✅ Create and manage courses
- ✅ Create assignments with max marks
- ✅ Upload student marks with automatic grading (A-F)
- ✅ View analytics: grade distribution, top performers, failing students
- ✅ Track class performance with charts

### For Students
- ✅ Enroll in courses
- ✅ View marks and grades
- ✅ Track progress percentage per course
- ✅ View performance analytics with charts
- ✅ Monitor overall statistics

## Tech Stack

- **Frontend**: Next.js 15, React 19, Material-UI v6
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Authentication**: JWT with HTTP-only cookies
- **Charts**: Recharts
- **Styling**: Material-UI with custom theme

## Prerequisites

- Node.js 18+ installed
- MySQL 8+ installed and running
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
cd "c:\Users\Dineshkumar N\Version2"
npm install
```

### 2. Configure Database

**Option A: Using MySQL Workbench or Command Line**

```bash
mysql -u root -p
```

Then run the SQL commands from `schema.sql`:

```bash
mysql -u root -p < schema.sql
```

**Option B: Manual Setup**

1. Create a database named `learning_tracker`
2. Copy and execute all SQL commands from `schema.sql`

### 3. Configure Environment Variables

Edit `.env.local` file and update with your MySQL credentials:

```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=learning_tracker
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Test Credentials

### Creating Test Accounts

Since the database is fresh, you'll need to register accounts:

**Teacher Account:**
1. Go to `http://localhost:3000/register`
2. Fill in:
   - Name: `Dr. Sarah Johnson`
   - Email: `teacher@test.com`
   - Password: `teacher123`
   - Role: `Teacher`

**Student Accounts:**
1. Register multiple students:
   - Name: `Alice Smith`, Email: `alice@test.com`, Password: `student123`, Role: `Student`
   - Name: `Bob Williams`, Email: `bob@test.com`, Password: `student123`, Role: `Student`
   - Name: `Charlie Brown`, Email: `charlie@test.com`, Password: `student123`, Role: `Student`

### Testing Workflow

1. **As Teacher** (`teacher@test.com` / `teacher123`):
   - Create a course (e.g., "Introduction to Programming")
   - Add assignments (e.g., "Assignment 1", Max Marks: 100)
   - Wait for students to enroll

2. **As Students** (`alice@test.com`, `bob@test.com`, etc. / `student123`):
   - Enroll in the course
   - View courses and progress

3. **As Teacher**:
   - Upload marks for students
   - View analytics dashboard
   - Check grade distribution

4. **As Students**:
   - View marks and grades
   - Check progress tracking
   - Explore analytics dashboard

## Project Structure

```
Version2/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── teacher/      # Teacher endpoints
│   │   │   └── student/      # Student endpoints
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── teacher/          # Teacher pages
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   ├── assignments/
│   │   │   ├── upload-marks/
│   │   │   └── analytics/
│   │   └── student/          # Student pages
│   │       ├── dashboard/
│   │       ├── courses/
│   │       ├── marks/
│   │       ├── progress/
│   │       └── analytics/
│   ├── components/           # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── GradeBadge.tsx
│   │   └── ProgressBar.tsx
│   ├── lib/                  # Utilities
│   │   ├── db.ts            # Database connection
│   │   └── auth.ts          # JWT utilities
│   ├── types/               # TypeScript types
│   └── theme.ts             # MUI theme
├── schema.sql               # Database schema
├── package.json
└── .env.local              # Environment variables
```

## Grading System

- **A**: 90-100%
- **B**: 75-89%
- **C**: 60-74%
- **D**: 40-59%
- **F**: Below 40%

## Features Implemented

✅ Role-based authentication (Student/Teacher)
✅ JWT-based session management
✅ Course creation and management
✅ Assignment creation with max marks
✅ Student enrollment system
✅ Marks upload with automatic grading
✅ Progress tracking (% completion)
✅ Analytics dashboards with charts
✅ Grade distribution visualization
✅ Responsive Material-UI design
✅ Protected routes with middleware

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database Hosting

Use Railway or PlanetScale for MySQL hosting:

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create MySQL database
railway login
railway init
railway add mysql
```

Update `.env.local` with Railway database credentials.

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running: `mysql.server start` (Mac) or check Windows Services
- Verify credentials in `.env.local`
- Check if database `learning_tracker` exists

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## License

MIT License - Feel free to use for your projects!
"# Online_Student_Learning_Tracker" 
