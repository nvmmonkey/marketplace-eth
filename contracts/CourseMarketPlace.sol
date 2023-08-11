// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketPlace {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Course {
        uint id; //32
        uint price; //32
        bytes32 proof; //32
        address owner; //20
        State state; //1
    }

    function purchaseCourse(
        bytes16 courseId,
        bytes32 proof //assume proof is ==> 0x0000000000000000000000000000313000000000000000000000000000003130
    ) external payable returns (bytes32) {
        //course id - 10
        //ascii to hex 10 is 31 30
        //CourseId is 16 bytes in Hex:0x00000000000000000000000000003130
        // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
        // pre-hash value = 000000000000000000000000000031305B38Da6a701c568545dCfcB03FcB875f56beddC4
        // keccak256(pre-hash value) = c4eaa3558504e2baa2669001b43f359b8418b44a4477ff417b4b007d7cc86e37
        //   IDE test hex output   - 0xc4eaa3558504e2baa2669001b43f359b8418b44a4477ff417b4b007d7cc86e37
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        return courseHash;
    }
}
