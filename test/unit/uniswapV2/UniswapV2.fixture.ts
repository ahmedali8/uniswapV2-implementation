import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { UniswapV2Deployer } from "uniswap-v2-deploy-plugin";

import { UniswapV2Factory } from "../../../src/types/UniswapV2Factory";
import { UniswapV2Router02 } from "../../../src/types/UniswapV2Router02";
import { WETH9 } from "../../../src/types/WETH9";
import type { Token } from "../../../src/types/contracts/Token";
import type { Token__factory } from "../../../src/types/factories/contracts/Token__factory";
import { toWei } from "../../../utils/format";

export async function uniswapV2Fixture(): Promise<{
  router: UniswapV2Router02;
  factory: UniswapV2Factory;
  weth9: WETH9;
  token0: Token;
  token1: Token;
}> {
  const signers = await ethers.getSigners();
  const signer: SignerWithAddress = signers[0];

  const { router, factory, weth9 } = await UniswapV2Deployer.deploy(signer);

  const tokenFactory: Token__factory = <Token__factory>await ethers.getContractFactory("Token");
  const token0: Token = <Token>(
    await tokenFactory.connect(signer).deploy("Token0", "TKN0", toWei("1000"), signer.address)
  );
  const token1: Token = <Token>(
    await tokenFactory.connect(signer).deploy("Token0", "TKN0", toWei("1000"), signer.address)
  );

  return { router, factory, weth9: weth9 as WETH9, token0, token1 };
}
