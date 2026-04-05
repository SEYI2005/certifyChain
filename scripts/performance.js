// scripts/performance.js
// Measures TPS (Transactions Per Second) and Throughput
// as specified in the project methodology (Chapter 3, Section 3.1.iii)
//
// Run with: npx hardhat run scripts/performance.js --network localhost

import pkg from "hardhat";
const { ethers } = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── ESM Workaround for __dirname ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Test configuration ──
const BATCH_SIZES = [10, 50, 100]; // Number of certs to issue in each test run
const CERT_BASE_ID = "PERF-CS-2026"; // Base ID — appended with index per cert

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║   CertifyChain — Performance Evaluation                  ║");
  console.log("║   Metrics: TPS (Speed) · Throughput (Scalability)        ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  const [deployer] = await ethers.getSigners();

  // ── Deploy a fresh contract for testing ──
  console.log("⏳ Deploying fresh CertifyChain for performance tests...");
  const Factory = await ethers.getContractFactory("CertifyChain");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log(`✅ Deployed at: ${address}\n`);

  const results = [];

  // ════════════════════════════════════════════════════════
  //  TEST 1 — DEPLOYMENT COST
  // ════════════════════════════════════════════════════════
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 TEST 1: Contract Deployment Cost");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const deployTx = contract.deploymentTransaction();
  const deployReceipt = await deployTx.wait();

  console.log(
    `   Gas Used       : ${deployReceipt.gasUsed.toLocaleString()} units`,
  );
  console.log(`   Block Number   : ${deployReceipt.blockNumber}`);
  console.log("");

  // ════════════════════════════════════════════════════════
  //  TEST 2 — SINGLE TRANSACTION LATENCY (Speed)
  // ════════════════════════════════════════════════════════
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 TEST 2: Single Transaction Latency");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const singleStart = Date.now();

  const singleTx = await contract.issueCertificate(
    "BOWEN-LATENCY-TEST-001",
    "Test Student",
    "B.Sc Computer Science",
    "Bowen University",
    "2026",
    "abc123singlehash",
  );
  const singleReceipt = await singleTx.wait();
  const singleEnd = Date.now();
  const singleLatency = singleEnd - singleStart;

  console.log(`   Latency        : ${singleLatency} ms`);
  console.log(
    `   Gas Used       : ${singleReceipt.gasUsed.toLocaleString()} units`,
  );
  console.log(`   Block Number   : ${singleReceipt.blockNumber}`);
  console.log("");

  // ════════════════════════════════════════════════════════
  //  TEST 3 — TPS (Transactions Per Second) — Speed metric
  // ════════════════════════════════════════════════════════
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 TEST 3: TPS — Transactions Per Second (Speed)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  for (const batchSize of BATCH_SIZES) {
    console.log(`\n   📦 Batch size: ${batchSize} transactions`);

    const txStartTime = Date.now();
    let totalGasUsed = 0n;

    for (let i = 0; i < batchSize; i++) {
      const certID = `${CERT_BASE_ID}-TPS-${batchSize}-${i}`;
      const tx = await contract.issueCertificate(
        certID,
        `Student ${i}`,
        "B.Sc Computer Science",
        "Bowen University",
        "2026",
        `hash${i}`,
      );
      const receipt = await tx.wait();
      totalGasUsed += receipt.gasUsed;
    }

    const txEndTime = Date.now();
    const elapsedSec = (txEndTime - txStartTime) / 1000;
    const tps = (batchSize / elapsedSec).toFixed(2);
    const avgGas = (totalGasUsed / BigInt(batchSize)).toString();
    const avgLatencyMs = ((elapsedSec * 1000) / batchSize).toFixed(1);

    console.log(`   ✅ Completed in   : ${elapsedSec.toFixed(2)} seconds`);
    console.log(`   ⚡ TPS             : ${tps} tx/sec`);
    console.log(`   ⏱  Avg Latency    : ${avgLatencyMs} ms/tx`);
    console.log(
      `   ⛽ Avg Gas/tx      : ${Number(avgGas).toLocaleString()} units`,
    );
    console.log(
      `   ⛽ Total Gas Used  : ${totalGasUsed.toLocaleString()} units`,
    );

    results.push({
      test: "TPS",
      batchSize,
      elapsedSec: parseFloat(elapsedSec.toFixed(2)),
      tps: parseFloat(tps),
      avgLatencyMs: parseFloat(avgLatencyMs),
      avgGasPerTx: Number(avgGas),
      totalGasUsed: totalGasUsed.toString(),
    });
  }

  // ════════════════════════════════════════════════════════
  //  TEST 4 — THROUGHPUT (Scalability metric)
  // ════════════════════════════════════════════════════════
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 TEST 4: Throughput — Scalability Under Concurrent Load");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  for (const batchSize of BATCH_SIZES) {
    console.log(`\n   📦 Batch size: ${batchSize} concurrent transactions`);

    const tpStartTime = Date.now();

    const txPromises = [];
    for (let i = 0; i < batchSize; i++) {
      const certID = `${CERT_BASE_ID}-THROUGHPUT-${batchSize}-${i}`;
      txPromises.push(
        contract
          .issueCertificate(
            certID,
            `Student TP${i}`,
            "B.Sc Computer Science",
            "Bowen University",
            "2026",
            `hashTP${i}`,
          )
          .then((tx) => tx.wait()),
      );
    }

    const receipts = await Promise.all(txPromises);
    const tpEndTime = Date.now();
    const elapsedSec = (tpEndTime - tpStartTime) / 1000;
    const throughput = (batchSize / elapsedSec).toFixed(2);
    const totalGas = receipts.reduce((sum, r) => sum + r.gasUsed, 0n);

    console.log(`   ✅ Completed in   : ${elapsedSec.toFixed(2)} seconds`);
    console.log(`   📈 Throughput      : ${throughput} tx/sec`);
    console.log(`   ⛽ Total Gas Used  : ${totalGas.toLocaleString()} units`);

    results.push({
      test: "Throughput",
      batchSize,
      elapsedSec: parseFloat(elapsedSec.toFixed(2)),
      throughput: parseFloat(throughput),
      totalGasUsed: totalGas.toString(),
    });
  }

  // ════════════════════════════════════════════════════════
  //  TEST 5 — VERIFICATION SPEED (Read-only call)
  // ════════════════════════════════════════════════════════
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 TEST 5: Certificate Verification Speed (Read-Only)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const VERIFY_RUNS = 100;
  const verifyStart = Date.now();

  for (let i = 0; i < VERIFY_RUNS; i++) {
    await contract.verifyCertificate("BOWEN-LATENCY-TEST-001");
  }

  const verifyEnd = Date.now();
  const verifyElapsed = (verifyEnd - verifyStart) / 1000;
  const verifyTPS = (VERIFY_RUNS / verifyElapsed).toFixed(2);
  const avgVerifyMs = ((verifyElapsed * 1000) / VERIFY_RUNS).toFixed(2);

  console.log(
    `   ✅ ${VERIFY_RUNS} verifications in : ${verifyElapsed.toFixed(
      2,
    )} seconds`,
  );
  console.log(`   ⚡ Verification TPS : ${verifyTPS} calls/sec`);
  console.log(`   ⏱  Avg Time/verify  : ${avgVerifyMs} ms`);
  console.log(`   ⛽ Gas Cost          : 0 (view function — FREE)`);

  results.push({
    test: "VerificationSpeed",
    runs: VERIFY_RUNS,
    elapsedSec: parseFloat(verifyElapsed.toFixed(2)),
    callsPerSec: parseFloat(verifyTPS),
    avgMs: parseFloat(avgVerifyMs),
    gasCost: 0,
  });

  // ════════════════════════════════════════════════════════
  //  SUMMARY TABLE
  // ════════════════════════════════════════════════════════
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║                  PERFORMANCE SUMMARY                     ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║  Metric          │ Batch  │ Result                       ║");
  console.log("╠══════════════════════════════════════════════════════════╣");

  results.forEach((r) => {
    if (r.test === "TPS") {
      const row = `TPS (issueCert)    │ ${String(r.batchSize).padEnd(6)} │ ${
        r.tps
      } tx/sec`;
      console.log(`║  ${row.padEnd(56)} ║`);
    }
    if (r.test === "Throughput") {
      const row = `Throughput         │ ${String(r.batchSize).padEnd(6)} │ ${
        r.throughput
      } tx/sec`;
      console.log(`║  ${row.padEnd(56)} ║`);
    }
  });

  const verResult = results.find((r) => r.test === "VerificationSpeed");
  if (verResult) {
    const row = `Verification Speed │ ${String(verResult.runs).padEnd(6)} │ ${
      verResult.callsPerSec
    } calls/sec`;
    console.log(`║  ${row.padEnd(56)} ║`);
  }

  console.log("╚══════════════════════════════════════════════════════════╝\n");

  // ════════════════════════════════════════════════════════
  //  SAVE RESULTS TO JSON
  // ════════════════════════════════════════════════════════
  const reportPath = path.join(__dirname, "..", "performance-report.json");
  const report = {
    system: "CertifyChain — Bowen University",
    network: "Hardhat Local (localhost:8545)",
    chainId: 31337,
    runAt: new Date().toISOString(),
    singleTxLatencyMs: singleLatency,
    results,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`💾 Full report saved to: performance-report.json`);
  console.log("   Use this data in Chapter 4 of your project write-up.\n");
}

main().catch((error) => {
  console.error("\n❌ Performance test failed:", error);
  process.exitCode = 1;
});
