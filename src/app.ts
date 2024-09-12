import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import topicsRouter from './routes/topicsRouter';
import articlesRouter from './routes/articlesRouter';
import commentsRouter from './routes/commentsRouter';
import usersRouter from './routes/usersRouter';
import {
  handle400,
  handle404,
  handle405,
  handle422,
  handle500,
} from './errors';
import { endPoints } from './endpoints';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use individual routers
app.use('/api/topics', topicsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);

// default route - moved after API routes
app.get('/', (req, res) => {
  res.status(200).json(endPoints);
});

app.all('/*', (req, res) => {
  res.status(404).json({ msg: 'Page Not Found' });
});

app.use(handle400);
app.use(handle404);
app.use(handle405);
app.use(handle422);
app.use(handle500);

export default app;
