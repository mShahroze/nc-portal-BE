import { Request, Response, NextFunction } from 'express';
import * as commentsModel from '../models/comments';
import prisma from '../db/prisma';

export const fetchCommentsByArticleId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { article_id } = req.params;
    const { sort_by, order, limit, page } = req.query;

    // First, check if the article exists
    const articleExists = await prisma.article.findUnique({
      where: { id: article_id },
    });

    if (!articleExists) {
      return res
        .status(404)
        .json({ msg: 'Not Found - Article Does Not Exist!' });
    }

    const comments = await commentsModel.getCommentsByArticleId(
      article_id,
      sort_by as string,
      order as 'asc' | 'desc',
      Number(limit) || 10,
      Number(page) || 1
    );

    res.status(200).json({
      comments,
      sort_by,
      order,
      limit,
      page,
    });
  } catch (err) {
    next(err);
  }
};

export const postCommentByArticleId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { article_id } = req.params;
    const { body, username } = req.body;

    // First, check if the article exists
    const articleExists = await prisma.article.findUnique({
      where: { id: article_id },
    });

    if (!articleExists) {
      return res
        .status(404)
        .json({ msg: 'Not Found - Article Does Not Exist!' });
    }

    if (!body || !username) {
      return res.status(400).json({
        msg: 'Bad Request - Invalid Property/Property Missing!',
      });
    }

    const newComment = await commentsModel.addCommentByArticleId({
      article_id,
      body,
      author: username,
    });

    res.status(201).json({ comment: newComment });
  } catch (err) {
    next(err);
  }
};

export const patchComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    if (typeof inc_votes !== 'number') {
      return res
        .status(400)
        .json({ msg: 'Bad Request - Invalid (inc-votes) Type' });
    }
    const updatedComment = await commentsModel.patchCommentById(
      comment_id,
      inc_votes
    );
    if (!updatedComment) {
      return res
        .status(404)
        .json({ msg: 'Not Found - Comment Does Not Exist!' });
    }
    res.status(200).json({ comment: updatedComment });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { comment_id } = req.params;
    const deletedId =
      await commentsModel.deleteCommentById(comment_id);
    if (!deletedId) {
      return res
        .status(404)
        .json({ msg: 'Not Found - Comment Does Not Exist!' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
