import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  console.log("Deploying TransactionRegistry contract...");

  // Get provider and signer
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  console.log("Deploying contracts with the account:", await signer.getAddress());
  console.log("Account balance:", ethers.formatEther(await provider.getBalance(await signer.getAddress())), "ETH");

  // Get contract factory from artifacts
  const contractArtifact = await hre.artifacts.readArtifact("TransactionRegistry");
  const contractFactory = new ethers.ContractFactory(
    contractArtifact.abi,
    contractArtifact.bytecode,
    signer
  );

  // Deploy the contract
  const TransactionRegistry = contractFactory;
  const transactionRegistry = await TransactionRegistry.deploy();

  await transactionRegistry.waitForDeployment();

  console.log("TransactionRegistry deployed to:", await transactionRegistry.getAddress());
  console.log("Transaction hash:", transactionRegistry.deploymentTransaction().hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });