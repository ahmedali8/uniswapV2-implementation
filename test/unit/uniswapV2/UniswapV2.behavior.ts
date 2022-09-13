import shouldBehaveLikeAddLiquidity from "./effects/addLiquidity";

export function shouldBehaveLikeUniswapV2(): void {
  describe("View Functions", function () {
    //
  });

  describe("Effects Functions", function () {
    describe("#addLiquidity", function () {
      shouldBehaveLikeAddLiquidity();
    });
  });
}
