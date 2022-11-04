const { expect } = require("chai");
require("solidity-coverage");
describe("Multi Signature Wallet", function () {
  beforeEach(async () => {
    [addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
    MSW = await ethers.getContractFactory("MultiSigWallet");
    msw = await MSW.deploy([addr1.address, addr2.address, addr3.address], 2);

    to = addr4.address;
    value = 0;
    data = 0x0;

    await msw.submitTransaction(to, value, data);
    await msw.connect(addr1).confirmTransaction(0);
    await msw.connect(addr2).confirmTransaction(0);
  });

  describe("Deployment", function () {
    it("Check Owners", async () => {
      expect(await msw.isOwner(addr1.address)).to.be.equal(true);
      expect(await msw.isOwner(addr2.address)).to.be.equal(true);
      expect(await msw.isOwner(addr3.address)).to.be.equal(true);
    });

    it("Check Owners Array Length", async () => {
      let ownersArr = await msw.getOwners();
      expect(ownersArr.length).to.be.equal(3);
    });

    it("Check Number Of Confirmation Required", async () => {
      expect(await msw.numConfirmationsRequired()).to.be.equal(2);
    });
  });

  describe("Receive", async () => {
    it("Should Update Contract Balance and Emit Deposit Event .", async () => {
      await expect(msw.fallback({ value: 100 }))
        .to.emit(msw, "Deposit")
        .withArgs(addr1.address, 100, 100);
    });
  });

  describe("Submit Transaction", async () => {
    it("Should Transaction Add Into Transactions Array", async () => {
      msw.fallback({ value: 1000 });
      await msw.submitTransaction(addr4.address, 500, 0x0);
      expect(await msw.getTransactionCount()).to.be.equal(2);
    });

    it("Should Submit Tranaction Through Non Owner Account", async () => {
      await expect(
        msw.connect(addr4).submitTransaction(to, value, data)
      ).to.be.revertedWith("not owner");
    });
  });

  describe("Confirm Transaction", async () => {});

  describe("Execute Transaction", async () => {
    it("Should Execute", async () => {
      await msw.connect(addr1).executeTransaction(0);
      let tx = await msw.getTransaction(0);
      expect(tx.executed).to.be.equal(true);
    });
    it("Should Execute And Emit Event", async () => {
      await expect(msw.connect(addr1).executeTransaction(0))
        .to.emit(msw, "ExecuteTransaction")
        .withArgs(addr1.address, 0);
    });

    it("Should Execute If Transaction Is Already Executed", async () => {
      msw.connect(addr1).executeTransaction(0);
      await expect(msw.connect(addr1).executeTransaction(0)).to.be.revertedWith(
        "tx already executed"
      );
    });

    it("Should Execute Transaction If Transaction does not exist .", async () => {
      await expect(msw.connect(addr1).executeTransaction(2)).to.be.revertedWith(
        "tx does not exist"
      );
    });

    it("Should Non Owner Account Execute Transaction.", async () => {
      await expect(msw.connect(addr4).executeTransaction(0)).to.be.revertedWith(
        "not owner"
      );
    });
  });

  // describe("Revoke Confirmation", async () => {
  //   await msw.connect(addr2).revokeConfirmation(0);
  //   await msw.connect(addr1).executeTransaction(0);
  // });
});
