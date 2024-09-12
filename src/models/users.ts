import prisma from '../db/prisma';

interface User {
  username: string;
  avatar_url: string | null; // Avatar can be null, based on your schema
  name: string;
}

interface NewUser {
  username: string;
  avatar_url: string | null; // Avatar can be null, based on your schema
  name: string;
}

export const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users.map((user) => ({
    username: user.username,
    avatar_url: user.avatar_url,
    name: user.name,
  }));
};

export const addUser = async (newUser: NewUser): Promise<User> => {
  const createdUser = await prisma.user.create({
    data: {
      username: newUser.username,
      avatar_url: newUser.avatar_url,
      name: newUser.name,
    },
  });

  return {
    username: createdUser.username,
    avatar_url: createdUser.avatar_url,
    name: createdUser.name,
  };
};

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    return {
      username: user.username,
      avatar_url: user.avatar_url,
      name: user.name,
    };
  }

  return null;
};
