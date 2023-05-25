const { config } = require('../app');
const demoAssetsURL = `${config.APP_HOST}:${config.DEMO_ASSETS_PORT}`;
const devAssetsURL = `${config.APP_HOST}:${config.DEV_ASSETS_PORT}`;
module.exports = {
  demoAssetsURL,
  devAssetsURL
};
