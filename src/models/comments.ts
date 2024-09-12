import prisma from '../db/prisma';

interface Comment {
  id: string;
  votes: number;
  created_at: Date;
  author: string;
  body: string;
  article_id: string;
}

interface NewComment {
  body: string;
  author: string;
  article_id: string;
}

export const getCommentsByArticleId = async (
  article_id: string,
  sort_by: string = 'created_at',
  order: 'asc' | 'desc' = 'desc',
  limit: number = 10,
  page: number = 1
) => {
  const comments = await prisma.comment.findMany({
    where: { article_id },
    orderBy: { [sort_by]: order },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      author: { select: { username: true } },
    },
  });

  return comments.map((comment) => ({
    id: comment.id,
    votes: comment.votes,
    created_at: comment.created_at,
    author: comment.author.username,
    body: comment.body,
  }));
};

export const addCommentByArticleId = async (
  newComment: NewComment
): Promise<Comment> => {
  const createdComment = await prisma.comment.create({
    data: {
      body: newComment.body,
      article: { connect: { id: newComment.article_id } },
      author: { connect: { username: newComment.author } },
    },
    include: {
      author: { select: { username: true } },
    },
  });

  return {
    id: createdComment.id,
    votes: createdComment.votes,
    created_at: createdComment.created_at,
    author: createdComment.author.username,
    body: createdComment.body,
    article_id: createdComment.article_id,
  };
};

export const patchCommentById = async (
  comment_id: string,
  inc_votes: number = 0
): Promise<Comment | null> => {
  try {
    const updatedComment = await prisma.comment.update({
      where: { id: comment_id },
      data: { votes: { increment: inc_votes } },
      include: {
        author: { select: { username: true } },
      },
    });

    return {
      id: updatedComment.id,
      votes: updatedComment.votes,
      created_at: updatedComment.created_at,
      author: updatedComment.author.username,
      body: updatedComment.body,
      article_id: updatedComment.article_id,
    };
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      'code' in err &&
      err.code === 'P2025'
    ) {
      return null;
    }
    throw err;
  }
};

export const deleteCommentById = async (
  comment_id: string
): Promise<string | null> => {
  try {
    const deletedComment = await prisma.comment.delete({
      where: { id: comment_id },
    });
    return deletedComment.id;
  } catch (error: unknown) {
    if ((error as Error & { code: string }).code === 'P2025') {
      return null;
    }
    throw error;
  }
};
