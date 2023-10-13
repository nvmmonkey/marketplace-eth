const CourseMarketplace = artifacts.require("CourseMarketPlace");
const { catchRevert } = require("./utils/exceptions");

//Mocha - testing framework
//Chai - assertion JS library

contract("CourseMarketPlace", (accounts) => {
  const courseId = "0x00000000000000000000000000003130";
  const proof =
    "0x0000000000000000000000000000313000000000000000000000000000003130";
  const value = "900000000";

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
});
