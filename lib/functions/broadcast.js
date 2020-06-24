"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.broadcast = void 0;

var _pleroma = require("../services/pleroma");

var _twitter = require("../services/twitter");

const broadcast = async message => {
  try {
    const bird = await (0, _twitter.generateClient)();
    const pler = await (0, _pleroma.generateClient)('https://ap.sevvie.ltd', 'pleroma');
    const toot = await pler.client.postStatus(message);
    const shortMsg = `${message.length > 242 ? message.slice(0, 241) + '[...] ' : message} ${toot.data.url}`;
    const tweet = await bird.client.post('statuses/update', {
      status: shortMsg
    }); // console.info(toot.data.url)
    // console.info(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)

    return {
      toot: toot.data.url,
      tweet: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.broadcast = broadcast;