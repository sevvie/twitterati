import generator, { OAuth } from 'megalodon'
import fs from 'fs'
import path from 'path'
import os from 'os'
import readline from 'readline'

const SCOPES = ['read', 'write', 'follow']

const generateClient = async (baseUrl, serverType) => {
  const configDir = path.resolve(os.homedir(), '.twitterati')
  if (!fs.existsSync(configDir)) {
    if (process.env.DEBUG) console.warn(`-- creating config directory: ${configDir}...`)
    fs.mkdirSync(configDir)
  }

  const pleromaConfigFile = path.resolve(configDir, 'pleroma.json')
  let pleromaConfig
  if (!fs.existsSync(pleromaConfigFile)) pleromaConfig = {}
  else pleromaConfig = JSON.parse(fs.readFileSync(pleromaConfigFile))

  let client = generator(serverType, baseUrl)
  if (!pleromaConfig.refreshToken) {
    console.info(`-- registering application with ${baseUrl}...`)

    const appData = await client.registerApp('twitterati', { scopes: SCOPES })
    pleromaConfig.clientId = appData.clientId
    pleromaConfig.clientSecret = appData.clientSecret
    console.info(`-- authenticate with the server at the following address`)
    console.info(`-- ${appData.url}`)
    console.info(` `)

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const authorizationCode = await new Promise(resolve => {
      rl.question('...and enter the authorization code: ', code => {
        resolve(code)
        rl.close()
      })
    })

    const tokenData = await client.fetchAccessToken(pleromaConfig.clientId, pleromaConfig.clientSecret, authorizationCode)
    if (process.env.DEBUG) console.warn(`-- access token retrieved: ${tokenData.accessToken}`)
    pleromaConfig.accessToken = tokenData.access_token
    pleromaConfig.refreshToken = tokenData.refresh_token

    const pleromaConfigUpdate = JSON.stringify(pleromaConfig)
    fs.writeFileSync(pleromaConfigFile, pleromaConfigUpdate)
  } else {
    const tokenData = await client.refreshToken(pleromaConfig.clientId, pleromaConfig.clientSecret, pleromaConfig.refreshToken)
    pleromaConfig.accessToken = tokenData.access_token
    pleromaConfig.refreshToken = tokenData.refresh_token

    const pleromaConfigUpdate = JSON.stringify(pleromaConfig)
    fs.writeFileSync(pleromaConfigFile, pleromaConfigUpdate)
  }

  client = generator(serverType, baseUrl, pleromaConfig.accessToken)
  return { client, pleromaConfig }
}

export {
  generateClient
}