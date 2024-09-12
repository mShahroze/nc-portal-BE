import express from 'express';
import * as articlesController from '../controllers/articles';

const router = express.Router();

router
  .route('/')
  .get(articlesController.fetchArticles)
  .post(articlesController.postArticle)
  .all((req, res) =>
    res.status(405).json({ msg: 'Method Not Allowed' })
  );

router
  .route('/:article_id')
  .get(articlesController.fetchArticleById)
  .patch(articlesController.patchArticle)
  .delete(articlesController.deleteArticle)
  .all((req, res) =>
    res.status(405).json({ msg: 'Method Not Allowed' })
  );

export default router;
