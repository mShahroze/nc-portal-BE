import { PrismaClient } from '@prisma/client';
import topicData from '../src/db/data/development-data/topics.js';
import userData from '../src/db/data/development-data/users.js';
import articleData from '../src/db/data/development-data/articles.js';
import commentData from '../src/db/data/development-data/comments.js';

const prisma = new PrismaClient();

export async function seed() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
    await prisma.topic.deleteMany();

    console.log('Seeding topics...');
    const createdTopics = await Promise.all(
      topicData.map((topic) => prisma.topic.create({ data: topic }))
    );
    console.log(`Created ${createdTopics.length} topics.`);

    console.log('Seeding users...');
    const createdUsers = await Promise.all(
      userData.map((user) => prisma.user.create({ data: user }))
    );
    console.log(`Created ${createdUsers.length} users.`);

    console.log('Seeding articles...');
    const createdArticles = await Promise.all(
      articleData.map(async (article) => {
        const author = await prisma.user.findUnique({
          where: { username: article.author },
        });
        const topic = await prisma.topic.findUnique({
          where: { slug: article.topic },
        });

        if (!author || !topic) {
          console.warn(
            `Skipping article: ${article.title} due to missing author or topic`
          );
          return null;
        }

        return prisma.article.create({
          data: {
            title: article.title,
            body: article.body,
            votes: article.votes,
            created_at: new Date(article.created_at),
            author: { connect: { id: author.id } },
            topic: { connect: { id: topic.id } },
          },
        });
      })
    );
    console.log(
      `Created ${createdArticles.filter(Boolean).length} articles.`
    );

    console.log('Seeding comments...');
    const createdComments = await Promise.all(
      commentData.map(async (comment) => {
        const article = await prisma.article.findFirst({
          where: { title: comment.belongs_to },
        });
        const author = await prisma.user.findUnique({
          where: { username: comment.created_by },
        });

        if (!article || !author) {
          console.warn(
            `Skipping comment for article: ${comment.belongs_to} due to missing article or author`
          );
          return null;
        }

        return prisma.comment.create({
          data: {
            body: comment.body,
            votes: comment.votes,
            created_at: new Date(comment.created_at),
            author: { connect: { id: author.id } },
            article: { connect: { id: article.id } },
          },
        });
      })
    );
    console.log(
      `Created ${createdComments.filter(Boolean).length} comments.`
    );

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this script is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seed()
    .then(() => {
      console.log('Seed script completed.');
      process.exit(0);
    })
    .catch((e) => {
      console.error('Seed script failed:', e);
      process.exit(1);
    });
}
