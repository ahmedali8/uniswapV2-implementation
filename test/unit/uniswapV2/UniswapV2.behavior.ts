import shouldBehaveLikeAddLiquidity from "./effects/addLiquidity";
import shouldBehaveLikeSwap from "./effects/swap";

export function shouldBehaveLikeUniswapV2(): void {
  describe("View Functions", function () {
    //
  });

  describe("Effects Functions", function () {
    describe("#addLiquidity", function () {
      shouldBehaveLikeAddLiquidity();
    });
    describe("#swap", function () {
      shouldBehaveLikeSwap();
    });
  });
}
