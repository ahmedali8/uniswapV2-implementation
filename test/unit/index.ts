import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

import type { Contracts, Signers } from "../shared/types";
import { testToken } from "./token/Token";
import { testUniswapV2 } from "./uniswapV2/UniswapV2";

describe("Unit tests", () => {
  before(async function () {
    this.signers = {} as Signers;
    this.contracts = {} as Contracts;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.signer = signers[0];
    this.signers.user = signers[1];

    this.loadFixture = loadFixture;
  });

  testToken();
  testUniswapV2();
});
