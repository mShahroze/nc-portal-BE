import { Prisma, Article } from '@prisma/client';
import prisma from '../db/prisma';

export type ArticleResponse = {
  id: string;
  article_id: string;
  title: string;
  topic: string;
  author: string;
  body: string;
  created_at: Date;
  votes: number;
  comment_count: number;
};

export type SortColumn =
  | keyof Article
  | 'comment_count'
  | 'author'
  | 'topic';

export const getArticles = async (
  author?: string,
  topic?: string,
  sort_by: SortColumn = 'created_at',
  order: 'asc' | 'desc' = 'desc',
  limit: number = 10,
  page: number = 1
) => {
  const where: Prisma.ArticleWhereInput = {};
  if (author) where.author = { username: author };
  if (topic) where.topic = { slug: topic };

  let orderBy: Prisma.ArticleOrderByWithRelationInput = {};
  if (sort_by === 'comment_count') {
    orderBy = { comments: { _count: order } };
  } else if (sort_by === 'author') {
    orderBy = { author: { username: order } };
  } else if (sort_by === 'topic') {
    orderBy = { topic: { slug: order } };
  } else {
    orderBy[sort_by] = order;
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy,
    take: limit,
    skip: (page - 1) * limit,
    include: {
      author: true,
      topic: true,
      _count: { select: { comments: true } },
    },
  });

  const total_count = await prisma.article.count({ where });

  return {
    articles: articles.map((article) => ({
      id: article.id,
      article_id: article.id,
      title: article.title,
      topic: article.topic.slug,
      author: article.author.username,
      body: article.body,
      created_at: article.created_at,
      votes: article.votes,
      comment_count: article._count.comments,
    })),
    total_count,
  };
};

export const getArticleById = async (
  article_id: string
): Promise<ArticleResponse | null> => {
  const article = await prisma.article.findUnique({
    where: { id: article_id },
    include: {
      author: { select: { username: true } },
      topic: true,
      _count: { select: { comments: true } },
    },
  });

  if (article) {
    return {
      id: article.id,
      article_id: article.id,
      title: article.title,
      topic: article.topic.slug,
      author: article.author.username,
      body: article.body,
      created_at: article.created_at,
      votes: article.votes,
      comment_count: article._count.comments,
    };
  }

  return null;
};

export const addArticle = async (newArticle: {
  title: string;
  body: string;
  topic: string;
  author: string;
}): Promise<ArticleResponse> => {
  try {
    console.log('Attempting to create article in database');
    const createdArticle = await prisma.article.create({
      data: {
        title: newArticle.title,
        body: newArticle.body,
        topic: { connect: { slug: newArticle.topic } },
        author: { connect: { username: newArticle.author } },
      },
      include: {
        author: true,
        topic: true,
        _count: { select: { comments: true } },
      },
    });

    console.log('Article created successfully in database');
    return {
      id: createdArticle.id,
      article_id: createdArticle.id,
      title: createdArticle.title,
      topic: createdArticle.topic.slug,
      author: createdArticle.author.username,
      body: createdArticle.body,
      created_at: createdArticle.created_at,
      votes: createdArticle.votes,
      comment_count: createdArticle._count.comments,
    };
  } catch (error) {
    console.error('Error in addArticle:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.log('Prisma unique constraint violation detected');
        throw new Error(
          'Unique constraint violation: Article title already exists'
        );
      }
    }
    throw error;
  }
};

export const patchArticleById = async (
  article_id: string,
  inc_votes: number
): Promise<ArticleResponse | null> => {
  const updatedArticle = await prisma.article.update({
    where: { id: article_id },
    data: { votes: { increment: inc_votes } },
    include: {
      author: { select: { username: true } },
      topic: true,
      _count: { select: { comments: true } },
    },
  });

  return {
    id: updatedArticle.id,
    article_id: updatedArticle.id,
    title: updatedArticle.title,
    topic: updatedArticle.topic.slug,
    author: updatedArticle.author.username,
    body: updatedArticle.body,
    created_at: updatedArticle.created_at,
    votes: updatedArticle.votes,
    comment_count: updatedArticle._count.comments,
  };
};

export const deleteArticleById = async (
  article_id: string
): Promise<string> => {
  const deletedArticle = await prisma.article.delete({
    where: { id: article_id },
  });
  return deletedArticle.id;
};
