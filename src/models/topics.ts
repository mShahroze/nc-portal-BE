import prisma from '../db/prisma';

export interface Topic {
  slug: string;
  description: string;
}

export type NewTopic = Topic;

export const getTopics = async (): Promise<Topic[]> => {
  return prisma.topic.findMany();
};

export const addTopic = async (
  newTopic: NewTopic
): Promise<Topic> => {
  if (!newTopic.slug || !newTopic.description) {
    throw new Error(
      'Bad Request - Invalid Property/Property Missing!'
    );
  }
  return prisma.topic.create({
    data: newTopic,
  });
};

export const getTopicBySlug = async (
  slug: string
): Promise<Topic | null> => {
  return prisma.topic.findUnique({
    where: { slug },
  });
};
