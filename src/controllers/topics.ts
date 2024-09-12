import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import * as topicModel from '../models/topics';

export const fetchTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Fetching topics...');
    const topics = await topicModel.getTopics();
    console.log('Topics fetched:', topics);
    res.status(200).json({ topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    next(error);
  }
};

export const postTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newTopic = await topicModel.addTopic(req.body);
    res.status(201).json({ topic: newTopic });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        'Bad Request - Invalid Property/Property Missing!'
    ) {
      res.status(400).json({ message: error.message });
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(422).json({
        message: 'Unique Key Violation!. Request cannot be processed',
      });
    } else {
      next(error);
    }
  }
};

export const fetchTopicBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const topic = await topicModel.getTopicBySlug(slug);
    if (topic) {
      res.status(200).json({ topic });
    } else {
      res.status(404).json({ message: 'Topic not found' });
    }
  } catch (error) {
    next(error);
  }
};
