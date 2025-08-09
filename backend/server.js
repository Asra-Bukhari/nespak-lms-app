require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static for uploads
const uploadsDir = process.env.UPLOADS_DIR || 'uploads';
app.use(`/${uploadsDir}`, express.static(path.join(__dirname, uploadsDir)));

connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/api/views', require('./routes/viewRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// root
app.get('/', (req, res) => res.send('Nespak LMS Backend Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
