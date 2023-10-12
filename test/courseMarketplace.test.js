const CourseMarketplace = artifacts.require("CourseMarketPlace");

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
      const courseHash = await _contract.getCourseHashAtIndex(index);

      const expectedHash = web3.utils.soliditySha3(
        { t: "bytes16", v: courseId },
        { t: "address", v: buyer }
      );

      assert.equal(courseHash, expectedHash, "Course hash is not matching the hash of purchased course")
    });
  });
});
