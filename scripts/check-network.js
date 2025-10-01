import hre from "hardhat";

async function main() {
  console.log("--- Network Diagnostic ---");
  console.log(`Connected to network: ${hre.network.name}`);
  console.log(`Chain ID: ${hre.network.config.chainId}`);
  console.log(`RPC URL: ${hre.network.config.url}`); // <-- Added this line
  console.log("--------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});