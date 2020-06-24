"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateClient = void 0;

var _twitterLite = _interopRequireDefault(require("twitter-lite"));

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const generateClient = async () => {
  const configDir = _path.default.resolve(_os.default.homedir(), '.twitterati');

  if (!_fs.default.existsSync(configDir)) {
    if (process.env.DEBUG) console.warn(`-- creating config directory: ${configDir}...`);

    _fs.default.mkdirSync(configDir);
  }

  const twitterConfigFile = _path.default.resolve(configDir, 'twitter.json');

  let twitterConfig = {};

  if (!_fs.default.existsSync(twitterConfigFile)) {
    console.info(`-- we need to create a twitter config.`);
    console.info(`-- please retrieve the following values from https://developer.twitter.com/en/apps:`);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    twitterConfig.apiKey = await new Promise(resolve => rl.question('API key: ', str => {
      resolve(str);
      rl.close();
    }));
    twitterConfig.apiSecret = await new Promise(resolve => rl.question('API secret key: ', str => {
      resolve(str);
      rl.close();
    }));
    twitterConfig.accessToken = await new Promise(resolve => rl.question('Access token: ', str => {
      resolve(str);
      rl.close();
    }));
    twitterConfig.accessSecret = await new Promise(resolve => rl.question('Access token secret: ', str => {
      resolve(str);
      rl.close();
    }));
  } else {
    twitterConfig = JSON.parse(_fs.default.readFileSync(twitterConfigFile));
  }

  const client = new _twitterLite.default({
    consumer_key: twitterConfig.apiKey,
    consumer_secret: twitterConfig.apiSecret,
    access_token_key: twitterConfig.accessToken,
    access_token_secret: twitterConfig.accessSecret
  });
  return {
    client,
    twitterConfig
  };
};

exports.generateClient = generateClient;