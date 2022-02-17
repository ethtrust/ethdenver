//SPDX-License-Identifier: ISC
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EthTrustDenverDemo {
    address public owner;
    mapping(address => bool) public lightEmUp;

    event ToggleOn(address indexed _from);

    event ToggleOff(address indexed _from);

    constructor() {
        owner = msg.sender;
    }

    function toggleOff() public {
        // require(lightEmUp[msg.sender] == true);
        lightEmUp[msg.sender] = false;
        emit ToggleOff(msg.sender);
    }

    function toggleOn() public {
        // require(lightEmUp[msg.sender] == false);
        lightEmUp[msg.sender] = true;
        emit ToggleOn(msg.sender);
    }

    function getLightState() public view returns (bool) {
        return lightEmUp[msg.sender];
    }
}
