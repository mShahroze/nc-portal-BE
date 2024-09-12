import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import * as articlesModel from '../models/articles';

export const fetchArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { author, topic, sort_by, order, limit, p } = req.query;

    if (
      sort_by &&
      ![
        'title',
        'topic',
        'author',
        'created_at',
        'votes',
        'comment_count',
        'body',
      ].includes(sort_by as string)
    ) {
      res.status(500).json({
        message: 'Property does not Exist - Internal Server Error',
      });
      return;
    }

    const articles = await articlesModel.getArticles(
      author as string | undefined,
      topic as string | undefined,
      sort_by as articlesModel.SortColumn | undefined,
      order as 'asc' | 'desc' | undefined,
      limit ? parseInt(limit as string, 10) : undefined,
      p ? parseInt(p as string, 10) : undefined
    );

    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

export const postArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(
      'Attempting to create article with title:',
      req.body.title
    );
    const article = await articlesModel.addArticle(req.body);
    console.log('Article created successfully:', article);
    res.status(201).json({ article });
  } catch (err) {
    console.error('Error in postArticle:', err);
    if (
      err instanceof Error &&
      err.message.includes('Unique constraint violation')
    ) {
      console.log('Unique constraint violation detected');
      res.status(422).json({
        message: 'Unique Key Violation!. Request cannot be processed',
      });
    } else {
      console.log('Unexpected error:', err);
      next(err);
    }
  }
};

export const fetchArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { article_id } = req.params;
    const article = await articlesModel.getArticleById(article_id);

    if (article) {
      res.status(200).json({ article });
    } else {
      res.status(404).json({ message: 'Article Not Found' });
    }
  } catch (err) {
    next(err);
  }
};

export const patchArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (typeof inc_votes !== 'number') {
      res
        .status(400)
        .json({ message: 'Bad Request - Invalid inc_votes' });
      return;
    }

    const article = await articlesModel.patchArticleById(
      article_id,
      inc_votes
    );

    if (article) {
      res.status(200).json({ article });
    } else {
      res.status(404).json({ message: 'Article Not Found' });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { article_id } = req.params;
    await articlesModel.deleteArticleById(article_id);
    res.status(204).send();
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      res
        .status(404)
        .json({ message: 'Not Found - Article Does Not Exist!' });
    } else {
      next(err);
    }
  }
};
