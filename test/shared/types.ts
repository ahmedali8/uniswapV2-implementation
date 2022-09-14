import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { UniswapV2Factory } from "../../src/types/UniswapV2Factory";
import type { UniswapV2Router02 } from "../../src/types/UniswapV2Router02";
import type { WETH9 } from "../../src/types/WETH9";
import type { Token } from "../../src/types/contracts/Token";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    contracts: Contracts;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface UniswapV2 {
  router: UniswapV2Router02;
  factory: UniswapV2Factory;
  weth9: WETH9;
  token0: Token;
  token1: Token;
}

export interface Contracts {
  token: Token;
  uniswapV2: UniswapV2;
}

export interface Signers {
  signer: SignerWithAddress;
  user: SignerWithAddress;
}
