import { Request, Response, NextFunction } from 'express';
import {
  getUsers,
  addUser,
  getUserByUsername,
} from '../models/users';
import { Prisma } from '@prisma/client';

export const fetchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const postUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await addUser(req.body);
    res.status(201).send({ user });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        // Unique constraint violation
        res.status(422).json({
          msg: 'Unique Key Violation! Request cannot be processed',
        });
      } else {
        res.status(400).json({ msg: 'Bad Request' });
      }
    } else {
      next(err);
    }
  }
};

export const fetchUserByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);

    if (user) {
      res.status(200).send({ user });
    } else {
      res.status(404).json({ msg: 'User Not Found' });
    }
  } catch (err) {
    next(err);
  }
};
