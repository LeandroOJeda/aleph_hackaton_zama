import hre from "hardhat";
import { ethers } from "ethers";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

async function main() {
  console.log("Deploying TransactionRegistry contract to Sepolia...");

  // Get provider and signer for Sepolia
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
  console.log("Deploying contracts with the account:", await signer.getAddress());
  console.log("Account balance:", ethers.formatEther(await provider.getBalance(await signer.getAddress())), "ETH");

  // Get contract factory from artifacts
  const contractArtifact = await hre.artifacts.readArtifact("TransactionRegistry");
  const contractFactory = new ethers.ContractFactory(
    contractArtifact.abi,
    contractArtifact.bytecode,
    signer
  );

  // Deploy the contract with higher gas limit for FHEVM
  const gasLimit = 5000000; // 5M gas limit
  const transactionRegistry = await contractFactory.deploy({
    gasLimit: gasLimit
  });

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