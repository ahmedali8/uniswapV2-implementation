// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { UniswapV2Test } from "../UniswapV2Test.t.sol";
// import { UniswapV2Pair } from "@uniswap/v2-core/contracts/UniswapV2Pair.sol";
import { IUniswapV2Pair } from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "forge-std/console2.sol";

contract UniswapV2__AddLiquidity is UniswapV2Test {
    /// @dev it should return correct balances
    function testAddLiquidity() external {
        emit log_named_address("weth9", address(weth9));
        emit log_named_address("factory", address(factory));
        emit log_named_address("router", address(router));
        emit log_named_address("token0", address(token0));
        emit log_named_address("token1", address(token1));

        // approve token0 and token1
        token0.approve(address(router), toWei(100));
        token1.approve(address(router), toWei(100));

        emit log_named_address("signer", users.signer);
        emit log_named_address("msg.sender", msg.sender);

        // call addLiquidity from router
        // vm.stopPrank();
        // vm.prank(users.signer);
        // (uint256 amount0, uint256 amount1, uint256 liquidity) =
        router.addLiquidity(
            address(token0),
            address(token1),
            toWei(10),
            toWei(10),
            1,
            1,
            users.signer,
            block.timestamp + 100000 // deadline
        );

        // assertEq(amount0, toWei(10));
        // assertEq(amount1, toWei(10));
        // assertEq(liquidity, toWei(10) - 1000);

        address pair = factory.getPair(address(token0), address(token1));

        assertEq(token0.balanceOf(address(pair)), toWei(10));
        assertEq(token1.balanceOf(address(pair)), toWei(10));
        assertEq(IUniswapV2Pair(pair).balanceOf(users.signer), toWei(10) - 1000);
    }
}
