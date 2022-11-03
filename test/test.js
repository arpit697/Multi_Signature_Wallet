const { expect } = require("chai");

describe("Multi Signature Wallet", function () {
    beforeEach(async () => {
      [addr1, addr2, ...addrs] = await ethers.getSigners();
      Token = await ethers.getContractFactory("ERC20");
      ERC20Instance = await Token.deploy();
      amount = 100;
      ownerTokens = await ERC20Instance.balanceOf(owner.address);
    });
});