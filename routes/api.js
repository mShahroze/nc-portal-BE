const router = require('express').Router();
const topicsRouter = require('../routes/topicsRouter');
const articlesRouter = require('../routes/articlesRouter');
const commentsRouter = require('../routes/commentsRouter');
const usersRouter = require('../routes/usersRouter');
const endPoints = require('../endpoints.json');

router.use('/topics', topicsRouter);

router.use('/articles', articlesRouter);

router.use('/comments', commentsRouter);

router.use('/users', usersRouter);

// router.get('/api', endPoints);

module.exports = router;
