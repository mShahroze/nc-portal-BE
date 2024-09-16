import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import topicsRouter from './routes/topicsRouter';
import articlesRouter from './routes/articlesRouter';
import commentsRouter from './routes/commentsRouter';
import usersRouter from './routes/usersRouter';
import authRouter from './routes/authRouter';
import { verifyToken, requireRole } from './middleware/auth';
import {
  handle400,
  handle404,
  handle405,
  handle422,
  handle500,
} from './errors';
import { endPoints } from './endpoints';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { errorHandler } from './middleware/errors';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', apiLimiter);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/topics', topicsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);
app.use('/api', authRouter);

// Admin-only route
app.get(
  '/api/admin',
  verifyToken,
  requireRole('admin'),
  (req, res) => {
    res.json({ message: 'This is an admin-only route' });
  }
);

// Default route
app.get('/', (req, res) => {
  res.status(200).json(endPoints);
});

// 404 for any other routes
app.all('/*', (req, res) => {
  res.status(404).json({ msg: 'Page Not Found' });
});

// Error handlers
app.use(errorHandler);
app.use(handle400);
app.use(handle404);
app.use(handle405);
app.use(handle422);
app.use(handle500);

export default app;
