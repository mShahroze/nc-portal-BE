import bcrypt from 'bcrypt';
import { Prisma, User as PrismaUser } from '@prisma/client';
import prisma from '../db/prisma';

// Define types for better type safety
type PublicUser = Omit<PrismaUser, 'password' | 'id'>;
type NewUser = Omit<PrismaUser, 'id'>;

// Custom error class for user-related errors
class UserError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'UserError';
  }
}

export const getUsers = async (): Promise<PublicUser[]> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        avatar_url: true,
        name: true,
      },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new UserError('Failed to fetch users', 500);
  }
};

export const addUser = async (userData: {
  username: string;
  name: string;
  avatar_url?: string;
  password: string;
}) => {
  try {
    const { username, name, avatar_url, password } = userData;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        avatar_url: avatar_url || null,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar_url: true,
      },
    });

    return newUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        class UsernameExistsError extends Error {
          statusCode: number;
          constructor(message: string) {
            super(message);
            this.name = 'UsernameExistsError';
            this.statusCode = 422;
          }
        }

        const err = new UsernameExistsError(
          'Username already exists'
        );
        throw err;
      }
    }
    throw error;
  }
};

export const getUserByUsername = async (
  username: string
): Promise<PublicUser | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        avatar_url: true,
        name: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw new UserError('Failed to fetch user', 500);
  }
};

export const updateUser = async (
  username: string,
  userData: Partial<NewUser>
): Promise<PublicUser> => {
  try {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: userData,
      select: {
        username: true,
        name: true,
        avatar_url: true,
      },
    });

    return updatedUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new UserError('User not found', 404);
      }
    }
    console.error('Error updating user:', error);
    throw new UserError('Failed to update user', 500);
  }
};

export const deleteUser = async (username: string): Promise<void> => {
  try {
    await prisma.user.delete({
      where: { username },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new UserError('User not found', 404);
      }
    }
    console.error('Error deleting user:', error);
    throw new UserError('Failed to delete user', 500);
  }
};
