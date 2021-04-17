module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);

  if (config.testingType === 'component') {
    const { startDevServer } = require('@cypress/webpack-dev-server');
    const webpackConfig = require('../../webpack.dev.config');

    on('dev-server:start', (options) =>
      startDevServer({ options, webpackConfig }),
    );
  }

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
