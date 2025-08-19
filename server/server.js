require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/mark', require('./routes/markRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

//signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username })
  if (user) {
    return res.status(400).json({ message: 'Username already exists' })
  }
  const newUser = new User({ username, password })
  await newUser.save()
  res.json({ message: 'User created' })
});
//signin
app.post('/signin', async (req, res) => {
  const { username, password}=req.body;
  const user = await User.findOne({ username })
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }
  const isPasswordValid = await bcrypt.compare(password, user.password)
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));