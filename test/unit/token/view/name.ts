import { expect } from "chai";

export default function shouldBehaveLikeNameGetter(): void {
  it("retrieves the name", async function () {
    const name: string = await this.contracts.token.name();
    expect(name).to.equal("TEST_TOKEN");
  });
}
