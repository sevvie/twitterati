"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateClient = void 0;

var _megalodon = _interopRequireWildcard(require("megalodon"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

var _readline = _interopRequireDefault(require("readline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const SCOPES = ['read', 'write', 'follow'];

const generateClient = async (baseUrl, serverType) => {
  const configDir = _path.default.resolve(_os.default.homedir(), '.twitterati');

  if (!_fs.default.existsSync(configDir)) {
    if (process.env.DEBUG) console.warn(`-- creating config directory: ${configDir}...`);

    _fs.default.mkdirSync(configDir);
  }

  const pleromaConfigFile = _path.default.resolve(configDir, 'pleroma.json');

  let pleromaConfig;
  if (!_fs.default.existsSync(pleromaConfigFile)) pleromaConfig = {};else pleromaConfig = JSON.parse(_fs.default.readFileSync(pleromaConfigFile));
  let client = (0, _megalodon.default)(serverType, baseUrl);

  if (!pleromaConfig.refreshToken) {
    console.info(`-- registering application with ${baseUrl}...`);
    const appData = await client.registerApp('twitterati', {
      scopes: SCOPES
    });
    pleromaConfig.clientId = appData.clientId;
    pleromaConfig.clientSecret = appData.clientSecret;
    console.info(`-- authenticate with the server at the following address`);
    console.info(`-- ${appData.url}`);
    console.info(` `);

    const rl = _readline.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const authorizationCode = await new Promise(resolve => {
      rl.question('...and enter the authorization code: ', code => {
        resolve(code);
        rl.close();
      });
    });
    const tokenData = await client.fetchAccessToken(pleromaConfig.clientId, pleromaConfig.clientSecret, authorizationCode);
    if (process.env.DEBUG) console.warn(`-- access token retrieved: ${tokenData.accessToken}`);
    pleromaConfig.accessToken = tokenData.access_token;
    pleromaConfig.refreshToken = tokenData.refresh_token;
    const pleromaConfigUpdate = JSON.stringify(pleromaConfig);

    _fs.default.writeFileSync(pleromaConfigFile, pleromaConfigUpdate);
  } else {
    const tokenData = await client.refreshToken(pleromaConfig.clientId, pleromaConfig.clientSecret, pleromaConfig.refreshToken);
    pleromaConfig.accessToken = tokenData.access_token;
    pleromaConfig.refreshToken = tokenData.refresh_token;
    const pleromaConfigUpdate = JSON.stringify(pleromaConfig);

    _fs.default.writeFileSync(pleromaConfigFile, pleromaConfigUpdate);
  }

  client = (0, _megalodon.default)(serverType, baseUrl, pleromaConfig.accessToken);
  return {
    client,
    pleromaConfig
  };
};

exports.generateClient = generateClient;