import hre from "hardhat";

async function main() {
  // Use the address of your deployed contract
  const contractAddress = "0x3b3B89a9607830714cDdc549178825C13e255e3A";
  const digitalAsset = await hre.ethers.getContractAt("DigitalAsset", contractAddress);

  const tokenId = 0; // We are checking the owner of the first token (ID 0)

  console.log(`Checking the owner of token ID ${tokenId}...`);

  const ownerAddress = await digitalAsset.ownerOf(tokenId);

  console.log(`✅ Owner of token ID ${tokenId} is: ${ownerAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});