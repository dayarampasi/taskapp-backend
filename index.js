require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const tasksRoutes = require('./routes/task.routes');

const app = express();
const port = 3000;

// ✅ Allow all localhost origins (DEV SAFE)
app.use(cors());

// Middleware
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'backend is running fine' });
});

console.log("Starting server...");

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
