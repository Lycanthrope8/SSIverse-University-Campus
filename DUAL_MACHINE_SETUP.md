# Dual Machine Setup Guide (Ubuntu + Windows) - SSIverse University Campus

## Overview

This guide covers the dual-machine setup for the "Enabling SSI in Metaverses" research project. The Ubuntu machine runs the acapy-cloud infrastructure with exposed ports via ngrok, while the Windows machine handles the Wonderland Engine frontend and backend wallet service.

## Prerequisites

### Ubuntu Machine Prerequisites

* **Docker** - For containerization
* **kubectl** - Kubernetes command-line tool
* **mise** - Development environment manager
* **ngrok** - For exposing local ports to the internet
* **Git** - Version control system
* **SSH keys configured for GitHub** - Required for repository access

### Windows Machine Prerequisites

* **Node.js and npm** - For running the backend wallet service
* **Git** - Version control system
* **Visual Studio Code** - Recommended code editor
* **SSH keys configured for GitHub** - Required for repository access

### SSH Key Setup for Both Machines

For setting up SSH keys on both Ubuntu and Windows machines, refer to this video tutorial: [SSH Key Setup](https://youtu.be/Zzqtj0sRB1k)

#### **Note:** We assume you can install these prerequisites independently.

---

# Part 1: Ubuntu Machine Setup

## Step 1: SSH Keys and Repository Setup

### Configure SSH Keys for GitHub

Follow the video tutorial: [SSH Key Setup](https://youtu.be/Zzqtj0sRB1k)

### Clone the Repository

```bash
git clone --recursive https://github.com/Lycanthrope8/acapy-cloud.git
cd acapy-cloud
```

The `--recursive` flag is important as it ensures all submodules are cloned properly.

## Step 2: Starting the Project

### Launch the Containerized Environment

```bash
mise run tilt:up
```

This single command will:

* Spin up a Kind cluster
* Build all necessary Docker images
* Start the entire project infrastructure

### Monitor the Setup

Once the command is running, visit http://localhost:10350/ to access the  **Tilt UI** . This interface allows you to monitor the deployment progress and status of all services.

**Important:** Wait for all 28 updates to complete before proceeding to the next step. You can track this progress in the Tilt UI. Sometimes the updates may fail due to network issues. Please try switching the WiFi or switch to the Mobile Data hotspot

## Step 3: Additional Resources

For more detailed information about the project:

* **Quick Start Guide:** https://github.com/Lycanthrope8/acapy-cloud/blob/master/docs/src/Quick%20Start%20Guide.md
* **Example Flows:** https://github.com/Lycanthrope8/acapy-cloud/blob/master/docs/src/Example%20Flows.md

## Step 4: Port Forwarding

Once all updates are complete in the Tilt UI, you need to forward ports from the Kubernetes clusters to your local machine.

### Forward Multitenant Agent Port

Open a new terminal and run:

```bash
kubectl port-forward -n cloudapi svc/multitenant-web 8000:8000
```

**Keep this terminal running** - it maintains the port forwarding.

### Forward Trust Registry Port

Open another new terminal and run:

```bash
kubectl port-forward -n cloudapi svc/trust-registry 8001:8000
```

**Keep this terminal running as well** - you now have two terminals maintaining port forwards.

## Step 5: Ngrok Configuration

### Create Ngrok Configuration File

In a third terminal, open the ngrok configuration editor:

```bash
ngrok config edit
```

### Add Configuration

Copy and paste the following configuration:

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

**Important:** Replace `[GET_YOUR_AUTHTOKEN_FROM_NGROK]` with your actual ngrok authtoken, which you can obtain from your ngrok dashboard.

### Save the Configuration

* Press `Ctrl+O` to write the file
* Press `Enter` to confirm
* Press `Ctrl+X` to exit the editor

### Start Ngrok Tunnels

```bash
ngrok start --all
```

## Step 6: Record Exposed URLs

After running the ngrok command, you'll see output showing the public URLs for both services. They will look something like:

```
multitenant-web -> https://abc123.ngrok.io
trust-registry -> https://def456.ngrok.io
```

**CRITICAL:** Record both URLs as you will need them for the Windows machine setup. These URLs change each time you restart ngrok, so make sure to update them whenever you restart the service.

---

# Part 2: Windows Machine Setup

## Step 1: Prerequisites and SSH Setup

### Configure SSH Keys for GitHub

Follow the same video tutorial used for Ubuntu: https://youtu.be/Zzqtj0sRB1k

### Install Wonderland Engine

Visit [Wonderland Engine Download]([https://wonderlandengine.com/getting-started/installing/]()) and follow the installation instructions for Windows.

**Important:** Complete the Wonderland Engine installation before proceeding with the repository setup.

## Step 2: Repository Setup

### Clone the Repository

```bash
git clone https://github.com/Lycanthrope8/SSIverse-University-Campus.git
cd SSIverse-University-Campus
```

### Install Dependencies

```bash
npm i
```

This will install all required Node.js packages for the project.

## Step 3: Environment Configuration

### Create Environment File

1. Locate the `env.sample` file in the repository root
2. Copy `env.sample` and rename the copy to `.env`

### Configure Environment Variables

Open the `.env` file and update the URLs with the ngrok URLs you recorded from the Ubuntu machine setup:

```bash
PORT=5000
# Replace these with your actual ngrok URLs from Ubuntu setup
ACAPY_API_URL=https://your-multitenant-ngrok-url.ngrok-free.app # NGrok URL that you copied from port 8000 in Ubuntu
TRUST_REGISTRY_URL=https://your-trust-registry-ngrok-url.ngrok-free.app # NGrok URL for the Trust Registry you copied from port 8001 in Ubuntu
ACAPY_ADMIN_KEY=tenant-admin.adminApiKey # The admin API key for the ACAPY instance
```

**Critical:** Ensure these URLs match exactly with the ngrok URLs from your Ubuntu machine. The URLs will look something like:

* `https://abc123.ngrok.io` (for multitenant-web)
* `https://def456.ngrok.io` (for trust-registry)

## Step 4: Open Project in VS Code

### Launch VS Code

```bash
code .
```

Or manually open Visual Studio Code and open the `SSIverse-University-Campus` folder.

## Step 5: Start the Wallet Service

### Run the Wallet Backend

In the VS Code terminal (or any terminal in the project directory):

```bash
node wallet.js
```

**Keep this terminal running** - this is your wallet backend service that handles SSI operations.

**Important:** Any changes you make in this file will not hotreload automatically. This feature is not available yet but it will be soon. So, after every changes give this command to restart the service.

### Verify Wallet Service

The wallet service should start successfully and display connection information. Look for confirmation messages indicating successful connection to the Ubuntu services via ngrok.

## Step 6: Launch the 3D Metaverse

### Open Wonderland Project

1. Navigate to the project directory in File Explorer
2. Locate the `.wlp` file (Wonderland Project file)
3. Double-click the `.wlp` file

This will open the 3D world project in Wonderland Engine.

### Build and Launch the Metaverse

1. In Wonderland Engine, locate the **green play button** at the top center of the interface
2. Click the play button to build and launch the metaverse
3. The system will compile the 3D environment and open it in your default web browser

---

# System Verification and Testing

## Step 7: Complete System Status Check

Ensure the following components are running:

### Ubuntu Machine:

* [ ] acapy-cloud with Tilt UI accessible (28/28 updates complete)
* [ ] Port forwarding active (2 terminals running kubectl port-forward)
* [ ] Ngrok tunnels active and URLs recorded

### Windows Machine:

* [ ] Wallet service running (`node wallet.js`)
* [ ] Wonderland Engine project loaded
* [ ] 3D metaverse environment accessible in web browser

### Functionality Test

1. The 3D metaverse should load without errors
2. SSI functionality should be accessible through the interface
3. Wallet operations should connect successfully to the Ubuntu backend via ngrok

## Troubleshooting

### Common Issues

1. **SSH Key Problems**
   * Follow the video tutorial exactly: [SSH Key Setup](https://youtu.be/Zzqtj0sRB1k)
   * Ensure SSH keys are added to both GitHub and SSH agent
2. **Environment Variables Not Working**
   * Verify `.env` file exists and contains correct ngrok URLs
   * Ensure no extra spaces or characters in URLs
   * Confirm ngrok URLs are currently active on Ubuntu machine
3. **Wallet Service Connection Fails**
   * Check that ngrok URLs in `.env` are correct and accessible
   * Verify Ubuntu machine services are running
   * Test ngrok URLs directly in a web browser
4. **Wonderland Engine Issues**
   * Ensure Wonderland Engine is properly installed
   * Verify the `.wlp` file opens without errors
   * Check that all project dependencies are loaded

### Debug Steps

1. **Test ngrok connectivity:**
   ```bash
   curl [your-multitenant-ngrok-url]
   curl [your-trust-registry-ngrok-url]
   ```
2. **Check wallet service logs:** Monitor the terminal running `node wallet.js` for error messages
3. **Verify environment file:** Ensure `.env` file is in the correct location and properly formatted

## Important Notes

### System Requirements

* Both Ubuntu and Windows machines must be running simultaneously
* Network connectivity is required for ngrok URL communication
* Keep all services running during development/testing

### URL Management

* Ngrok URLs change each time the service restarts on Ubuntu
* Update `.env` file on Windows whenever Ubuntu ngrok URLs change
* Test connectivity after any URL updates

### Development Workflow

1. Start Ubuntu services first (Tilt, port forwarding, ngrok)
2. Record and configure ngrok URLs
3. Start Windows wallet service
4. Launch Wonderland Engine environment
5. Test end-to-end functionality

## Next Steps

With both machines configured and running:

1. Explore the SSI functionality within the 3D metaverse
2. Test credential issuance and verification workflows
3. Experiment with multi-user interactions
4. Review the project documentation for advanced features

The complete "Enabling SSI in Metaverses" system should now be operational with Ubuntu handling the SSI infrastructure and Windows providing the immersive 3D interface.
