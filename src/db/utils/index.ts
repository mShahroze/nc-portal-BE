interface Article {
  article_id?: number;
  title: string;
  body: string;
  author: string;
  topic: string;
  created_at: string | Date;
  votes?: number;
}

interface Comment {
  body: string;
  belongs_to: string;
  created_by: string;
  votes: number;
  created_at: string | Date;
}

interface FormattedComment {
  author: string;
  created_at: Date;
  article_id: number;
  votes: number;
  body: string;
}

export const formatArticles = (articles: Article[]): Article[] => {
  const formattedArticles = articles.map(
    ({ created_at, ...remainingArticle }) => {
      const dateTimeString = new Date(created_at);
      const newArticle = {
        ...remainingArticle,
        created_at: dateTimeString,
      };
      return newArticle;
    }
  );
  return formattedArticles;
};

export const formatComments = (
  comments: Comment[],
  articles: Article[]
): FormattedComment[] => {
  return comments.map(
    ({ body, belongs_to, created_by, votes, created_at }) => {
      const articleReference = articles.find(
        (article) => article.title === belongs_to
      );

      if (!articleReference) {
        throw new Error(`Article not found for title: ${belongs_to}`);
      }

      const dateTimeString = new Date(created_at);
      return {
        author: created_by,
        created_at: dateTimeString,
        article_id: articleReference.article_id as number,
        votes,
        body,
      };
    }
  );
};
