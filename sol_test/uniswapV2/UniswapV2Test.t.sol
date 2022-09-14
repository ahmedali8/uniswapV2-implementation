// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { BaseTest } from "../BaseTest.t.sol";
import { Token } from "contracts/Token.sol";
import "forge-std/console2.sol";

// not working as foundry doesnot support multiple versions at once (workaround done below)
// import { WETH9 } from "@uniswap/v2-periphery/contracts/test/WETH9.sol";
// import { UniswapV2Factory } from "@uniswap/v2-core/contracts/UniswapV2Factory.sol";
// import { UniswapV2Router02 } from "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";

import { IERC20 } from "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import { IUniswapV2Factory } from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
// import { IUniswapV2Router02 } from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Router02 } from "contracts/interfaces/IUniswapV2RouterV2.sol";

contract UniswapV2Test is BaseTest {
    /// TESTING VARIABLES ///
    IERC20 internal weth9;
    IUniswapV2Factory internal factory;
    IUniswapV2Router02 internal router;
    Token internal token0;
    Token internal token1;

    /// SETUP FUNCTION ///
    /// @dev A setup function invoked before each test case.
    function setUp() public virtual override {
        super.setUp();

        /// deploy uniswapV2's weth9, factory, router ///

        // not working as foundry doesnot support multiple versions at once (workaround done below)
        // WETH9 weth9 = new WETH9();
        // UniswapV2Factory factory = new UniswapV2Factory(address(0)); // _feeToSetter=address(0)
        // UniswapV2Router02 router = new UniswapV2Router02(address(factory), address(weth9));

        weth9 = IERC20(deployCode("./out_0_6_x/WETH9.sol/WETH9.json"));
        factory = IUniswapV2Factory(
            deployCode(
                "./out_0_5_x/UniswapV2Factory.sol/UniswapV2Factory.json",
                abi.encode(address(0))
            )
        );
        router = IUniswapV2Router02(
            deployCode(
                "./out_0_6_x/UniswapV2Router02.sol/UniswapV2Router02.json",
                abi.encode(address(factory), address(weth9))
            )
        );

        /// deploy token0 and token1 ///
        token0 = new Token("Token0", "TKN0", toWei(1000), address(users.signer));
        token1 = new Token("Token1", "TKN1", toWei(1000), address(users.signer));
    }

    // function testDeployWeth() public {
    //     emit log_named_address("weth9", address(weth9));
    //     emit log_named_address("factory", address(factory));
    //     emit log_named_address("router", address(router));
    //     emit log_named_address("token0", address(token0));
    //     emit log_named_address("token1", address(token1));
    // }
}
