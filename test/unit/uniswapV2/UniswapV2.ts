import { shouldBehaveLikeUniswapV2 } from "./UniswapV2.behavior";
import { uniswapV2Fixture } from "./UniswapV2.fixture";

export function testUniswapV2(): void {
  describe("Uniswap", function () {
    beforeEach(async function () {
      const { router, factory, weth9, token0, token1 } = await this.loadFixture(uniswapV2Fixture);
      this.contracts.uniswapV2 = { router, factory, weth9, token0, token1 };
    });

    shouldBehaveLikeUniswapV2();
  });
}
