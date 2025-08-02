# Single Windows Machine Setup Guide (WSL) - SSIverse University Campus

**Important:** This setup is not tested, but assuming the diffrences between native ubuntu and wsl ubuntu, the instructions have been give. Please troubleshoot it yourself if any problem arises. Also make issues and pull requests if any solution arises.

## Overview

This guide provides instructions for running the complete "Enabling SSI in Metaverses" research project on a single Windows machine using Windows Subsystem for Linux (WSL). This approach runs the acapy-cloud infrastructure in WSL (Ubuntu) while maintaining the Wonderland Engine and frontend components in the native Windows environment.

## Prerequisites

### Windows Prerequisites

* **Windows 10 version 2004+ or Windows 11** - Required for WSL 2
* **WSL 2 enabled** - Windows Subsystem for Linux version 2
* **Ubuntu 22.04 LTS** - Recommended WSL distribution
* **Node.js and npm** - For running the wallet service (Windows side)
* **Git** - Version control system (both Windows and WSL)
* **Visual Studio Code** - Recommended code editor with WSL extension

### WSL Ubuntu Prerequisites (will be installed during setup)

* **Docker** - For containerization
* **kubectl** - Kubernetes command-line tool
* **mise** - Development environment manager
* **ngrok** - For exposing local ports to the internet
* **Git** - Version control system

### SSH Key Setup

For setting up SSH keys (works for both WSL and Windows), refer to this video tutorial: https://youtu.be/Zzqtj0sRB1k

**Note:** You'll need SSH keys configured in WSL for cloning repositories.

---

# Part 1: WSL Setup and Configuration

## Step 1: Enable WSL and Install Ubuntu

### Install WSL with Ubuntu

Open PowerShell as Administrator and run:

```powershell
wsl --install -d Ubuntu-22.04
```

### Initial Setup

1. Restart your computer when prompted
2. After restart, Ubuntu will launch automatically for initial setup
3. Create a username and password for your Ubuntu environment
4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install Required Tools in WSL

Open your WSL Ubuntu terminal and install the necessary tools:

### Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Start Docker daemon
sudo service docker start

# Add Docker daemon to startup (optional)
echo 'sudo service docker start' >> ~/.bashrc
```

### Install kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### Install mise

```bash
curl https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
source ~/.bashrc
```

### Install ngrok

```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

## Step 3: SSH Key Configuration in WSL

### Generate SSH Keys in WSL

Follow the video tutorial: https://youtu.be/Zzqtj0sRB1k

The process in WSL is identical to native Ubuntu:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
```

Add the public key to your GitHub account settings.

---

# Part 2: WSL Backend Setup (acapy-cloud)

## Step 4: Repository Setup and Launch

### Clone Repository in WSL

```bash
cd ~
git clone --recursive https://github.com/Lycanthrope8/acapy-cloud.git
cd acapy-cloud
```

### Launch the Project

```bash
mise run tilt:up
```

**Note:** This may take longer on first run as it downloads and builds Docker images.

### Monitor Progress

The Tilt UI will be accessible at http://localhost:10350/ from both WSL and Windows. You can open this in your Windows browser.

**Wait for all 28 updates to complete** before proceeding.

## Step 5: Port Forwarding in WSL

### Forward Required Ports

Open two separate WSL terminal windows:

**Terminal 1:**

```bash
kubectl port-forward -n cloudapi svc/multitenant-web 8000:8000
```

**Terminal 2:**

```bash
kubectl port-forward -n cloudapi svc/trust-registry 8001:8000
```

Keep both terminals running.

## Step 6: Ngrok Configuration in WSL

### Configure Ngrok

```bash
ngrok config edit
```

Add the following configuration:

```yaml
version: 2
authtoken: [GET_YOUR_AUTHTOKEN_FROM_NGROK]
tunnels:
  multitenant-web:
    proto: http
    addr: 8000
  trust-registry:
    proto: http
    addr: 8001
