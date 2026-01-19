const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL 
      ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000']
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bharat Darshan API is running' });
});
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
