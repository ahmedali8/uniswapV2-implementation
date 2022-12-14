import { expect } from "chai";

export default function shouldBehaveLikeSymbolGetter(): void {
  it("retrieves the symbol", async function () {
    const symbol: string = await this.contracts.token.symbol();
    expect(symbol).to.equal("TST");
  });
}
