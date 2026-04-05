// scripts/deploy.js
// Run with: npx hardhat run scripts/deploy.js --network localhost

import pkg from "hardhat";
const { ethers } = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── ESM Workaround for __dirname ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║       CertifyChain — Deployment Script               ║");
  console.log("║       Bowen University Certificate System            ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  // ── Get deployer account ──
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployer address :", deployer.address);

  const balanceBigInt = await ethers.provider.getBalance(deployer.address);
  const balance = ethers.formatEther(balanceBigInt);
  console.log("💰 Deployer balance :", balance, "ETH\n");

  // ── Deploy contract ──
  console.log("⏳ Deploying CertifyChain...");
  const startTime = Date.now();

  const CertifyChain = await ethers.getContractFactory("CertifyChain");
  const contract = await CertifyChain.deploy();
  await contract.waitForDeployment();

  const deployTime = ((Date.now() - startTime) / 1000).toFixed(2);
  const address = await contract.getAddress();

  // ── Read deployment transaction for gas info ──
  const deployTx = contract.deploymentTransaction();
  const deployReceipt = await deployTx.wait();

  console.log("✅ Contract deployed successfully!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 Contract Address :", address);
  console.log("🔗 Transaction Hash :", deployReceipt.hash);
  console.log(
    "⛽ Gas Used         :",
    deployReceipt.gasUsed.toString(),
    "units",
  );
  console.log("⏱  Deploy Time      :", deployTime, "seconds");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // ── Verify first admin code was set ──
  const firstCode = await contract.currentAdminCode();
  console.log("🔑 Initial Admin Code :", firstCode);
  console.log("👤 First Admin        :", deployer.address);
  console.log(
    "🔑 Deployer is admin  :",
    await contract.isAdmin(deployer.address),
  );
  console.log("");

  // ── Save contract address + ABI to a JSON file ──
  // This file is imported by your HTML frontend files
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "CertifyChain.sol",
    "CertifyChain.json",
  );

  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  }

  const deploymentInfo = {
    network: "localhost",
    chainId: 31337,
    contractAddress: address,
    deployerAddress: deployer.address,
    transactionHash: deployReceipt.hash,
    gasUsed: deployReceipt.gasUsed.toString(),
    deployedAt: new Date().toISOString(),
    initialAdminCode: firstCode,
    abi: abi,
  };

  // Save to project root so frontend can read it
  const outPath = path.join(__dirname, "..", "deployment.json");
  fs.writeFileSync(outPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("💾 Deployment info saved to: deployment.json");
  console.log("\n📌 NEXT STEP — paste this address into your HTML files:");
  console.log(`   const CONTRACT_ADDRESS = "${address}";\n`);
  console.log("   Files to update:");
  console.log("   → role.js");
  console.log("   → Admin-login.html");
  console.log("   → Admin-signup.html");
  console.log("   → Admin-dashboard.html");
  console.log("   → verify.html");
  console.log("\n✨ Deployment complete.\n");
}

main().catch((error) => {
  console.error("\n❌ Deployment failed:", error);
  process.exitCode = 1;
});
