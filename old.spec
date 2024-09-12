import supertest from 'supertest';
import chai from 'chai';
import app from '../app';
import connection from '../db/connection';
import { after } from 'node:test';

const request = supertest(app);
const { expect } = chai;

describe('/api', () => {
  beforeEach(() => connection.seed.run());

  after(() => connection.destroy());

  describe('topics', () => {
    it('GET / status:200 responds with an array of topic objects', () =>
      request
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an('array');
          expect(body.topics[0]).to.contain.keys(
            'description',
            'slug'
          );
        }));

    it('POST / status:201 responds with posted topic object', () =>
      request
        .post('/api/topics')
        .send({ description: 'Hi there boss!', slug: 'Sharoze' })
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.eql({
            description: 'Hi there boss!',
            slug: 'Sharoze',
          });
        }));

    it('POST / 400 given for missing description property', () =>
      request
        .post('/api/topics')
        .send({ slug: 'Godzilla' })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Bad Request - Invalid Property/Property Missing!'
          );
        }));

    it('GET / 405 given a method that is not allowed', () =>
      request
        .delete('/api/topics')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('Method Not Allowed');
        }));

    it('POST / 422 given for keying existing slug (unprocessable)', () =>
      request
        .post('/api/topics')
        .send({ description: 'Hello Master!', slug: 'cats' })
        .expect(422)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Unique Key Violation!. Request cannot be processed'
          );
        }));
  });

  describe('articles', () => {
    it('GET / status:200 responds with an array of article objects', () =>
      request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.contain.keys(
            'article_id',
            'title',
            'topic',
            'author',
            'votes',
            'body',
            'created_at'
          );
        }));

    it('GET / status:200 responds with an array of article objects with correct comment_count property', () =>
      request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.contain.keys('comment_count');
          expect(body.articles[0].comment_count).to.equal('13');
        }));

    it('GET / status:200 responds with array of articles filtered by username', () =>
      request
        .get('/api/articles?author=icellusedkars')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(6);
        }));

    it('GET / status:200 responds with array of articles filtered by topic', () =>
      request
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(1);
        }));

    it('GET / returns articles sorted by the title descending', () =>
      request
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Z');
        }));

    it('GET / returns articles sorted by (DEFAULT) to Date', () =>
      request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].created_at).to.equal(
            '2018-11-15T12:21:54.171Z'
          );
        }));

    it('GET / returns articles sorted by (QUERY) order asc', () =>
      request
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Moustache');
        }));

    it('GET / returns articles sorted by (DEFAULT) order desc', () =>
      request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal(
            'Living in the shadow of a great man'
          );
        }));

    it('GET / limit number of articles by (QUERY) limit', () =>
      request
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(5);
          expect(body.articles[2].body).to.equal('some gifs');
        }));

    it('GET / limit number of articles by (DEFAULT) limit', () =>
      request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[9].body).to.equal(
            "Who are we kidding, there is only one, and it's Mitch!"
          );
        }));

    it('GET / returns number of items (QUERY) paginated by page when page = 1', () =>
      request
        .get('/api/articles?limit=5&page=1')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(5);
          expect(body.articles[2].body).to.equal('some gifs');
        }));

    it('GET / returns number of items (QUERY) paginated by page when page = 2', () =>
      request
        .get('/api/articles?limit=6&page=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(6);
          expect(body.articles[5].body).to.equal(
            'Have you seen the size of that thing?'
          );
        }));

    it('GET / status:200 responds with total_count of articles', () =>
      request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
          expect(body.total_count).to.equal('12');
        }));

    it('GET / status:200 responds with total_count of articles (QUERY) filtered by author', () =>
      request
        .get('/api/articles?author=icellusedkars')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(6);
          expect(body.total_count).to.equal('12');
        }));

    it('GET / status:200 responds with total_count of articles (QUERY) filtered by sort_by', () =>
      request
        .get('/api/articles?sort_by=body')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
          expect(body.total_count).to.equal('12');
          expect(body.articles[0].body).to.equal('some gifs');
        }));

    it('POST / status:201 responds with posted article object', () =>
      request
        .post('/api/articles')
        .send({
          title: 'Down with the shadows',
          body: 'Death is only the start',
          topic: 'cats',
          author: 'rogersop',
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.article.article_id).to.eql(13);
          expect(body.article).to.have.keys(
            'article_id',
            'title',
            'topic',
            'author',
            'body',
            'created_at',
            'votes'
          );
        }));

    it('GET / 405 given a method that is not allowed', () =>
      request
        .delete('/api/articles')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('Method Not Allowed');
        }));

    it('POST / 422 unprocessable Identity username is not unique', () =>
      request
        .post('/api/articles')
        .send({
          title: 'Down with the shadows',
          body: 'Death is only the start',
          topic: 'cats',
          author: 'timMartin',
        })
        .expect(422)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Unique Key Violation!. Request cannot be processed'
          );
        }));

    it('GET / status:200 responds with an array of topic objects', () =>
      request
        .get('/api/articles?sort_by=description')
        .expect(500)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Property does not Exist - Internal Server Error'
          );
        }));
  });

  describe('users', () => {
    it('GET / status:200 responds with array of user objects', () =>
      request
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body.users).to.be.an('array');
          expect(body.users[0]).to.contain.keys(
            'username',
            'avatar_url',
            'name'
          );
        }));

    it('POST / status:201 responds with posted user object', () =>
      request
        .post('/api/users')
        .send({
          username: 'BillGates',
          avatar_url:
            'https://cdn.britannica.com/47/188747-050-1D34E743.jpg',
          name: 'Bill Gates',
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).to.eql({
            username: 'BillGates',
            avatar_url:
              'https://cdn.britannica.com/47/188747-050-1D34E743.jpg',
            name: 'Bill Gates',
          });
        }));

    it('GET / status:200 responds with a user object by username', () =>
      request
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.be.an('object');
          expect(body.user).to.contain.keys(
            'username',
            'avatar_url',
            'name'
          );
        }));

    it('GET / 404 given a username that does not exist', () =>
      request
        .get('/api/users/NonExistentUser')
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.equal('Route Does Not Exist');
        }));

    it('GET / 405 given a method that is not allowed', () =>
      request
        .delete('/api/users')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('Method Not Allowed');
        }));
  });
});
