// SSIverse University Campus Landing Page JavaScript
// Cloud Wallet and Authentication System

// Get DOM elements
const walletModal = document.getElementById("wallet-modal-overlay");
const walletContent = document.getElementById("wallet-content");
const walletTitle = document.getElementById("wallet-modal-title");
const closeBtn = document.getElementById("wallet-close-btn");
const loginBtn = document.getElementById("wallet-login-btn");
const signupBtn = document.getElementById("signup-wallet-btn");
const guestBtn = document.getElementById("guest-login-btn");

// Wallet state management
let walletState = {
  isAuthenticated: false,
  did: null,
  credentials: [],
  connections: [],
  wallet_id: null,
  access_token: null,
};

// Particle effect system
function createParticle() {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = Math.random() * window.innerWidth + "px";
  particle.style.bottom = "-10px";
  particle.style.animationDelay = Math.random() * 10 + "s";
  particle.style.animationDuration = Math.random() * 5 + 10 + "s";

  const bgAnimation = document.querySelector(".bg-animation");
  if (bgAnimation) {
    bgAnimation.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 15000);
  }
}

// Initialize particle system
function initializeParticles() {
  // Create particles periodically
  setInterval(createParticle, 2000);
}

// Add hover effects to buttons
function initializeButtonEffects() {
  const buttons = document.querySelectorAll(".landing-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-2px) scale(1.02)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Modal management functions
function closeWallet() {
  if (walletModal) {
    walletModal.style.display = "none";
  }
}

function openWallet(mode) {
  if (walletModal) {
    walletModal.style.display = "block";

    if (mode === "login") {
      walletTitle.textContent = "SSI Cloud Wallet - Login";
      showLoginContent();
    } else if (mode === "signup") {
      walletTitle.textContent = "SSI Cloud Wallet - Sign Up";
      showSignupContent();
    }
  }
}

// Show login content
function showLoginContent() {
  walletContent.innerHTML = `
        <div class="wallet-form-group">
            <label class="wallet-label">DID</label>
            <input type="text" class="wallet-input" id="login-did" placeholder="did:ssi:xxxxx" style="font-family: monospace; font-size: 13px;">
        </div>
        <div class="wallet-form-group">
            <label class="wallet-label">Passphrase</label>
            <input type="password" class="wallet-input" id="login-password" placeholder="Enter your passphrase">
        </div>
        <button class="wallet-button" onclick="authenticateDID()">Authenticate</button>
        <div class="wallet-divider">
            <span>or</span>
        </div>
        <button class="wallet-button" style="background: #444;" onclick="scanQRCode()">Scan QR Code</button>
    `;
}

// Show signup content
function showSignupContent() {
  walletContent.innerHTML = `
        <div class="wallet-form-group">
            <label class="wallet-label">Wallet Label</label>
            <input type="text" class="wallet-input" id="signup-wallet-label" placeholder="Enter your Wallet Label">
        </div>
        <div class="wallet-form-group">
            <label class="wallet-label">Wallet Name</label>
            <input type="email" class="wallet-input" id="signup-wallet-name" placeholder="Enter your wallet name (could be your name)">
        </div>
        <div class="wallet-form-group">
            <label class="wallet-label">University / Institution</label>
            <input type="text" class="wallet-input" id="signup-university" value="SSIverse University" readonly style="background: #1a1a1a; color: #888;">
        </div>
        
        <button class="wallet-button" onclick="createWallet()" id="create-wallet-btn" style="opacity: 1; cursor: pointer;">Create Wallet</button>
    `;
}

// Create wallet function
async function createWallet() {
  const walletLabel = document.getElementById("signup-wallet-label").value;
  const walletName = document.getElementById("signup-wallet-name").value;

  console.log(
    "Creating wallet with label:",
    walletLabel,
    "and name:",
    walletName
  );

  if (walletLabel && walletName) {
    showLoadingState("Creating your wallet...");

    try {
      const response = await fetch(
        "https://85039582f37a.ngrok-free.app/tenant-admin/v1/tenants",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "x-api-key": "tenant-admin.adminApiKey",
          },
          body: JSON.stringify({
            wallet_label: walletLabel,
            wallet_name: walletName,
            roles: [],
          }),
        }
      );

      console.log("Response:", response);
      const data = await response.json();

      if (response.ok) {
        walletState.wallet_id = data.wallet_id;
        walletState.access_token = data.access_token;
        showCredentialRequestScreen();
      } else {
        showErrorMessage("Failed to create wallet: " + data.message);
      }
    } catch (error) {
      showErrorMessage("An error occurred: " + error.message);
    }
  } else {
    showErrorMessage("Please fill in all fields");
  }
}

