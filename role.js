// ============================================================
//  CONTRACT CONFIG
// ============================================================
const CONTRACT_ADDRESS = "0xD01DeE3c241DdbfE94C62CBeCf8fFB2060764383";

const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newAdminCode",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "schoolName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AdminAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "removedAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AdminRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "certificateID",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "studentName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "CertificateIssued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "certificateID",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "CertificateRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "nucCode",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "NucCodeAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_nucCode",
        type: "string",
      },
    ],
    name: "addValidNucCode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "adminCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "adminProfiles",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "email",
        type: "string",
      },
      {
        internalType: "string",
        name: "schoolName",
        type: "string",
      },
      {
        internalType: "string",
        name: "nucCode",
        type: "string",
      },
      {
        internalType: "string",
        name: "nucDocHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "joinCode",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "registeredAt",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "admins",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allCertificateIDs",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "certificates",
    outputs: [
      {
        internalType: "string",
        name: "certificateID",
        type: "string",
      },
      {
        internalType: "string",
        name: "studentName",
        type: "string",
      },
      {
        internalType: "string",
        name: "certificateType",
        type: "string",
      },
      {
        internalType: "string",
        name: "school",
        type: "string",
      },
      {
        internalType: "string",
        name: "graduationDate",
        type: "string",
      },
      {
        internalType: "string",
        name: "certificateHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isIssued",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentAdminCode",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "getAdminProfile",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "email",
        type: "string",
      },
      {
        internalType: "string",
        name: "schoolName",
        type: "string",
      },
      {
        internalType: "string",
        name: "nucCode",
        type: "string",
      },
      {
        internalType: "string",
        name: "nucDocHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "joinCode",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "registeredAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllIssuedCertificates",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "certificateID",
            type: "string",
          },
          {
            internalType: "string",
            name: "studentName",
            type: "string",
          },
          {
            internalType: "string",
            name: "certificateType",
            type: "string",
          },
          {
            internalType: "string",
            name: "school",
            type: "string",
          },
          {
            internalType: "string",
            name: "graduationDate",
            type: "string",
          },
          {
            internalType: "string",
            name: "certificateHash",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isValid",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isIssued",
            type: "bool",
          },
        ],
        internalType: "struct CertifyChain.Certificate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentCode",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "isAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_nucCode",
        type: "string",
      },
    ],
    name: "isValidNucCode",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_certificateID",
        type: "string",
      },
      {
        internalType: "string",
        name: "_studentName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_certificateType",
        type: "string",
      },
      {
        internalType: "string",
        name: "_school",
        type: "string",
      },
      {
        internalType: "string",
        name: "_graduationDate",
        type: "string",
      },
      {
        internalType: "string",
        name: "_certificateHash",
        type: "string",
      },
    ],
    name: "issueCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_inviteCode",
        type: "string",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_email",
        type: "string",
      },
      {
        internalType: "string",
        name: "_schoolName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_nucCode",
        type: "string",
      },
      {
        internalType: "string",
        name: "_nucDocHash",
        type: "string",
      },
    ],
    name: "registerAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "removeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_nucCode",
        type: "string",
      },
    ],
    name: "removeValidNucCode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_certificateID",
        type: "string",
      },
    ],
    name: "revokeCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "validNucCodes",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_certificateID",
        type: "string",
      },
    ],
    name: "verifyCertificate",
    outputs: [
      {
        internalType: "string",
        name: "studentName",
        type: "string",
      },
      {
        internalType: "string",
        name: "certificateType",
        type: "string",
      },
      {
        internalType: "string",
        name: "school",
        type: "string",
      },
      {
        internalType: "string",
        name: "graduationDate",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// ============================================================
//  NETWORK CONFIG
// ============================================================
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Sepolia = 11155111 decimal

// Human-readable names for common networks
const NETWORK_NAMES = {
  "0x1": "Ethereum Mainnet",
  "0x89": "Polygon",
  "0x38": "BNB Smart Chain",
  "0xa": "Optimism",
  "0xa4b1": "Arbitrum One",
  "0x13881": "Polygon Mumbai",
  "0x7a69": "Hardhat Local",
};

// ============================================================
//  STATE
// ============================================================
let web3;
let contract;
let userAccount;
let isNetworkCheckDone = false;

// ============================================================
//  NETWORK MODAL FUNCTIONS
// ============================================================

// ── Show / hide modal ──────────────────────────────────────────
function showNetworkModal(currentChainId) {
  const name = NETWORK_NAMES[currentChainId] || "Unknown network";
  document.getElementById("currentNetworkName").textContent = name;
  document.getElementById("networkModal").style.display = "flex";
  document.getElementById("networkModal").style.alignItems = "center";
  document.getElementById("networkModal").style.justifyContent = "center";
}

function hideNetworkModal() {
  document.getElementById("networkModal").style.display = "none";
}

// ── Check network ──────────────────────────────────────────────
async function checkNetwork() {
  if (!window.ethereum) return true; // No MetaMask, skip check

  try {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (chainId !== SEPOLIA_CHAIN_ID) {
      showNetworkModal(chainId);
      return false; // wrong network
    }
    hideNetworkModal();
    return true; // correct network
  } catch (err) {
    console.error("Network check error:", err);
    return true; // Assume correct if can't check
  }
}

// ── Auto-switch to Sepolia ─────────────────────────────────────
async function switchToSepolia() {
  const btn = document.getElementById("switchBtn");
  btn.textContent = "Switching…";
  btn.disabled = true;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
    // MetaMask switched — modal will close via chainChanged listener
  } catch (error) {
    if (error.code === 4902) {
      // Sepolia not in MetaMask yet — add it automatically
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Testnet",
              rpcUrls: ["https://rpc.sepolia.org"],
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } catch (addErr) {
        btn.textContent = "❌ Could not add network — try manually in MetaMask";
        btn.disabled = false;
      }
    } else {
      // User rejected in MetaMask
      btn.textContent = "🔄 Switch to Sepolia automatically";
      btn.disabled = false;
    }
  }
}

