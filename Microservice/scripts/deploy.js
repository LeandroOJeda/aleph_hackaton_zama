import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  console.log("Deploying VehicleInfoRegistry contract...");

  // Get provider and signer
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  console.log("Deploying contracts with the account:", await signer.getAddress());
  console.log("Account balance:", ethers.formatEther(await provider.getBalance(await signer.getAddress())), "ETH");

  // Get contract factory from artifacts
  const contractArtifact = await hre.artifacts.readArtifact("VehicleInfoRegistry");
  const contractFactory = new ethers.ContractFactory(
    contractArtifact.abi,
    contractArtifact.bytecode,
    signer
  );

  // Deploy the contract
  const VehicleInfoRegistry = contractFactory;
  const vehicleInfoRegistry = await VehicleInfoRegistry.deploy();

  await vehicleInfoRegistry.waitForDeployment();

  console.log("VehicleInfoRegistry deployed to:", await vehicleInfoRegistry.getAddress());
  console.log("Transaction hash:", vehicleInfoRegistry.deploymentTransaction().hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });