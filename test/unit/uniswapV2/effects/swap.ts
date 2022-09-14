import { expect } from "chai";

import { MAX_UINT256 } from "../../../../utils/constants";
import { toWei } from "../../../../utils/format";

export default function shouldBehaveLikeSwap(): void {
  context("when token0 and token1 are swapped", function () {
    beforeEach(async function () {
      // approve token0 and token1
      await this.contracts.uniswapV2.token0.approve(
        this.contracts.uniswapV2.router.address,
        toWei("100")
      );
      await this.contracts.uniswapV2.token1.approve(
        this.contracts.uniswapV2.router.address,
        toWei("100")
      );

      // call addLiquidity from router
      await this.contracts.uniswapV2.router.addLiquidity(
        this.contracts.uniswapV2.token0.address,
        this.contracts.uniswapV2.token1.address,
        toWei("10"),
        toWei("10"),
        0,
        0,
        this.signers.signer.address,
        MAX_UINT256 // deadline
      );
    });

    it("retrieves correct token balances", async function () {
      await this.contracts.uniswapV2.router.swapExactTokensForTokens(
        toWei("1"),
        0,
        [this.contracts.uniswapV2.token0.address, this.contracts.uniswapV2.token1.address],
        this.signers.signer.address,
        MAX_UINT256 // deadline
      );

      expect(await this.contracts.uniswapV2.token0.balanceOf(this.signers.signer.address)).to.equal(
        toWei("989")
      );
      expect(await this.contracts.uniswapV2.token1.balanceOf(this.signers.signer.address)).to.equal(
        toWei("990.906610893880149131")
      );
      // "990906610893880149131"
    });
  });
}
