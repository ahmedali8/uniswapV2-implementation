import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

import type { Token } from "../../../src/types/contracts/Token";
import type { Token__factory } from "../../../src/types/factories/contracts/Token__factory";
import { TOKEN_NAME, TOKEN_SYMBOL, TOTAL_SUPPLY } from "../../shared/constants";

export async function tokenFixture(): Promise<{ token: Token }> {
  const signers = await ethers.getSigners();
  const signer: SignerWithAddress = signers[0];

  const tokenFactory: Token__factory = <Token__factory>await ethers.getContractFactory("Token");
  const token: Token = <Token>(
    await tokenFactory
      .connect(signer)
      .deploy(TOKEN_NAME, TOKEN_SYMBOL, TOTAL_SUPPLY, signer.address)
  );

  return { token };
}
