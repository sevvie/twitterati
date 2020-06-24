import Twitter from 'twitter-lite'
import fs from 'fs'
import os from 'os'
import path from 'path'

const generateClient = async () => {
  const configDir = path.resolve(os.homedir(), '.twitterati')
  if (!fs.existsSync(configDir)) {
    if (process.env.DEBUG) console.warn(`-- creating config directory: ${configDir}...`)
    fs.mkdirSync(configDir)
  }
  const twitterConfigFile = path.resolve(configDir, 'twitter.json')
  let twitterConfig = {}
  if (!fs.existsSync(twitterConfigFile)) {
    console.info(`-- we need to create a twitter config.`)
    console.info(`-- please retrieve the following values from https://developer.twitter.com/en/apps:`)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    twitterConfig.apiKey = await new Promise(resolve => rl.question('API key: ', str => {
      resolve(str)
      rl.close()
    }))
    twitterConfig.apiSecret = await new Promise(resolve => rl.question('API secret key: ', str => {
      resolve(str)
      rl.close()
    }))
    twitterConfig.accessToken = await new Promise(resolve => rl.question('Access token: ', str => {
      resolve(str)
      rl.close()
    }))
    twitterConfig.accessSecret = await new Promise(resolve => rl.question('Access token secret: ', str => {
      resolve(str)
      rl.close()
    }))
  } else {
    twitterConfig = JSON.parse(fs.readFileSync(twitterConfigFile))
  }

  const client = new Twitter({
    consumer_key: twitterConfig.apiKey,
    consumer_secret: twitterConfig.apiSecret,
    access_token_key: twitterConfig.accessToken,
    access_token_secret: twitterConfig.accessSecret
  })

  return { client, twitterConfig }
}

export {
  generateClient
}