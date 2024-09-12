export const endPoints = {
  app: {
    routes: {
      '/api': {
        'GET /api': {
          description:
            'Serves a JSON object displaying all endpoints',
        },
        '/api/topics': {
          'GET /api/fetchTopic': {
            description: 'Endpoint to obtain all Topics',
          },
          'POST /api/postTopic': {
            description: 'Endpoint to post a single Topic',
          },
        },
        '/api/articles': {
          'GET /api/articles': {
            description: 'Endpoint to receive all the articles',
          },
          'GET /api/articles/:article_id': {
            description:
              'Endpoint to receive an Article by its Article ID',
          },
          'PATCH /api/articles/:article_id': {
            description:
              'Endpoint to update content in an Article using Article ID',
          },
          'DELETE /api/articles/:article_id': {
            description:
              'Endpoint to delete an Article using Article ID',
          },
          'GET /api/articles/:article_id/comments': {
            description:
              'Endpoint to display comments of an Article using Article ID',
          },
          'POST /api/articles/:article_id/comments': {
            description:
              'Endpoint to post a Comment in an Article using Article ID',
          },
        },
        '/api/comments': {
          'PATCH /api/comments/:comment_id': {
            description:
              'Endpoint to update content in Comments using its Comment ID',
          },
          'DELETE /api/comments/:comment_id': {
            description:
              'Endpoint to delete a Comment using its Comment ID',
          },
        },
        '/api/users': {
          'GET /api/users': {
            description: 'Endpoint to obtain all Users',
          },
          'POST /api/users': {
            description: 'Endpoint to post a Single User',
          },
          'GET /api/users/:username': {
            description:
              'Endpoint to receive a User using their Username',
          },
        },
      },
    },
  },
};
