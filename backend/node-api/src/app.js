const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploaded PDFs
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
app.use('/api', generalLimiter);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'NyayaSetu API is running' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/judgments', require('./routes/judgment.routes'));
app.use('/api/directives', require('./routes/directive.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/status-updates', require('./routes/statusUpdate.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/nlp', require('./routes/nlp.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// Error handler
app.use(errorHandler);

module.exports = app;