```

**Important:** Replace `[GET_YOUR_AUTHTOKEN_FROM_NGROK]` with your actual ngrok authtoken.

### Save and Start Ngrok

* Press `Ctrl+O` to write the file
* Press `Enter` to confirm
* Press `Ctrl+X` to exit the editor

### Start Ngrok Tunnels

```bash
ngrok start --all
```

**Record the exposed URLs** - you'll need them for the Windows frontend configuration.

---

# Part 3: Windows Frontend Setup

## Step 7: Install Wonderland Engine

Download and install from: https://wonderlandengine.com/getting-started/installing/

## Step 8: SSH Keys for Windows (if needed)

If you need to clone repositories directly in Windows (not through WSL), follow the same video tutorial: https://youtu.be/Zzqtj0sRB1k

## Step 9: Frontend Repository Setup

### Clone Frontend Repository

Open Command Prompt or PowerShell in Windows:

```cmd
git clone https://github.com/Lycanthrope8/SSIverse-University-Campus.git
cd SSIverse-University-Campus
npm i
```

### Configure Environment

1. Copy `env.sample` to `.env`
2. Edit `.env` with the ngrok URLs from your WSL setup:

```bash
PORT=5000
# Replace these with your actual ngrok URLs from Ubuntu setup
ACAPY_API_URL=https://your-multitenant-ngrok-url.ngrok-free.app # NGrok URL that you copied from port 8000 in Ubuntu
TRUST_REGISTRY_URL=https://your-trust-registry-ngrok-url.ngrok-free.app # NGrok URL for the Trust Registry you copied from port 8001 in Ubuntu
ACAPY_ADMIN_KEY=tenant-admin.adminApiKey # The admin API key for the ACAPY instance
```

## Step 10: Launch Services

### Start Wallet Service

Open Command Prompt or PowerShell in the project directory:

```cmd
node wallet.js
```

**Keep this terminal running.**

### Open Wonderland Project

1. Double-click the `.wlp` file in the project directory
2. Click the green play button in Wonderland Engine to build and launch the metaverse

---

# System Verification and Integration

## Step 11: WSL-Windows Integration

### Accessing Files Between Systems

* **WSL files from Windows:** `\\wsl$\Ubuntu-22.04\home\[username]\`
* **Windows files from WSL:** `/mnt/c/`, `/mnt/d/`, etc.

### Network Integration

* WSL and Windows share the same network interface
* localhost in WSL is accessible from Windows
* Ngrok URLs work from both environments

## Step 12: Complete System Verification

### Check All Components

Ensure the following are running:

**WSL Side:**

* [ ] Docker daemon active
* [ ] Tilt services running (28/28 complete)
* [ ] Port forwarding active (2 terminals)
* [ ] Ngrok tunnels active with recorded URLs

**Windows Side:**

* [ ] Wallet service running (`node wallet.js`)
* [ ] Wonderland Engine project loaded
* [ ] 3D metaverse accessible in browser

### Functionality Test

1. The 3D metaverse should load without errors
2. SSI functionality should be accessible through the interface
3. Wallet operations should connect successfully to the WSL backend via ngrok

## Troubleshooting WSL-Specific Issues

### SSH Key Problems

* Follow the video tutorial exactly for WSL: https://youtu.be/Zzqtj0sRB1k
* Ensure SSH keys are properly configured in WSL for GitHub access

### WSL Service Issues

```bash
# Restart WSL if needed
wsl --shutdown
wsl
```

### Docker Permission Issues

```bash
sudo service docker restart
sudo usermod -aG docker $USER
# Restart WSL terminal
```

### Network Connectivity Issues

```bash
# Check WSL networking
ip addr show
# Test localhost connectivity
curl http://localhost:10350
```

### Performance Optimization

Create or edit `~/.wslconfig` on Windows:

```ini
[wsl2]
memory=8GB
processors=4
```

### Environment Variable Issues

* Verify `.env` file exists in Windows project directory
* Ensure ngrok URLs from WSL are correctly copied
* Test ngrok URLs directly in browser

## Important Notes

### Advantages of WSL Setup

* **Single Machine:** Everything runs on one computer
* **Resource Sharing:** Shared CPU and memory resources
* **Simplified Networking:** No network configuration between machines
* **Development Efficiency:** Easier debugging and development

### Considerations

* **Resource Competition:** Backend and frontend compete for system resources
* **Performance Impact:** May be slower than dedicated machines
* **WSL Complexity:** Additional layer requiring WSL knowledge

### System Management

* WSL 2 provides better performance than WSL 1
* Keep WSL updated: `wsl --update`
* Monitor system resources during development
* WSL terminal sessions must remain active for services to run

### URL Management

* Ngrok URLs change each time the service restarts in WSL
* Update Windows `.env` file whenever WSL ngrok URLs change
* Test connectivity after any URL updates

## Development Workflow

1. **Start WSL Backend:**
   * Launch WSL terminals
   * Start Docker and Tilt services
   * Configure port forwarding
   * Start ngrok tunnels
2. **Configure Windows Frontend:**
   * Update `.env` file with ngrok URLs
   * Start wallet service
   * Launch Wonderland Engine
3. **Test Integration:**
   * Verify 3D metaverse loads
   * Test SSI functionality
   * Monitor both WSL and Windows logs

## Next Steps

With the complete system running on WSL:

1. Test all SSI functionality end-to-end
2. Verify 3D metaverse interactions
3. Monitor system performance and resource usage
4. Develop and test new features in the integrated environment

The single-machine WSL setup provides a complete development environment for the "Enabling SSI in Metaverses" research project while maintaining the separation between infrastructure and frontend components.
