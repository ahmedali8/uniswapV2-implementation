#!/usr/bin/env bash

mv ./sol_test/BaseTest.t.sol ./sol_test/BaseTest.t.soll
mv ./sol_test/uniswapV2/UniswapV2Test.t.sol ./sol_test/uniswapV2/UniswapV2Test.t.soll
mv ./sol_test/uniswapV2/add-liquidity/addLiquidity.t.sol ./sol_test/uniswapV2/add-liquidity/addLiquidity.t.soll

FOUNDRY_PROFILE=0_5_x forge build
FOUNDRY_PROFILE=0_6_x forge build

mv ./sol_test/BaseTest.t.soll ./sol_test/BaseTest.t.sol
mv ./sol_test/uniswapV2/UniswapV2Test.t.soll ./sol_test/uniswapV2/UniswapV2Test.t.sol
mv ./sol_test/uniswapV2/add-liquidity/addLiquidity.t.soll ./sol_test/uniswapV2/add-liquidity/addLiquidity.t.sol

forge test -vvvvv
