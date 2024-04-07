const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "EnergyToken";
const SYMBOL = "ET";

const AMOUNT = 5;
const PRICE = ethers.utils.parseUnits("1", "ether");

describe(NAME, function () {
  let energyToken;
  let deployer, user;

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();
    const EnergyToken = await ethers.getContractFactory(NAME);
    energyToken = await EnergyToken.deploy(NAME, SYMBOL);

    let transaction = await energyToken
      .connect(deployer)
      .setPin(deployer.address, 2);
    await transaction.wait();

    transaction = await energyToken.connect(deployer).setPin(user.address, 4);
    await transaction.wait();

    transaction = await energyToken
      .connect(deployer)
      .listSellRequest(AMOUNT, PRICE);
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await energyToken.name()).to.equal(NAME);
    });

    it("Sets the symbol", async () => {
      expect(await energyToken.symbol()).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      expect(await energyToken.owner()).to.equal(deployer.address);
    });
  });

  describe("Create Sell Request", () => {
    it("Increments Sell Requests Count", async () => {
      const totalSellRequests = await energyToken.totalSellRequests();
      expect(totalSellRequests).to.equal(1);
    });

    it("Checks Sell Request Information", async () => {
      const sellRequest = await energyToken.getSellRequest(1);
      expect(sellRequest.id).to.equal(1);
      expect(sellRequest.creator).to.equal(deployer.address);
      expect(sellRequest.price).to.equal(PRICE);
      expect(sellRequest.amount).to.equal(AMOUNT);
      expect(sellRequest.status).to.equal(true);
    });
  });

  describe("Buy Energy", async () => {
    const ID = 1;
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);
      transaction = await energyToken
        .connect(user)
        .buyEnergy(ID, { value: PRICE });

      await transaction.wait();
    });

    it("Increments Total Trades Count", async () => {
      const totalTrades = await energyToken.totalTrades();
      expect(totalTrades).to.equal(1);
    });

    it("Updates Sell Request Status", async () => {
      const sellRequest = await energyToken.getSellRequest(ID);
      expect(sellRequest.status).to.equal(false);
    });

    it("Updates Seller balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.greaterThan(balanceBefore);
    });

    it("Updates Contract balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(
        energyToken.address
      );
      expect(balanceAfter).to.equal(0);
    });
  });
});
