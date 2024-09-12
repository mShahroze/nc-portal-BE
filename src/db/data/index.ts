import testData from './test-data';
import developmentData from './development-data';

const env = process.env.NODE_ENV || 'development';

const data: { [key: string]: typeof testData } = {
  test: testData,
  development: developmentData,
  production: developmentData, // Assuming production uses the same data as development
};

export default data[env];
