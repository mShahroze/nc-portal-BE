import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NC Portal API',
      version: '1.0.0',
      description: 'API for NC Portal',
    },
    servers: [
      {
        url: 'http://localhost:9090',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // files containing annotations as above
};

export const swaggerSpec = swaggerJsdoc(options);
