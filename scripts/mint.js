import hre from "hardhat";

async function main() {
  const contractAddress = "0x3b3B89a9607830714cDdc549178825C13e255e3A";
  const digitalAsset = await hre.ethers.getContractAt("DigitalAsset", contractAddress);

  // This gets your wallet address from the .env file to use as the recipient.
  const [owner] = await hre.ethers.getSigners();
  const recipientAddress = owner.address;

  // This is the metadata for your asset. For now, it's just a placeholder.
  const metadataURI = "ipfs://bafkreihdwdcefgh4dqkjvmpj";

  console.log(`Minting a new token for ${recipientAddress}...`);

  const tx = await digitalAsset.safeMint(recipientAddress, metadataURI);
  await tx.wait(); // Wait for the transaction to be confirmed on the blockchain

  console.log(`✅ Token minted successfully!`);
  console.log(`Transaction Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});