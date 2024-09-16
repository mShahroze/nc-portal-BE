import supertest from 'supertest';
import { expect } from '@jest/globals';
import app from '../app';
import { seed } from '../../prisma/seed';
import prisma from '../db/prisma';
import argon2 from 'argon2';
import usersData from '../db/data/development-data/users.js';

const request = supertest(app);

// async function logRelevantData() {
//   console.log(
//     'All Articles:',
//     await prisma.article.findMany({
//       include: {
//         author: true,
//         topic: true,
//         _count: { select: { comments: true } },
//       },
//     })
//   );
//   console.log('All Users:', await prisma.user.findMany());
//   console.log('All Topics:', await prisma.topic.findMany());
// }

describe('/api', () => {
  beforeEach(async () => {
    await seed();
    // await logRelevantData();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('topics', () => {
    it('GET / status:200 responds with an array of topic objects', async () => {
      const response = await request.get('/api/topics').expect(200);
      expect(Array.isArray(response.body.topics)).toBe(true);
      expect(response.body.topics[0]).toHaveProperty('description');
      expect(response.body.topics[0]).toHaveProperty('slug');
    });

    it('POST / status:201 responds with posted topic object', async () => {
      const response = await request
        .post('/api/topics')
        .send({ description: 'Hi there boss!', slug: 'Sharoze' })
        .expect(201);
      expect(response.body.topic).toMatchObject({
        description: 'Hi there boss!',
        slug: 'Sharoze',
      });

      expect(response.body.topic).toHaveProperty('id');
    });

    it('POST / 400 given for missing description property', async () => {
      const response = await request
        .post('/api/topics')
        .send({ slug: 'Godzilla' })
        .expect(400);
      expect(response.body.message).toBe(
        'Bad Request - Invalid Property/Property Missing!'
      );
    });

    it('GET / 405 given a method that is not allowed', async () => {
      const response = await request
        .delete('/api/topics')
        .expect(405);
      expect(response.body.msg).toBe('Method Not Allowed');
    });

    it('POST / 422 given for keying existing slug (unprocessable)', async () => {
      await request
        .post('/api/topics')
        .send({ description: 'Original topic', slug: 'cats' })
        .expect(201);

      const response = await request
        .post('/api/topics')
        .send({ description: 'Hello Master!', slug: 'cats' })
        .expect(422);
      expect(response.body.message).toBe(
        'Unique Key Violation!. Request cannot be processed'
      );
    });
  });

  describe('articles', () => {
    it('GET / status:200 responds with an array of article objects', async () => {
      const { body } = await request.get('/api/articles').expect(200);
      expect(Array.isArray(body.articles)).toBe(true);
      expect(body.articles[0]).toHaveProperty('id');
      expect(body.articles[0]).toHaveProperty('title');
      expect(body.articles[0]).toHaveProperty('topic');
      expect(body.articles[0]).toHaveProperty('author');
      expect(body.articles[0]).toHaveProperty('votes');
      expect(body.articles[0]).toHaveProperty('body');
      expect(body.articles[0]).toHaveProperty('created_at');
    });

    it('GET / status:200 responds with an array of article objects with correct comment_count property', async () => {
      const { body } = await request.get('/api/articles').expect(200);
      expect(Array.isArray(body.articles)).toBe(true);
      expect(body.articles[0]).toHaveProperty('comment_count');
      expect(typeof body.articles[0].comment_count).toBe('number');
    });

    it('GET / status:200 responds with array of articles filtered by username', async () => {
      const { body } = await request
        .get('/api/articles?author=icellusedkars')
        .expect(200);
      console.log('Response body:', body);
      expect(Array.isArray(body.articles)).toBe(true);
      console.log('Number of articles:', body.articles.length);
      console.log(
        'Articles:',
        body.articles.map(
          (a: { id: string; title: string; author: string }) => ({
            id: a.id,
            title: a.title,
            author: a.author,
          })
        )
      );
      expect(body.articles.length).toBe(2);
      expect(
        body.articles.every(
          (article: { author: string }) =>
            article.author === 'icellusedkars'
        )
      ).toBe(true);
    });

    it('GET / status:200 responds with array of articles filtered by topic', async () => {
      const { body } = await request
        .get('/api/articles?topic=coding')
        .expect(200);
      expect(Array.isArray(body.articles)).toBe(true);
      expect(body.articles.length).toBe(10);
    });

    it('GET / returns articles sorted by the title descending', async () => {
      const { body } = await request
        .get('/api/articles?sort_by=title')
        .expect(200);
      expect(body.articles[0].title).toBe(
        'Which historical figure is known for inventing the light bulb?'
      );
    });

    it('GET / returns articles sorted by (DEFAULT) to Date', async () => {
      const { body } = await request.get('/api/articles').expect(200);
      expect(new Date(body.articles[0].created_at)).toBeInstanceOf(
        Date
      );
    });

    it('GET / returns articles sorted by (QUERY) order asc', async () => {
      const { body } = await request
        .get('/api/articles?order=asc')
        .expect(200);
      expect(body.articles[0].title).toBe(
        'Express.js: A Server-Side JavaScript Framework'
      );
    });

    it('GET / returns articles sorted by (DEFAULT) order desc', async () => {
      const { body } = await request.get('/api/articles').expect(200);
      expect(body.articles[0].title).toBe(
        'Which current Premier League manager was the best player?'
      );
    });

    it('GET / limit number of articles by (QUERY) limit', async () => {
      const { body } = await request
        .get('/api/articles?limit=5')
        .expect(200);
      expect(body.articles.length).toBe(5);
      expect(body.articles[2].body).toBe(
        'Asynchronous programming in JavaScript is a paradigm that allows developers to write non-blocking code. Unlike traditional synchronous programming, where tasks are executed one after another, asynchronous programming enables multiple tasks to run concurrently, improving the performance of applications. This is particularly useful when dealing with I/O-bound operations, such as network requests or file reading, which can take time to complete. In JavaScript, asynchronous programming is commonly achieved using callbacks, promises, and the async/await syntax. These mechanisms ensure that the code remains responsive while waiting for an operation to finish. In this article, we will explore the different approaches to asynchronous programming, how they work, and when to use each technique to build efficient and maintainable JavaScript applications.'
      );
    });

    it('GET / limit number of articles by (DEFAULT) limit', async () => {
      const { body } = await request.get('/api/articles').expect(200);
      expect(body.articles.length).toBe(10);
      expect(body.articles[9].body).toBe(
        'When I interviewed for the iOS developer opening at Discord last spring, the tech lead Stanislav told me: React Native is the future. We will use it to build our iOS app from scratch as soon as it becomes public. As a native iOS developer, I strongly doubted using web technologies to build mobile apps because of my previous experiences with tools like PhoneGap. But after learning and using React Native for a while, I am glad we made that decision.'
      );
    });

    it('GET / returns number of items (QUERY) paginated by page when page = 1', async () => {
      const { body } = await request
        .get('/api/articles?limit=5&page=1')
        .expect(200);
      expect(body.articles.length).toBe(5);
      expect(body.articles[2].body).toBe(
        'Asynchronous programming in JavaScript is a paradigm that allows developers to write non-blocking code. Unlike traditional synchronous programming, where tasks are executed one after another, asynchronous programming enables multiple tasks to run concurrently, improving the performance of applications. This is particularly useful when dealing with I/O-bound operations, such as network requests or file reading, which can take time to complete. In JavaScript, asynchronous programming is commonly achieved using callbacks, promises, and the async/await syntax. These mechanisms ensure that the code remains responsive while waiting for an operation to finish. In this article, we will explore the different approaches to asynchronous programming, how they work, and when to use each technique to build efficient and maintainable JavaScript applications.'
      );
    });

    it('GET / returns number of items (QUERY) paginated by page when page = 2', async () => {
      const { body } = await request
        .get('/api/articles?limit=6&page=2')
        .expect(200);
      expect(body.articles.length).toBe(6);
      expect(body.articles[5].body).toBe(
        'When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).'
      );
    });

    it('GET / status:200 responds with total_count of articles', async () => {
      const { body } = await request.get('/api/articles').expect(200);
      expect(body.articles.length).toBe(10);
      expect(body.total_count).toBe(14);
    });

    it('GET / status:200 responds with total_count of articles (QUERY) filtered by author', async () => {
      const { body } = await request
        .get('/api/articles?author=icellusedkars')
        .expect(200);
      expect(body.articles.length).toBe(2);
      expect(body.total_count).toBe(2);
    });

    it('GET / status:200 responds with total_count of articles (QUERY) filtered by sort_by', async () => {
      const { body } = await request
        .get('/api/articles?sort_by=body')
        .expect(200);
      expect(body.articles.length).toBe(10);
      expect(body.total_count).toBe(14);
      expect(body.articles[0].body).toBe(
        'You’re probably aware that JavaScript is the programming language most often used to add interactivity to the front end of a website, but its capabilities go far beyond that—entire sites can be built on JavaScript, extending it from the front to the back end, seamlessly. Express.js and Node.js gave JavaScript newfound back-end functionality—allowing developers to build software with JavaScript on the server side for the first time. Together, they make it possible to build an entire site with JavaScript: You can develop server-side applications with Node.js and then publish those Node.js apps as websites with Express. Because Node.js itself wasn’t intended to build websites, the Express framework is able to layer in built-in structure and functions needed to actually build a site. It’s a pretty lightweight framework that’s great for giving developers extra, built-in web application features and the Express API without overriding the already robust, feature-packed Node.js platform. In short, Express and Node are changing the way developers build websites.'
      );
    });

    it('POST / status:201 responds with posted article object', async () => {
      const { body } = await request
        .post('/api/articles')
        .send({
          title: 'Down with the shadows',
          topic: 'coding',
          author: 'weegembump',
          body: 'Death is only the start',
        })
        .expect(201);
      expect(body.article).toHaveProperty('id');
      expect(body.article).toHaveProperty('title');
      expect(body.article).toHaveProperty('topic');
      expect(body.article).toHaveProperty('author');
      expect(body.article).toHaveProperty('body');
      expect(body.article).toHaveProperty('created_at');
      expect(body.article).toHaveProperty('votes');
    });

    it('GET / 405 given a method that is not allowed', async () => {
      const { body } = await request
        .delete('/api/articles')
        .expect(405);
      expect(body.msg).toBe('Method Not Allowed');
    });

    it('POST / 422 unprocessable Identity article title is not unique', async () => {
      const uniqueTitle = `Test Article ${Date.now()}`;

      console.log('Creating first article with title:', uniqueTitle);

      // First, create an article
      const firstResponse = await request.post('/api/articles').send({
        title: uniqueTitle,
        body: 'This is a test article',
        topic: 'coding',
        author: 'timMartin',
      });

      console.log(
        'First article creation response:',
        firstResponse.status,
        firstResponse.body
      );

      expect(firstResponse.status).toBe(201);

      const firstArticle = await prisma.article.findUnique({
        where: { title: uniqueTitle },
      });
      console.log('First article in database:', firstArticle);

      console.log('Creating second article with the same title');

      const secondResponse = await request
        .post('/api/articles')
        .send({
          title: uniqueTitle,
          body: 'This is another test article',
          topic: 'coding',
          author: 'timMartin',
        });

      console.log(
        'Second article creation response:',
        secondResponse.status,
        secondResponse.body
      );

      const allArticles = await prisma.article.findMany({
        where: { title: uniqueTitle },
      });
      console.log('All articles with the same title:', allArticles);

      expect(secondResponse.status).toBe(422);
      expect(secondResponse.body.message).toBe(
        'Unique Key Violation!. Request cannot be processed'
      );
    });

    it('GET / status:500 responds with an error for non-existent sort_by column', async () => {
      const { body } = await request
        .get('/api/articles?sort_by=description')
        .expect(500);
      expect(body.message).toBe(
        'Property does not Exist - Internal Server Error'
      );
    });
  });

  describe('users', () => {
    it('GET / status:200 responds with array of user objects', async () => {
      const { body } = await request.get('/api/users').expect(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body[0]).toMatchObject({
        username: expect.any(String),
        avatar_url: expect.any(String),
        name: expect.any(String),
      });
    });

    it('POST / status:201 responds with posted user object', async () => {
      const newUser = {
        username: 'BillGates',
        avatar_url:
          'https://cdn.britannica.com/47/188747-050-1D34E743.jpg',
        name: 'Bill Gates',
      };

      const { body } = await request
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(body.user).toEqual(newUser);
    });

    it('POST / status:422 when trying to create a user with existing username', async () => {
      const existingUser = await prisma.user.findFirst();
      if (!existingUser) {
        throw new Error('No existing user found in the database');
      }

      const { body } = await request
        .post('/api/users')
        .send({
          username: existingUser.username,
          avatar_url: 'https://example.com/avatar.jpg',
          name: 'Duplicate User',
        })
        .expect(422);

      expect(body.msg).toBe(
        'Unique Key Violation! Request cannot be processed'
      );
    });

    it('GET /:username status:200 responds with a user object by username', async () => {
      const existingUser = await prisma.user.findFirst();
      if (!existingUser) {
        throw new Error('No existing user found in the database');
      }

      const { body } = await request
        .get(`/api/users/${existingUser.username}`)
        .expect(200);

      expect(body.user).toMatchObject({
        username: existingUser.username,
        avatar_url: existingUser.avatar_url,
        name: existingUser.name,
      });
    });

    it('GET /:username status:404 given a username that does not exist', async () => {
      const { body } = await request
        .get('/api/users/NonExistentUser')
        .expect(404);

      expect(body.msg).toBe('User Not Found');
    });

    it('GET / status:405 given a method that is not allowed', async () => {
      const { body } = await request.delete('/api/users').expect(405);
      expect(body.msg).toBe('Method Not Allowed');
    });
  });

  describe('comments', () => {
    let testArticleId: string;
    let testCommentId: string;
    let testUserId: string;

    beforeEach(async () => {
      await seed();

      // Find or create a test user
      let testUser = await prisma.user.findUnique({
        where: { username: 'butter_bridge' },
      });
      if (!testUser) {
        console.warn(
          'Test user not found. Creating a new test user.'
        );
        testUser = await prisma.user.create({
          data: {
            username: 'butter_bridge',
            name: 'Test User',
            avatar_url: 'https://example.com/avatar.jpg',
            password: 'fwefefe',
          },
        });
      }
      testUserId = testUser.id;

      const testArticle = await prisma.article.findFirst({
        include: { comments: true },
      });
      if (!testArticle) {
        throw new Error('No test article found');
      }
      testArticleId = testArticle.id;

      if (testArticle.comments.length === 0) {
        console.warn(
          'No comments found for the test article. Creating a test comment.'
        );
        const testComment = await prisma.comment.create({
          data: {
            body: 'Test comment body',
            votes: 0,
            author: { connect: { id: testUserId } },
            article: { connect: { id: testArticleId } },
          },
        });
        testCommentId = testComment.id;
      } else {
        testCommentId = testArticle.comments[0].id;
      }
    });

    describe('GET /api/comments/article/:article_id', () => {
      it('status:200 responds with an array of comments for a given article_id', async () => {
        const { body } = await request
          .get(`/api/comments/article/${testArticleId}`)
          .expect(200);

        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments[0]).toMatchObject({
          id: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });

      it('status:404 responds with an appropriate error message when article_id does not exist', async () => {
        const { body } = await request
          .get('/api/comments/article/non-existent-id')
          .expect(404);

        expect(body.msg).toBe('Not Found - Article Does Not Exist!');
      });

      it('status:200 accepts sort_by, order, limit and page query parameters', async () => {
        const { body } = await request
          .get(
            `/api/comments/article/${testArticleId}?sort_by=votes&order=desc&limit=5&page=1`
          )
          .expect(200);

        expect(body.comments.length).toBeLessThanOrEqual(5);
        expect(body.sort_by).toBe('votes');
        expect(body.order).toBe('desc');
        expect(body.limit).toBe('5');
        expect(body.page).toBe('1');
      });
    });

    describe('POST /api/comments/article/:article_id', () => {
      it('status:201 responds with the posted comment', async () => {
        const newComment = {
          body: 'This is a test comment',
          username: 'butter_bridge',
        };

        const { body } = await request
          .post(`/api/comments/article/${testArticleId}`)
          .send(newComment)
          .expect(201);

        expect(body.comment).toMatchObject({
          id: expect.any(String),
          body: newComment.body,
          author: newComment.username,
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });

      it('status:400 for missing required fields', async () => {
        const { body } = await request
          .post(`/api/comments/article/${testArticleId}`)
          .send({})
          .expect(400);

        expect(body.msg).toBe(
          'Bad Request - Invalid Property/Property Missing!'
        );
      });

      it('status:404 when article_id does not exist', async () => {
        const newComment = {
          body: 'This is a test comment',
          username: 'butter_bridge',
        };

        const { body } = await request
          .post('/api/comments/article/non-existent-id')
          .send(newComment)
          .expect(404);

        expect(body.msg).toBe('Not Found - Article Does Not Exist!');
      });
    });

    describe('PATCH /api/comments/:comment_id', () => {
      it('status:200 responds with the updated comment', async () => {
        const { body } = await request
          .patch(`/api/comments/${testCommentId}`)
          .send({ inc_votes: 1 })
          .expect(200);

        expect(body.comment).toMatchObject({
          id: testCommentId,
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });

      it('status:400 for invalid inc_votes', async () => {
        const { body } = await request
          .patch(`/api/comments/${testCommentId}`)
          .send({ inc_votes: 'not a number' })
          .expect(400);

        expect(body.msg).toBe(
          'Bad Request - Invalid (inc-votes) Type'
        );
      });

      it('status:404 when comment_id does not exist', async () => {
        const { body } = await request
          .patch('/api/comments/non-existent-id')
          .send({ inc_votes: 1 })
          .expect(404);

        expect(body.msg).toBe('Not Found - Comment Does Not Exist!');
      });
    });

    describe('DELETE /api/comments/:comment_id', () => {
      it('status:204 deletes the given comment', async () => {
        await request
          .delete(`/api/comments/${testCommentId}`)
          .expect(204);

        const deletedComment = await prisma.comment.findUnique({
          where: { id: testCommentId },
        });
        expect(deletedComment).toBeNull();
      });

      it('status:404 when comment_id does not exist', async () => {
        const { body } = await request
          .delete('/api/comments/non-existent-id')
          .expect(404);

        expect(body.msg).toBe('Not Found - Comment Does Not Exist!');
      });
    });
  });
  describe('Authentication', () => {
    const testUser = usersData[0];

    beforeAll(async () => {
      process.env.JWT_SECRET =
        process.env.TEST_JWT_SECRET || 'testsecret';

      try {
        if (!testUser.password) {
          throw new Error('Test user must have a password');
        }

        await prisma.user.upsert({
          where: { username: testUser.username },
          update: {
            password: await argon2.hash(testUser.password),
          },
          create: {
            username: testUser.username,
            name: testUser.name,
            avatar_url: testUser.avatar_url || '',
            password: await argon2.hash(testUser.password),
          },
        });
      } catch (error) {
        console.error('Error setting up test user:', error);
        throw error;
      }
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    it('should return a token when correct credentials are provided', async () => {
      const res = await request.post('/api/login').send({
        username: testUser.username,
        password: testUser.password,
      });
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 when incorrect credentials are provided', async () => {
      const res = await request.post('/api/login').send({
        username: testUser.username,
        password: 'wrongpassword',
      });
      expect(res.status).toEqual(401);
    });

    it('should allow access to protected route with valid token', async () => {
      const loginRes = await request.post('/api/login').send({
        username: testUser.username,
        password: testUser.password,
      });
      expect(loginRes.status).toEqual(200);
      expect(loginRes.body).toHaveProperty('token');

      const token = loginRes.body.token;

      const protectedRes = await request
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`);
      expect(protectedRes.status).toEqual(200);
    });

    it('should deny access to protected route without token', async () => {
      const res = await request.get('/api/protected');
      expect(res.status).toEqual(401);
    });
  });
});
