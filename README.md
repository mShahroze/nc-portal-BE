# NC News API

This is a modern, RESTful API built with Next.js, Prisma, and TypeScript to serve as the backend for the NC News application. It provides endpoints for articles, topics, comments, and users, offering user-friendly functionality for a Reddit-style news aggregation site.

## 🚀 Live Demo

[Add your deployed API link here]

## 🛠️ Technologies Used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Jest](https://jestjs.io/) for testing

## 🏁 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- PostgreSQL

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/mShahroze/nc-portal-BE.git
   cd nc-portal-BE
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/nc_knews?schema=public"
   ```
   Replace `username`, `password`, and `nc_news` with your PostgreSQL credentials and desired database name.

4. Set up the database and run migrations:
   ```
   npx prisma migrate dev
   ```

5. Seed the database:
   ```
   npx prisma db seed
   ```

6. Start the development server:
   ```
   npm run dev
   ```

The API should now be running on `http://localhost:3000`.

## 📊 API Endpoints

Here are some of the available endpoints:

- `GET /api/topics`
- `POST /api/topics`
- `GET /api/articles`
- `POST /api/articles`
- `GET /api/articles/:article_id`
- `PATCH /api/articles/:article_id`
- `DELETE /api/articles/:article_id`
- `GET /api/articles/:article_id/comments`
- `POST /api/articles/:article_id/comments`
- `PATCH /api/comments/:comment_id`
- `DELETE /api/comments/:comment_id`
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:username`

For a full list of endpoints and their descriptions, refer to the `src/swagger.ts` file or visit the `/api-docs` endpoint when the server is running.

## 🧪 Running Tests

This project uses Jest for testing. To run the tests:

```
npm test
```

## 📁 Project Structure

```
nc-news-api/
├─ prisma/
│  ├─ migrations/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ controllers/
│  ├─ db/
│  ├─ errors/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ spec/
│  ├─ types/
│  ├─ app.ts
│  ├─ endpoints.ts
│  └─ swagger.ts
├─ .env
├─ package.json
├─ tsconfig.json
└─ README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👏 Acknowledgments

- [Northcoders](https://northcoders.com/) for the project inspiration and support
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [Next.js](https://nextjs.org/) for the powerful React framework

## 📞 Contact

If you have any questions or feedback, please open an issue on this repository.

---

Happy coding! 🚀