// ── Listen for network changes in real-time ────────────────────
if (window.ethereum) {
  window.ethereum.on("chainChanged", (chainId) => {
    if (chainId === SEPOLIA_CHAIN_ID) {
      hideNetworkModal();
      window.location.reload(); // reload to reinitialise with correct network
    } else {
      showNetworkModal(chainId);
    }
  });

  // Also listen for account changes
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      // User disconnected - reload to reset state
      window.location.reload();
    } else {
      // Account changed - reload to reinitialize
      window.location.reload();
    }
  });
}

// ============================================================
//  MOBILE DETECTION
// ============================================================
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent,
  );
}

function openMetaMaskMobileDapp() {
  return new Promise((resolve) => {
    const dappUrl = encodeURIComponent(window.location.href);
    const deepLink = `https://metamask.app.link/dapp/${dappUrl}`;

    let didBackground = false;
    const onHidden = () => {
      didBackground = true;
    };

    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", onHidden);

    window.location.href = deepLink;

    setTimeout(() => {
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", onHidden);
      resolve(didBackground || document.hidden);
    }, 1800);
  });
}

// ============================================================
//  CONNECT BUTTON CLICK
// ============================================================
document.getElementById("connectBtn").addEventListener("click", connectWallet);

async function connectWallet() {
  const btn = document.getElementById("connectBtn");
  const btnText = document.getElementById("btnText");
  const btnIcon = document.getElementById("btnIcon");
  const status = document.getElementById("walletStatus");
  const walletTxt = document.getElementById("walletText");
  const loading = document.getElementById("loadingMessage");
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.style.display = "none";

  if (typeof window.ethereum === "undefined") {
    errorMsg.style.display = "block";

    if (isMobileDevice()) {
      const launchedMetaMask = await openMetaMaskMobileDapp();
      if (launchedMetaMask) {
        return;
      }

      errorMsg.innerHTML = `
              <div style="
                background: rgba(201,168,76,0.08);
                border: 1px solid rgba(201,168,76,0.3);
                border-radius: 12px;
                padding: 16px;
                text-align: left;
                font-size: 0.82rem;
                line-height: 1.8;
                color: #f5f7fa;
              ">
                <div style="font-weight:700; color:#c9a84c; margin-bottom:10px; font-size:0.88rem;">
                  📱 MetaMask Required
                </div>
                To use CertifyChain on mobile, follow these steps:
                <ol style="margin: 10px 0 0 16px; display:flex; flex-direction:column; gap:6px;">
                  <li>Download the <strong style="color:#c9a84c;">MetaMask app</strong> from the
                    <a href="https://apps.apple.com/app/metamask/id1438144202" target="_blank"
                      style="color:#c9a84c;">App Store</a> or
                    <a href="https://play.google.com/store/apps/details?id=io.metamask" target="_blank"
                      style="color:#c9a84c;">Play Store</a>
                  </li>
                  <li>Open the <strong style="color:#c9a84c;">MetaMask app</strong></li>
                  <li>Tap the <strong style="color:#c9a84c;">browser icon</strong> at the bottom of the app</li>
                  <li>Type in your <strong style="color:#c9a84c;">CertifyChain URL</strong> in the browser bar</li>
                  <li>Tap <strong style="color:#c9a84c;">Connect Wallet</strong> as normal</li>
                </ol>
              </div>
            `;
    } else {
      errorMsg.innerHTML = `
              ❌ MetaMask not detected.
              <a href="https://metamask.io/download/" target="_blank" style="color:#c9a84c;">
                Install MetaMask →
              </a>
            `;
    }
    return;
  }

  // ── STEP 1: Check network BEFORE connecting ──
  const isCorrectNetwork = await checkNetwork();
  if (!isCorrectNetwork) {
    // Modal is already shown by checkNetwork()
    errorMsg.style.display = "block";
    errorMsg.innerText = "⚠️ Please switch to Sepolia network to continue.";
    return;
  }

  btn.disabled = true;
  btnIcon.innerHTML = `<span class="spinner"></span>`;
  btnText.innerText = "Connecting...";

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    userAccount = accounts[0];

    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    // Update wallet pill
    status.classList.add("connected");
    walletTxt.innerText =
      userAccount.slice(0, 6) + "..." + userAccount.slice(-4);

    btnText.innerText = "Checking role...";
    loading.style.display = "block";

    // Three-way role check
    await checkRoleAndRoute();
  } catch (err) {
    console.error("Wallet connection error:", err);
    btn.disabled = false;
    btnIcon.innerText = "🦊";
    btnText.innerText = "Connect MetaMask";
    loading.style.display = "none";

    errorMsg.style.display = "block";
    errorMsg.innerText =
      err.code === 4001
        ? "❌ Connection rejected. Please approve the MetaMask request."
        : "❌ Connection failed. Please try again.";
  }
}

