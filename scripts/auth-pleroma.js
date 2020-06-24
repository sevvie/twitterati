const { generateClient } = require('../lib/services/pleroma')

const main = async () => {
  const { client, pleromaConfig } = generateClient('https://ap.sevvie.ltd', 'pleroma')
}

main()