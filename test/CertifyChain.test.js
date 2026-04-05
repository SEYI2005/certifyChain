// test/CertifyChain.test.js
// Run with: npx hardhat test
import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("CertifyChain — Unit Tests", function () {
  let contract;
  let owner, admin2, admin3, stranger;

  // ── Deploy a fresh contract before every test group ──
  beforeEach(async function () {
    [owner, admin2, admin3, stranger] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("CertifyChain");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  // ════════════════════════════════════════════════
  //  GROUP 1 — Deployment & Initial State
  // ════════════════════════════════════════════════
  describe("Deployment", function () {
    it("should set the deployer as the owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should whitelist the deployer as an admin", async function () {
      expect(await contract.isAdmin(owner.address)).to.equal(true);
    });

    it("should set the initial admin code to NUC-AUTH-001", async function () {
      expect(await contract.currentAdminCode()).to.equal("NUC-AUTH-001");
    });

    it("should set adminCount to 1 after deployment", async function () {
      expect(await contract.adminCount()).to.equal(1n);
    });

    it("should record the deployer join code", async function () {
      expect(await contract.adminJoinCode(owner.address)).to.equal(
        "NUC-AUTH-001",
      );
    });
  });

  // ════════════════════════════════════════════════
  //  GROUP 2 — Admin Registration (Invite System)
  // ════════════════════════════════════════════════
  describe("Admin Registration", function () {
    it("should allow a new wallet to register with the correct code", async function () {
      const currentCode = await contract.currentAdminCode();
      await contract.connect(admin2).registerAdmin(currentCode);
      expect(await contract.isAdmin(admin2.address)).to.equal(true);
    });

    it("should rotate the global code after a new admin registers", async function () {
      const oldCode = await contract.currentAdminCode(); // NUC-AUTH-001
      await contract.connect(admin2).registerAdmin(oldCode);
      const newCode = await contract.currentAdminCode(); // NUC-AUTH-2
      expect(newCode).to.not.equal(oldCode);
      expect(newCode).to.equal("NUC-AUTH-2");
    });

    it("should increment adminCount after each registration", async function () {
      const code1 = await contract.currentAdminCode();
      await contract.connect(admin2).registerAdmin(code1);
      expect(await contract.adminCount()).to.equal(2n);

      const code2 = await contract.currentAdminCode();
      await contract.connect(admin3).registerAdmin(code2);
      expect(await contract.adminCount()).to.equal(3n);
    });

    it("should assign the new admin their unique join code", async function () {
      const code1 = await contract.currentAdminCode();
      await contract.connect(admin2).registerAdmin(code1);
      expect(await contract.adminJoinCode(admin2.address)).to.equal(
        "NUC-AUTH-2",
      );
    });

    it("should make old code invalid after rotation", async function () {
      const oldCode = await contract.currentAdminCode();
      await contract.connect(admin2).registerAdmin(oldCode);

      // admin3 tries to use the OLD code — should fail
      await expect(
        contract.connect(admin3).registerAdmin(oldCode),
      ).to.be.revertedWith("Invalid verification code");
    });

    it("should reject registration with a completely wrong code", async function () {
      await expect(
        contract.connect(admin2).registerAdmin("FAKE-CODE-999"),
      ).to.be.revertedWith("Invalid verification code");
    });

    it("should reject re-registration of an existing admin", async function () {
      const code1 = await contract.currentAdminCode();
      await contract.connect(admin2).registerAdmin(code1);

      const code2 = await contract.currentAdminCode();
      // admin2 tries to register again with the new code
      await expect(
        contract.connect(admin2).registerAdmin(code2),
      ).to.be.revertedWith("You are already a registered admin");
    });

    it("should emit AdminAdded event with correct new code", async function () {
      const code = await contract.currentAdminCode();

      // Execute the transaction and wait for it to be mined
      const tx = await contract.connect(admin2).registerAdmin(code);
      const receipt = await tx.wait();

      // Pull the exact timestamp from the newly mined block
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx).to.emit(contract, "AdminAdded").withArgs(
        admin2.address,
        "NUC-AUTH-2",
        owner.address,
        block.timestamp, // <--- 100% accurate every time
      );
    });
  });

  // ════════════════════════════════════════════════
  //  GROUP 3 — Certificate Issuance
  // ════════════════════════════════════════════════
  describe("Certificate Issuance", function () {
    it("should allow admin to issue a certificate", async function () {
      await contract.issueCertificate(
        "BOWEN-CS-2026-0001",
        "Oluwaseyifunmi Alonge",
        "B.Sc Computer Science",
        "Bowen University",
        "2026",
        "abc123hash",
      );

      const result = await contract.verifyCertificate("BOWEN-CS-2026-0001");
      expect(result.studentName).to.equal("Oluwaseyifunmi Alonge");
      expect(result.isValid).to.equal(true);
    });

    it("should reject issuance from a non-admin wallet", async function () {
      await expect(
        contract
          .connect(stranger)
          .issueCertificate(
            "BOWEN-CS-2026-0002",
            "Fake Student",
            "B.Sc Computer Science",
            "Bowen University",
            "2026",
            "fakehash",
          ),
      ).to.be.revertedWith("Access Denied: Not an authorized admin");
    });

    it("should reject duplicate certificate IDs", async function () {
      await contract.issueCertificate(
        "BOWEN-CS-2026-0003",
        "Student A",
        "B.Sc CS",
        "Bowen University",
        "2026",
        "hash1",
      );

      await expect(
        contract.issueCertificate(
          "BOWEN-CS-2026-0003",
          "Student B",
          "B.Sc CS",
          "Bowen University",
          "2026",
          "hash2",
        ),
      ).to.be.revertedWith("Error: Certificate ID already exists");
    });

    it("should emit CertificateIssued event", async function () {
      const tx = await contract.issueCertificate(
        "BOWEN-CS-2026-0004",
        "Test Student",
        "B.Sc CS",
        "Bowen University",
        "2026",
        "hash",
      );
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(contract, "CertificateIssued")
        .withArgs("BOWEN-CS-2026-0004", "Test Student", block.timestamp);
    });
  });

  // ════════════════════════════════════════════════
  //  GROUP 4 — Certificate Revocation
  // ════════════════════════════════════════════════
  describe("Certificate Revocation", function () {
    beforeEach(async function () {
      // Issue a cert to work with in each test
      await contract.issueCertificate(
        "BOWEN-SE-2026-0001",
        "Grace Adesanya",
        "B.Sc Software Engineering",
        "Bowen University",
        "2026",
        "hashXYZ",
      );
    });

    it("should allow admin to revoke a valid certificate", async function () {
      await contract.revokeCertificate("BOWEN-SE-2026-0001");
      const result = await contract.verifyCertificate("BOWEN-SE-2026-0001");
      expect(result.isValid).to.equal(false);
    });

    it("should reject revocation from a non-admin", async function () {
      await expect(
        contract.connect(stranger).revokeCertificate("BOWEN-SE-2026-0001"),
      ).to.be.revertedWith("Access Denied: Not an authorized admin");
    });

    it("should reject revoking a non-existent certificate", async function () {
      await expect(
        contract.revokeCertificate("BOWEN-FAKE-9999"),
      ).to.be.revertedWith("Error: Certificate does not exist");
    });

    it("should reject revoking an already-revoked certificate", async function () {
      await contract.revokeCertificate("BOWEN-SE-2026-0001");
      await expect(
        contract.revokeCertificate("BOWEN-SE-2026-0001"),
      ).to.be.revertedWith("Error: Certificate is already revoked");
    });

    it("should emit CertificateRevoked event", async function () {
      const tx = await contract.revokeCertificate("BOWEN-SE-2026-0001");
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(contract, "CertificateRevoked")
        .withArgs("BOWEN-SE-2026-0001", block.timestamp);
    });
  });

  // ════════════════════════════════════════════════
  //  GROUP 5 — Public Verification
  // ════════════════════════════════════════════════
  describe("Certificate Verification", function () {
    it("should return correct details for a valid certificate", async function () {
      await contract.issueCertificate(
        "BOWEN-IT-2026-0001",
        "Chukwuemeka Obi",
        "B.Sc Information Technology",
        "Bowen University",
        "2026",
        "hash1",
      );

      const res = await contract.verifyCertificate("BOWEN-IT-2026-0001");
      expect(res.studentName).to.equal("Chukwuemeka Obi");
      expect(res.certificateType).to.equal("B.Sc Information Technology");
      expect(res.school).to.equal("Bowen University");
      expect(res.graduationDate).to.equal("2026");
      expect(res.isValid).to.equal(true);
    });

    it("should revert with error for a non-existent certificate ID", async function () {
      await expect(
        contract.verifyCertificate("BOWEN-INVALID-0000"),
      ).to.be.revertedWith("Error: Certificate not found on blockchain");
    });

    it("should be callable by anyone (public — no wallet required)", async function () {
      await contract.issueCertificate(
        "BOWEN-CS-2026-PUB",
        "Public Test",
        "B.Sc CS",
        "Bowen University",
        "2026",
        "hash",
      );

      // stranger (no admin) can still verify
      const res = await contract
        .connect(stranger)
        .verifyCertificate("BOWEN-CS-2026-PUB");
      expect(res.isValid).to.equal(true);
    });
  });

  // ════════════════════════════════════════════════
  //  GROUP 6 — Admin Management
  // ════════════════════════════════════════════════
  describe("Admin Management", function () {
    it("should allow owner to remove an admin", async function () {
      const code = await contract.currentAdminCode();
      await contract.connect(admin2).registerAdmin(code);
      expect(await contract.isAdmin(admin2.address)).to.equal(true);

      await contract.removeAdmin(admin2.address);
      expect(await contract.isAdmin(admin2.address)).to.equal(false);
    });

    it("should prevent non-owner from removing admins", async function () {
      await expect(
        contract.connect(stranger).removeAdmin(owner.address),
      ).to.be.revertedWith("Access Denied: Not the contract owner");
    });

    it("should prevent removing the owner", async function () {
      await expect(contract.removeAdmin(owner.address)).to.be.revertedWith(
        "Cannot remove the contract owner",
      );
    });
  });
});
