const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../db'); // Implied import for the database

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Return user data
    return cb(null, profile);
  }
));

// Passport Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Similar to Google strategy
    return cb(null, profile);
  }
));

// Routes
app.post('/api/auth/signin', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Get user from database
    const [users] = await db.query(
      'SELECT id, username, role FROM user WHERE username = ?',
      [username]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];
    
    // Here you would typically verify the password
    // For now, we'll just generate the token
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Google Auth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  function(req, res) {
    // Generate JWT and redirect to frontend with token
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.redirect(`http://localhost:3000/signin?token=${token}`);
  }
);

// Facebook Auth Routes
app.get('/api/auth/facebook',
  passport.authenticate('facebook')
);

app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/signin' }),
  function(req, res) {
    // Generate JWT and redirect to frontend with token
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.redirect(`http://localhost:3000/signin?token=${token}`);
  }
);

// Protected route example
app.get('/api/protected',
  authenticateToken,
  (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  }
);

// Student Routes
app.get('/api/student/enrolled-courses', authenticateToken, async (req, res) => {
  try {
    // Get student ID from the authenticated user
    const studentId = req.user.id;
    console.log('Authenticated user:', req.user);

    // First, get the student record
    const [student] = await db.query(
      'SELECT id FROM student WHERE user_id = ?',
      [studentId]
    );
    console.log('Student record:', student);

    if (!student || student.length === 0) {
      console.log('No student record found for user_id:', studentId);
      return res.json([]);
    }

    const studentDbId = student[0].id;

    // Get enrolled courses using student_course table
    const query = `
      SELECT 
        c.id as courseId,
        c.course_name as courseName,
        c.course_instructor as instructorName,
        e.completed as completed,
        0 as progress -- We'll calculate this later if needed
      FROM course c
      JOIN student_course sc ON c.id = sc.course_id
      WHERE sc.student_id = ?
    `;

    console.log('Executing query for student ID:', studentDbId);
    const [courses] = await db.query(query, [studentDbId]);
    console.log('Query results:', courses);

    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
});

// Add other student endpoints
app.get('/api/student/assignments', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const [student] = await db.query(
      'SELECT id FROM student WHERE user_id = ?',
      [studentId]
    );

    if (!student || student.length === 0) {
      return res.json([]);
    }

    const studentDbId = student[0].id;
    const query = `
      SELECT 
        a.id,
        a.title,
        a.description,
        a.due_date as dueDate,
        a.total_points as totalPoints,
        a.score,
        a.graded,
        c.course_name as courseName
      FROM assignment a
      JOIN course c ON a.course_id = c.id
      JOIN student_course sc ON c.id = sc.course_id
      WHERE sc.student_id = ?
    `;

    const [assignments] = await db.query(query, [studentDbId]);
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
});

app.get('/api/student/stats', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const [student] = await db.query(
      'SELECT id FROM student WHERE user_id = ?',
      [studentId]
    );

    if (!student || student.length === 0) {
      return res.json({
        totalCourses: 0,
        completedCourses: 0,
        pendingAssignments: 0,
        averageGrade: 0
      });
    }

    const studentDbId = student[0].id;
    
    // Get total courses
    const [totalCourses] = await db.query(
      'SELECT COUNT(*) as count FROM student_course WHERE student_id = ?',
      [studentDbId]
    );

    // Get completed courses
    const [completedCourses] = await db.query(
      'SELECT COUNT(*) as count FROM enrollment WHERE student_id = ? AND completed = 1',
      [studentDbId]
    );

    // Get pending assignments
    const [pendingAssignments] = await db.query(
      `SELECT COUNT(*) as count 
       FROM assignment a
       JOIN course c ON a.course_id = c.id
       JOIN student_course sc ON c.id = sc.course_id
       LEFT JOIN assignment_submission asub ON a.id = asub.assignment_id AND asub.student_id = ?
       WHERE sc.student_id = ? AND asub.id IS NULL`,
      [studentDbId, studentDbId]
    );

    // Get average grade
    const [averageGrade] = await db.query(
      `SELECT COALESCE(AVG(score), 0) as avg
       FROM assignment_submission
       WHERE student_id = ? AND graded = 1`,
      [studentDbId]
    );

    res.json({
      totalCourses: totalCourses[0].count,
      completedCourses: completedCourses[0].count,
      pendingAssignments: pendingAssignments[0].count,
      averageGrade: Math.round(averageGrade[0].avg)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    try {
      // Get the user from the database
      const [users] = await db.query(
        'SELECT id, role FROM user WHERE id = ?',
        [decoded.id]
      );

      if (!users || users.length === 0) {
        return res.status(403).json({ message: 'User not found' });
      }

      req.user = {
        id: users[0].id,
        role: users[0].role
      };
      next();
    } catch (error) {
      console.error('Error in authentication:', error);
      return res.status(500).json({ message: 'Authentication error' });
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 