// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { Test } from "forge-std/Test.sol";

abstract contract BaseTest is Test {
    /// STRUCTS ///
    struct Users {
        address payable signer;
        address payable user;
    }

    /// TESTING VARIABLES ///

    Users internal users;

    /// SETUP FUNCTION ///

    /// @dev A setup function invoked before each test case.
    function setUp() public virtual {
        // Create a few users for testing. Order matters.
        users = Users({ signer: mkaddr("signer"), user: mkaddr("user") });

        // Fund the users.
        fundUser(users.signer);
        fundUser(users.user);

        // Sets all subsequent calls' `msg.sender` to be signer.
        vm.startPrank(users.signer);
    }

    /// INTERNAL CONSTANT FUNCTIONS ///

    /// @dev Helper function that multiplies the `amount` by `10^decimals` and returns a `uint256.`
    function toWei(uint256 amount, uint256 decimals) internal pure returns (uint256 result) {
        result = amount * 10**decimals;
    }

    function toWei(uint256 amount) internal pure returns (uint256 result) {
        result = toWei(amount, 18);
    }

    /// INTERNAL NON-CONSTANT FUNCTIONS ///

    /// @dev Give each user 100 ETH
    function fundUser(address payable user) internal {
        vm.deal(user, 100 ether);
    }

    /// @dev Generates an address by hashing the name and labels the address.
    function mkaddr(string memory name) internal returns (address payable addr) {
        addr = payable(address(uint160(uint256(keccak256(abi.encodePacked(name))))));
        vm.label(addr, name);
    }
}
