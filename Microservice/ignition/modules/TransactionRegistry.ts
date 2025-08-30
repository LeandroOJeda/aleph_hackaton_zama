import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TransactionRegistryModule", (m) => {
  const transactionRegistry = m.contract("TransactionRegistry");

  return { transactionRegistry };
});
