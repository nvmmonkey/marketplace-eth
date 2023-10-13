const CourseMarketplace = artifacts.require("CourseMarketPlace");
const { catchRevert } = require("./utils/exceptions");

//Mocha - testing framework
//Chai - assertion JS library

const getBalance = async (address) => web3.eth.getBalance(address);
const toBN = (value) => web3.utils.toBN(value);

const getGas = async (result) => {
  //get the result of tx from the callback of the repurchase func
  const tx = await web3.eth.getTransaction(result.tx);

  //get the gasUsed (unit gas used) by the tx
  const gasUsed = toBN(result.receipt.gasUsed);
  //get the tx gasPrice
  const gasPrice = toBN(tx.gasPrice);
  //get the actual gas spent by multiply gasPrice * gasUsed in BigNumber
  const gas = gasUsed.mul(gasPrice);

  return gas;
};

contract("CourseMarketPlace", (accounts) => {
  const courseId = "0x00000000000000000000000000003130";
  const proof =
    "0x0000000000000000000000000000313000000000000000000000000000003130";
  const value = "900000000";

  const courseId2 = "0x00000000000000000000000000002130";
  const proof2 =
    "0x0000000000000000000000000000213000000000000000000000000000002130";

  let _contract = null;
  let contractOwner = null;
  let buyer = null;
  let courseHash = null;

  before(async () => {
    _contract = await CourseMarketplace.deployed();
    contractOwner = accounts[0];
    buyer = accounts[1];

    // console.log(_contract);
    // console.log(contractOwner);
    // console.log(buyer);
  });

  describe("Purchase the new course", () => {
    before(async () => {
      await _contract.purchaseCourse(courseId, proof, { from: buyer, value });
    });

    it("should NOT allow to repurchase already owned course", async () => {
      await catchRevert(
        _contract.purchaseCourse(courseId, proof, { from: buyer, value })
      );
    });

    it("can get the purchased course hash by index", async () => {
      const index = 0;
      courseHash = await _contract.getCourseHashAtIndex(index);

      const expectedHash = web3.utils.soliditySha3(
        { t: "bytes16", v: courseId },
        { t: "address", v: buyer }
      );

      assert.equal(
        courseHash,
        expectedHash,
        "Course hash is not matching the hash of purchased course!"
      );
    });

    it("should match the data of the course purchased by buyer", async () => {
      const expectedIndex = 0;
      const expectedState = 0;
      const course = await _contract.getCourseHashByHash(courseHash);

      assert.equal(course.id, expectedIndex, "Course index should be 0!");
      assert.equal(course.price, value, `Course price should be ${value}!`);
      assert.equal(course.proof, proof, `Course proof should be ${proof}!`);
      assert.equal(course.owner, buyer, `Course owner should be ${buyer}!`);
      assert.equal(
        course.state,
        expectedState,
        `Course state should be ${expectedState}!`
      );
    });
  });

  describe("Activate the purchased course", () => {
    it("should NOT be able to activate course by NOT contract owner", async () => {
      await catchRevert(_contract.activateCourse(courseHash, { from: buyer }));
    });

    it("should have activated status", async () => {
      await _contract.activateCourse(courseHash, { from: contractOwner });
      const course = await _contract.getCourseHashByHash(courseHash);
      const expectedState = 1;

      assert.equal(
        course.state,
        expectedState,
        "Course should have 'activated' state!"
      );
    });
  });

  describe("Transfer ownership", () => {
    let currentOwner = null;

    before(async () => {
      currentOwner = await _contract.getContractOwner();
    });

    it("getContractOwner should return deployer address", async () => {
      assert.equal(
        contractOwner,
        currentOwner,
        "Contract owner is not matching the one from getContractOwner function"
      );
    });

    it("should NOT transfer ownership when contract owner is not sending TX ", async () => {
      {
        await catchRevert(
          _contract.transferOwnership(accounts[3], { from: accounts[4] })
        );
      }
    });

    it("should tranfer ownership to 3rd address from 'accounts'", async () => {
      await _contract.transferOwnership(accounts[2], { from: currentOwner });
      const owner = await _contract.getContractOwner();
      assert.equal(
        owner,
        accounts[2],
        "Contract owner is not the second account "
      );
    });

    it("should tranfer ownership back to initial contract owner'", async () => {
      await _contract.transferOwnership(contractOwner, { from: accounts[2] });
      const owner = await _contract.getContractOwner();
      assert.equal(owner, contractOwner, "Contract owner is not set ");
    });
  });

  describe("Deactivate course", () => {
    let courseHash2 = null;
    let currentOwner = null;

    before(async () => {
      await _contract.purchaseCourse(courseId2, proof2, { from: buyer, value });
      courseHash2 = await _contract.getCourseHashAtIndex(1);

      currentOwner = await _contract.getContractOwner();
    });

    it("should NOT be able to deactivate the course by NOT contract owner", async () => {
      await catchRevert(
        _contract.deactivateCourse(courseHash2, { from: buyer })
      );
    });

    it("should have status of deactivated and price 0", async () => {
      const beforeTxBuyerBalance = await getBalance(buyer);
      const beforeTxContractBalance = await getBalance(_contract.address);
      const beforeTxOwnerBalance = await getBalance(currentOwner);

      const result = await _contract.deactivateCourse(courseHash2, {
        from: contractOwner,
      });

      const afterTxBuyerBalance = await getBalance(buyer);
      const afterTxContractBalance = await getBalance(_contract.address);
      const afterTxOwnerBalance = await getBalance(currentOwner);

      const course = await _contract.getCourseHashByHash(courseHash2);
      const expectedState = 2;
      const expectedPrice = 0;
      const gas = await getGas(result);

      assert.equal(course.state, expectedState, "Course is NOT deactivated!");
      assert.equal(course.price, expectedPrice, "Course price is not 0!");

      assert.equal(
        toBN(beforeTxOwnerBalance).sub(gas).toString(),
        afterTxOwnerBalance,
        "Contract Owner balance is not correct!"
      );

      assert.equal(
        toBN(beforeTxBuyerBalance).add(toBN(value)).toString(),
        afterTxBuyerBalance,
        "Buyer balance is not correct!"
      );

      assert.equal(
        toBN(beforeTxContractBalance).sub(toBN(value)).toString(),
        afterTxContractBalance,
        "Contract balance is not correct!"
      );
    });

    it("should NOT be able activate deactivated course", async () => {
      await catchRevert(
        _contract.activateCourse(courseHash2, { from: contractOwner })
      );
    });
  });

  describe("Repurchase course", () => {
    let courseHash2 = null;

    before(async () => {
      courseHash2 = await _contract.getCourseHashAtIndex(1);
    });

    it("should NOT repurchase when the course does not exist", async () => {
      const notExistingHash =
        "0xaa2a944939fd0cf617385c313e12b40ae12e5b68f043d909a5c33ff204557e86";
      await catchRevert(
        _contract.repurchaseCourse(notExistingHash, { from: buyer })
      );
    });

    it("should NOT repurchase with not course owner", async () => {
      const notOwnerAddress = accounts[2];
      await catchRevert(
        _contract.repurchaseCourse(courseHash2, { from: notOwnerAddress })
      );
    });

    it("should be able repurchase with the original buyer", async () => {
      const beforeTxBuyerBalance = await getBalance(buyer);
      const beforeTxContractBalance = await getBalance(_contract.address);

      const result = await _contract.repurchaseCourse(courseHash2, {
        from: buyer,
        value,
      });

      const afterTxBuyerBalance = await getBalance(buyer);
      const afterTxContractBalance = await getBalance(_contract.address);

      const course = await _contract.getCourseHashByHash(courseHash2);
      const expectedState = 0;
      const gas = await getGas(result);

      assert.equal(
        course.state,
        expectedState,
        "The course is not in purchased state"
      );
      assert.equal(
        course.price,
        value,
        "The course price is not equal to value"
      );

      assert.equal(
        toBN(beforeTxBuyerBalance).sub(toBN(value)).sub(gas).toString(),
        afterTxBuyerBalance,
        "Client balance is not correct!"
      );

      assert.equal(
        toBN(beforeTxContractBalance).add(toBN(value)).toString(),
        afterTxContractBalance,
        "Contract balance is not correct!"
      );
    });

    it("should NOT be able to repurchase purchased course", async () => {
      await catchRevert(
        _contract.repurchaseCourse(courseHash2, { from: buyer, value })
      );
    });
  });
});
