# SSIverse University Campus - Setup Documentation

## Project Overview

**"Enabling SSI in Metaverses"** is a research project that demonstrates Self-Sovereign Identity (SSI) functionality within immersive 3D metaverse environments. The SSIverse University Campus prototype combines blockchain-based identity management with virtual reality experiences, allowing users to interact with digital credentials in a spatial computing environment.

## Architecture

The system consists of two main components:

* **Backend Infrastructure** : acapy-cloud running SSI agents and trust registry services
* **Frontend Experience** : Wonderland Engine 3D metaverse with wallet integration

## Setup Options

Choose one of the two setup options below based on your hardware availability and preferences:

### 🖥️ Option 1: Dual Machine Setup (Recommended)

 **Best for** : Production environments, better performance, resource isolation

* **Ubuntu Machine** : Runs the SSI backend infrastructure (acapy-cloud)
* **Windows Machine** : Runs the 3D metaverse frontend and wallet service
* **Connection** : Machines communicate via ngrok-exposed URLs

**Advantages:**

* Better performance and resource allocation
* Clear separation of concerns
* Easier debugging and development
* Production-ready architecture

➡️ **[Follow Dual Machine Setup Guide](https://claude.ai/chat/DUAL_MACHINE_SETUP.md)**

---

### 💻 Option 2: Single Windows Machine (WSL)

 **Best for** : Limited hardware, learning purposes

* **WSL Ubuntu** : Runs the SSI backend infrastructure
* **Native Windows** : Runs the 3D metaverse frontend and wallet service
* **Connection** : Components communicate either localhost or ngrok (Preferred)

**Advantages:**

* Single machine requirement
* Simplified networking
* Lower hardware requirements
* Good for development and testing

➡️ **[Follow Single Machine WSL Setup Guide](https://claude.ai/chat/WSL_SINGLE_MACHINE_SETUP.md)**

---

## Quick Start Decision Tree

```
Do you have access to both Ubuntu and Windows machines?
├── Yes → Use Dual Machine Setup (Option 1)
└── No → Do you have a Windows machine with WSL capability?
    ├── Yes → Use Single Machine WSL Setup (Option 2)
    └── No → You'll need to set up WSL on Windows or access an Ubuntu machine
```

## System Requirements

### Dual Machine Setup

* **Ubuntu Machine** : 8GB RAM, 50GB storage, Docker support
* **Windows Machine** : 8GB RAM, 20GB storage, Node.js support

### Single Machine WSL Setup

* **Windows Machine** : 16GB RAM (recommended), 70GB storage, WSL 2 support
* **Windows 10 version 2004+ or Windows 11**

## Repository Structure

* **Backend Repository** : [acapy-cloud](https://github.com/Lycanthrope8/acapy-cloud.git)
* **Frontend Repository** : [SSIverse-University-Campus](https://github.com/Lycanthrope8/SSIverse-University-Campus.git)

## Common Prerequisites (Both Options)

* **Git** - Version control system
* **SSH Keys** - Configured for GitHub access
* **ngrok account** - For exposing local services
* **Node.js and npm** - For wallet service (Windows side)
* **Wonderland Engine** - For 3D metaverse environment

## Getting Help

### Documentation Resources

* [Quick Start Guide](https://github.com/Lycanthrope8/acapy-cloud/blob/master/docs/src/Quick%20Start%20Guide.md) - acapy-cloud setup details
* [Example Flows](https://github.com/Lycanthrope8/acapy-cloud/blob/master/docs/src/Example%20Flows.md) - Understanding system workflows

### Video Tutorials

* [SSH Key Setup](https://youtu.be/Zzqtj0sRB1k) - Works for Ubuntu, Windows, and WSL

### Troubleshooting

Both setup guides include comprehensive troubleshooting sections covering:

* SSH key configuration issues
* Docker and containerization problems
* Network connectivity challenges
* Environment configuration errors
* Performance optimization tips

## Project Goals

This research project demonstrates:

* **SSI Integration** : Seamless credential management in virtual environments
* **Spatial Computing** : 3D interfaces for digital identity interactions
* **Interoperability** : Cross-platform identity verification systems
* **User Experience** : Intuitive credential workflows in metaverse contexts

## Contributing

When contributing to this project:

1. Choose your setup option and complete the installation
2. Test all functionality end-to-end
3. Document any issues or improvements
4. Follow the established development workflow for your chosen setup


**Ready to get started?** Choose your setup option above and follow the detailed guide. Both paths will result in a fully functional SSI-enabled metaverse environment for research and development.
