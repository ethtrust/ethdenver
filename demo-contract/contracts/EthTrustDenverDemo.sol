//SPDX-License-Identifier: ISC
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EthTrustDenverDemo {
    address public owner;
    bool public isOn;

    event OnIntent(address indexed _from);
    event ConfirmOn(address indexed _from);
    event OffIntent(address indexed _from);
    event ConfirmOff(address indexed _from);

    constructor() {
        owner = msg.sender;
    }

    function toggleOff() public {
        // require(lightEmUp[msg.sender] == true);
        // lightEmUp[msg.sender] = false;
        emit OffIntent(msg.sender);
    }

    function confirmOff() public {
        isOn = false;
        emit ConfirmOff(msg.sender);
    }

    function toggleOn() public {
        // require(lightEmUp[msg.sender] == false);
        // lightEmUp[msg.sender] = true;
        emit OnIntent(msg.sender);
    }

    function confirmOn() public {
        isOn = true;
        emit ConfirmOn(msg.sender);
    }

    function getLightState() public view returns (bool) {
        return isOn;
    }
}
