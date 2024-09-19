import { Request, Response, NextFunction } from 'express';
import {
  getUsers,
  addUser,
  getUserByUsername,
} from '../models/users';

export const fetchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const postUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('Received user data:', {
    ...req.body,
    password: '[REDACTED]',
  });
  try {
    const user = await addUser(req.body);
    console.log('User created successfully:', {
      ...user,
      password: '[REDACTED]',
    });
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error in postUser:', error);
    if (error instanceof Error) {
      interface CustomError extends Error {
        statusCode?: number;
      }

      if ((error as CustomError).statusCode === 422) {
        res.status(422).json({ msg: 'Username already exists' });
      } else {
        res.status(400).json({ msg: error.message });
      }
    } else {
      next(error);
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
      res.status(200).json({ user });
    } else {
      res.status(404).json({ msg: 'User Not Found' });
    }
  } catch (error) {
    next(error);
  }
};