// ============================================================
//  THREE-WAY ROUTING
// ============================================================
async function checkRoleAndRoute() {
  const loading = document.getElementById("loadingMessage");
  const errorMsg = document.getElementById("errorMsg");

  try {
    // ── Check 1: Is this wallet whitelisted as admin? ──
    const isAdmin = await contract.methods.isAdmin(userAccount).call();

    if (!isAdmin) {
      // Not an admin — send to option page
      window.location.href = "option-page.html";
      return;
    }

    // ── Check 2: Does this admin have a registered profile? ──
    loading.innerText = "Loading your profile...";
    const profile = await contract.methods.adminProfiles(userAccount).call();

    if (profile.exists) {
      // Returning admin with full profile — go straight to dashboard
      localStorage.setItem(
        "certifychain_admin",
        JSON.stringify({
          wallet: userAccount,
          name: profile.name,
          school: profile.schoolName,
          code: profile.joinCode,
        }),
      );
      window.location.href = "Admin-dashboard.html";
    } else {
      // Whitelisted but no profile — go to signup to complete registration
      window.location.href = "Admin-signup.html";
    }
  } catch (err) {
    console.error("Role check error:", err);
    loading.style.display = "none";
    document.getElementById("connectBtn").disabled = false;
    document.getElementById("btnIcon").innerText = "🦊";
    document.getElementById("btnText").innerText = "Connect MetaMask";

    errorMsg.style.display = "block";
    errorMsg.innerText =
      "❌ Could not read from blockchain. Make sure MetaMask is connected to the Sepolia network.";
  }
}

// ============================================================
//  AUTO-RECONNECT if MetaMask already approved this session
// ============================================================
window.addEventListener("load", async () => {
  if (typeof window.ethereum === "undefined") return;

  // First, check network and show modal if needed
  const isCorrectNetwork = await checkNetwork();
  if (!isCorrectNetwork) {
    // Modal is shown, but we can still try to detect if wallet is connected
    // and show the wallet address in the status bar
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        userAccount = accounts[0];
        const status = document.getElementById("walletStatus");
        const walletTxt = document.getElementById("walletText");
        status.classList.add("connected");
        walletTxt.innerText =
          userAccount.slice(0, 6) + "..." + userAccount.slice(-4);
        document.getElementById("btnText").innerText = "Switch Network";
        document.getElementById("btnIcon").innerText = "⚠️";
      }
    } catch (_) {
      // Silently ignore
    }
    return;
  }

  try {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) return;

    // Wallet already connected — update UI silently
    userAccount = accounts[0];
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const status = document.getElementById("walletStatus");
    const walletTxt = document.getElementById("walletText");
    status.classList.add("connected");
    walletTxt.innerText =
      userAccount.slice(0, 6) + "..." + userAccount.slice(-4);

    document.getElementById("btnText").innerText = "Continue →";
    document.getElementById("btnIcon").innerText = "✅";

    // Auto-route if already connected
    await checkRoleAndRoute();
  } catch (_) {
    // Silently ignore — user just hasn't connected yet
  }
});

// ── Make functions globally accessible for onclick ──
window.switchToSepolia = switchToSepolia;
window.checkNetwork = checkNetwork;
