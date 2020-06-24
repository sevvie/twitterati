import { generateClient } from '../../src/services/pleroma'
import fs from 'fs'
import os from 'os'
import path from 'path'

test('generateClient (with config)', async () => {
  const configFile = path.resolve(os.homedir(), '.twitterati', 'pleroma.json')
  expect(fs.existsSync(configFile)).toBeTruthy()

  const { client, pleromaConfig } = await generateClient('https://ap.sevvie.ltd', 'pleroma')

  expect(pleromaConfig.accessToken).not.toBeUndefined()
  expect(client).not.toBeUndefined()
})