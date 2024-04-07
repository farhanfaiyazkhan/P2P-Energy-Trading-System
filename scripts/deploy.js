const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const user = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners();
  const NAME = "EnergyToken";
  const SYMBOL = "ET";

  // Deploy contract
  const EnergyToken = await ethers.getContractFactory("EnergyToken");
  const energyToken = await EnergyToken.deploy(NAME, SYMBOL);
  await energyToken.deployed();

  console.log(`Deployed Energy Token Contract at: ${energyToken.address}\n`);

  let transaction = await energyToken
    .connect(deployer)
    .setPin(deployer.address, 2);
  await transaction.wait();

  transaction = await energyToken.connect(deployer).setPin(user, 4);
  await transaction.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
