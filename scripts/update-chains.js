const util = require('util')
const fetch = require('node-fetch')
const { writeFile } = require('fs/promises')

const run = async () => {

  const res = await fetch('https://chainid.network/chains.json')

  const chains = await res.json()

  if (!chains.map( c => c.name ).includes('Ethereum Mainnet')) {
    throw new Error('something wrong... check!')
  }

  await writeFile('./src/chains.js', `
const chains = ${util.inspect(chains, { depth: null, maxArrayLength: null })}

export default chains
`
)

}

run()
