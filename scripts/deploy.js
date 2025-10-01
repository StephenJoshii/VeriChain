import hre from "hardhat";

async function main() {
  console.log("Deploying DigitalAsset contract...");
  const DigitalAsset = await hre.ethers.getContractFactory("DigitalAsset");
  const digitalAsset = await DigitalAsset.deploy();
  await digitalAsset.waitForDeployment();
  console.log(`✅ DigitalAsset contract deployed to: ${digitalAsset.target}`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });