import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { IUniswapV2Pair__factory } from "uniswap-v2-deploy-plugin";

import { toWei } from "../../../../utils/format";

export default function shouldBehaveLikeAddLiquidity(): void {
  context("when token0 and token1 are used to add liquidity", function () {
    it("retrieves correct paid balanceOf", async function () {
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
      await this.contracts.uniswapV2.router.connect(this.signers.signer).addLiquidity(
        this.contracts.uniswapV2.token0.address,
        this.contracts.uniswapV2.token1.address,
        toWei("10"),
        toWei("10"),
        0,
        0,
        this.signers.signer.address,
        (await time.latest()) + 1000 // deadline
      );

      const pair = IUniswapV2Pair__factory.connect(
        await this.contracts.uniswapV2.factory.getPair(
          this.contracts.uniswapV2.token0.address,
          this.contracts.uniswapV2.token1.address
        ),
        this.signers.signer
      );

      expect(await this.contracts.uniswapV2.token0.balanceOf(pair.address)).to.equal(toWei("10"));
      expect(await this.contracts.uniswapV2.token1.balanceOf(pair.address)).to.equal(toWei("10"));

      expect(await pair.balanceOf(this.signers.signer.address)).to.equal(toWei("10").sub("1000"));
    });
  });
}
