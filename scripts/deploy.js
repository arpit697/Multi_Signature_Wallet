const hre = require("hardhat");

async function main() {
  const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(["0x9d82916A59E4844f3F5B69607c8C3A482A6Cc868","0x2BA3B937c627e74F3b7E816AA990Fb3F64bF9246"],2);

  await multiSigWallet.deployed();

  console.log("multi signature wallet deployed at address:", multiSigWallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//npx hardhat run scripts/deploy.js --network goerli
