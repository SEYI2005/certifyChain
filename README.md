# CertifyChain - Bowen University Certificate Verification System

Blockchain-based certificate verification with admin RBAC + rotating auth codes.

## 🚀 Quick Start

1. **Start blockchain node** (keep this terminal open):

   ```bash
   npx hardhat node
   ```

2. **Deploy contract** (new terminal):

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Run tests**:

   ```bash
   npx hardhat test
   ```

4. **Performance tests**:

   ```bash
   npx hardhat run scripts/performance.js --network localhost
   ```

5. **Frontend** (open in browser):
   - Connect MetaMask → switch to `Localhost 8545`
   - `role.html` → auto-redirects admin/non-admin

## 📋 Contract Address

`deployment.json` (auto-generated):

```
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## 🛠️ Troubleshooting "Blockchain Errors"

**❌ "RPC Error" / "Network Error"**

```
1. Terminal 1: npx hardhat node  ← START THIS FIRST
2. MetaMask: Add Network → Localhost 8545 (chainId 31337)
3. Refresh page
```

**❌ "Contract Not Found"**

```
npx hardhat run scripts/deploy.js --network localhost
```

**❌ Tests Fail**

```
npm install
npx hardhat compile
npx hardhat test
```

## 📊 Performance Results

See `performance-report.json`, `gas-report.txt`

## 🧪 Full Test Flow

1. Deploy → Copy initial code `NUC-AUTH-001`
2. Admin-login.html → Use code to register 2nd admin (code rotates)
3. Admin-dashboard.html → Issue certificates
4. verify.html → Public verification

## Scripts

```bash
npm run compile    # npx hardhat compile
npm run test       # npx hardhat test
npm run deploy     # Deploy to localhost
npm run node       # Start blockchain
npm run performance # TPS/Throughput tests
npm run clean      # npx hardhat clean
```
