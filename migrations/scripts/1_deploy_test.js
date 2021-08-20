const realm = process.env.WITNET_EVM_REALM ? process.env.WITNET_EVM_REALM.toLowerCase() : "default"
const witnetAddresses = require("../witnet.addresses")[realm]
const erc2362Settings = require("../settings")

const ERC2362PriceFeed = artifacts.require(
  erc2362Settings.artifacts[realm].ERC2362PriceFeed
    || erc2362Settings.artifacts.default.ERC2362PriceFeed
)

module.exports = async function (deployer, network) {
  network = network.split("-")[0]
  if (network !== "test") {
    console.error(`
Please, migrate examples by using the package manager:

  $ npm run migrate-flattened <network> <PriceFeedExample>

To list available data feed examples:

  $ npm run avail:examples

Enjoy the power of the Witnet Decentralized Oracle Network ;-)
    `)
    process.exit(1)
  }  
  else if (!witnetAddresses) {
    console.error(`There are no Witnet addresses set for realm '${realm}'.\n`)
    process.exit(1)
  }
  console.log(`\nDeployment smoke testing of '${ERC2362PriceFeed.contractName}' contract...`)
  let pf = await deployer.deploy(
      ERC2362PriceFeed,      
      witnetAddresses[realm].WitnetRequestBoard,
      "ERC2362ID",
      ...(
        erc2362Settings.constructorParams[realm].ERC2362PriceFeed
          || erc2362Settings.constructorParams.default.ERC2362PriceFeed
      )
    )
  await pf.initialize("0x80")
  console.log("Done.\n")
}