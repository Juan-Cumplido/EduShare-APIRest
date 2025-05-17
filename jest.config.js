export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/api_rest/routes/**/*.js",
    "src/api_rest/controllers/**/*.js",
    "src/api_rest/middlewares/**/*.js",
    "src/api_rest/model/sql/**/*.js",
    "!src/api_rest/middlewares/cors.js",
    "!src/api_rest/utilidades/**",
    "!src/api_rest/schemas/**",
    "!src/server.js",
    "!app.js"
  ],
  coverageReporters: ["text", "lcov"]
  };
  