const hre = require("hardhat");

async function main() {
  const MakeNFT = await hre.ethers.getContractFactory("MakeNFT");
  const makeNFT = await MakeNFT.deploy();

  await makeNFT.deployed();

  console.log(
    `MakeNFT deployed to ${makeNFT.address}`
  );
  //0x0A398Ac5A8625d635B0BE050B2b030F84480577a
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
