import { generateClient } from '../../src/services/twitter.js'
import fs from 'fs'
import os from 'os'
import path from 'path'

test('generateClient', async () => {
  const configFile = path.resolve(os.homedir(), '.twitterati', 'twitter.json')
  expect(fs.existsSync(configFile)).toBeTruthy()

  const { client, twitterConfig } = await generateClient()
  expect(client).not.toBeUndefined()
  expect(twitterConfig.apiKey).not.toBeUndefined()
})