// Show credential request screen
function showCredentialRequestScreen() {
  walletContent.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style="width: 60px; height: 60px;">
                <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h3 style="color: #00ff88; margin-top: 10px;">Wallet Created Successfully!</h3>
        </div>
        
        <div class="wallet-section">
            <h3 class="wallet-section-title">Your Wallet ID</h3>
            <div class="wallet-info" style="font-family: monospace; font-size: 13px; word-break: break-all;">${walletState.wallet_id}</div>
        </div>
        <div class="wallet-section">
            <h3 class="wallet-section-title">Your Access Token</h3>
            <div class="wallet-info" style="font-family: monospace; font-size: 13px; word-break: break-all;">${walletState.access_token}</div>
        </div>
        
        <div class="wallet-section">
            <h3 class="wallet-section-title">Request Credential</h3>
            <div class="credential-item" style="margin-bottom: 16px;">
                <span class="credential-name">SSIverse University Student ID</span>
                <span class="credential-status" style="background: rgba(255, 170, 0, 0.1); color: #ffaa00;">Pending</span>
            </div>
            <button class="wallet-button" onclick="requestCredential()">Request Credential</button>
        </div>
    `;
}

// Request credential function
function requestCredential() {
  showLoadingState("Requesting credential from SSIverse University...");

  setTimeout(() => {
    // Simulate credential issuance
    walletState.credentials.push({
      type: "University Student ID",
      issuer: "SSIverse University",
      status: "Verified",
      issuedAt: new Date().toISOString(),
    });

    showSuccessState("Credential Issued Successfully!");

    setTimeout(() => {
      showAuthenticatedContent();
    }, 1500);
  }, 2000);
}

// Authenticate DID function
function authenticateDID() {
  const did = document.getElementById("login-did").value;
  const password = document.getElementById("login-password").value;

  if (did && password) {
    showLoadingState("Authenticating...");

    setTimeout(() => {
      walletState.isAuthenticated = true;
      walletState.did = did;

      // Mock credential data (would come from ACA-Py)
      walletState.credentials = [
        {
          type: "University Student ID",
          issuer: "SSIverse University",
          status: "Verified",
          claims: {
            name: "John Doe",
            studentId: "STU-2024-001",
            program: "Computer Science",
            level: "Undergraduate",
          },
        },
      ];

      showCredentialSharingScreen();
    }, 1500);
  } else {
    showErrorMessage("Please enter both DID and passphrase");
  }
}

// Show credential sharing screen
function showCredentialSharingScreen() {
  const credential = walletState.credentials[0];
  walletContent.innerHTML = `
        <div class="wallet-section">
            <h3 class="wallet-section-title">Your DID</h3>
            <div class="wallet-info" style="font-family: monospace; font-size: 13px; word-break: break-all;">${
              walletState.did
            }</div>
        </div>
        
        <div class="wallet-section">
            <h3 class="wallet-section-title">Select Credential to Share</h3>
            <div class="credential-item" style="border: 2px solid #00aaff; background: rgba(0, 170, 255, 0.05);">
                <div>
                    <span class="credential-name">${credential.type}</span>
                    <div style="font-size: 12px; color: #888; margin-top: 4px;">Issued by: ${
                      credential.issuer
                    }</div>
                </div>
                <span class="credential-status">Verified</span>
            </div>
            
            <div class="wallet-info" style="margin-top: 16px;">
                <strong>Credential Details:</strong>
                <div style="margin-top: 8px; font-size: 13px; color: #ccc;">
                    ${
                      credential.claims
                        ? `
                        • Name: ${credential.claims.name}<br>
                        • Student ID: ${credential.claims.studentId}<br>
                        • Program: ${credential.claims.program}<br>
                        • Level: ${credential.claims.level}
                    `
                        : "Standard University Credential"
                    }
                </div>
            </div>
            
            <button class="wallet-button" onclick="shareCredential()" style="margin-top: 20px;">Share Credential</button>
        </div>
    `;
}

// Share credential function
function shareCredential() {
  showLoadingState("Verifying credential...");

  setTimeout(() => {
    showSuccessState("Credential Verified Successfully!");

    setTimeout(() => {
      // Show final authenticated view with Enter Metaverse button
      walletContent.innerHTML = `
                <div style="text-align: center; padding: 20px 0;">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style="width: 60px; height: 60px;">
                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <h3 style="color: #00ff88; margin-top: 10px;">Identity Verified</h3>
                    <p style="color: #888; margin-top: 10px;">You are authenticated as a verified student</p>
                </div>
                
                <button class="wallet-button" onclick="enterMetaverse()" style="
                    background: linear-gradient(135deg, #00ff88 0%, #00aaff 100%);
                    font-size: 18px;
                    padding: 16px;
                    margin-top: 20px;
                ">Enter Metaverse</button>
            `;
    }, 1500);
  }, 2000);
}

// Show authenticated wallet content
function showAuthenticatedContent() {
  walletContent.innerHTML = `
        <div class="wallet-section">
            <h3 class="wallet-section-title">Your DID</h3>
            <div class="wallet-info" style="font-family: monospace; font-size: 13px; word-break: break-all;">${
              walletState.did
            }</div>
        </div>
        
        <div class="wallet-section">
            <h3 class="wallet-section-title">Your Credentials</h3>
            <div class="credential-list" id="credential-list">
                ${walletState.credentials
                  .map(
                    (cred) => `
                    <div class="credential-item">
                        <div>
                            <span class="credential-name">${cred.type}</span>
                            <div style="font-size: 12px; color: #888; margin-top: 4px;">Issued by: ${cred.issuer}</div>
                        </div>
                        <span class="credential-status">${cred.status}</span>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
        
        <div class="wallet-section">
            <button class="wallet-button" onclick="enterMetaverse()" style="
                background: linear-gradient(135deg, #00ff88 0%, #00aaff 100%);
                font-size: 18px;
                padding: 16px;
            ">Enter Metaverse</button>
        </div>
    `;
}

// UI state functions
function showLoadingState(message) {
  walletContent.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="loading-spinner"></div>
            <p style="color: #888; margin-top: 20px;">${message}</p>
        </div>
    `;
}

function showSuccessState(message) {
  walletContent.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <p style="color: #00ff88; margin-top: 20px; font-weight: 500;">${message}</p>
        </div>
    `;
}

function showErrorMessage(message) {
  // Create error toast
  const toast = document.createElement("div");
  toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        color: #ff6b6b;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 100002;
        animation: slideIn 0.3s ease-out;
    `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Placeholder functions
function scanQRCode() {
  alert("QR Code scanning will be implemented with ACA-Py integration");
}

function enterMetaverse() {
  closeWallet();
  const landing = document.getElementById("landing-page");
  const canvas = document.getElementById("canvas");

  if (canvas) canvas.style.display = "block";
  if (landing) landing.style.display = "none";

  // Trigger the app.ts login event
  window.dispatchEvent(
    new CustomEvent("walletAuthenticated", {
      detail: { did: walletState.did },
    })
  );
}

// Initialize ripple effect
function initializeRippleEffect() {
  document.querySelectorAll(".landing-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Add slide animations for toasts
function addAnimationStyles() {
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
}

// Event listeners setup
function setupEventListeners() {
  // Modal close button
  if (closeBtn) {
    closeBtn.addEventListener("click", closeWallet);
  }

  // Login and signup buttons
  if (loginBtn) {
    loginBtn.addEventListener("click", () => openWallet("login"));
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => openWallet("signup"));
  }

  // Guest login
  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      const landing = document.getElementById("landing-page");
      const canvas = document.getElementById("canvas");

      if (canvas) canvas.style.display = "block";
      if (landing) landing.style.display = "none";

      // Trigger guest login event
      window.dispatchEvent(new CustomEvent("guestLogin"));
    });
  }

  // Close modal when clicking outside
  if (walletModal) {
    walletModal.addEventListener("click", (e) => {
      if (e.target === walletModal) {
        closeWallet();
      }
    });
  }

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      walletModal &&
      walletModal.style.display === "block"
    ) {
      closeWallet();
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  addAnimationStyles();
  setupEventListeners();
  initializeButtonEffects();
  initializeRippleEffect();
  initializeParticles();
});

// Make functions available globally for onclick handlers
window.createWallet = createWallet;
window.authenticateDID = authenticateDID;
window.shareCredential = shareCredential;
window.requestCredential = requestCredential;
window.scanQRCode = scanQRCode;
window.enterMetaverse = enterMetaverse;
