/* eslint-disable no-undef */
import express from "express";
import axios from "axios";
import cors from "cors";
import fs from "fs";
import path from "path";
import "dotenv/config"; // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;
const acapyApiUrl = process.env.ACAPY_API_URL;
const acapyAdminKey = process.env.ACAPY_ADMIN_KEY;

// Simple file-based storage functions
const WALLETS_DIR = "wallets";

// Ensure wallets directory exists
if (!fs.existsSync(WALLETS_DIR)) {
  fs.mkdirSync(WALLETS_DIR);
}

const saveWalletToken = (walletId, accessToken) => {
  try {
    const fileName = path.join(WALLETS_DIR, `${walletId}.json`);
    const data = { access_token: accessToken };
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving wallet token:", error);
  }
};

const getWalletToken = (walletId) => {
  try {
    const fileName = path.join(WALLETS_DIR, `${walletId}.json`);
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName, "utf8");
      return JSON.parse(data).access_token;
    }
  } catch (error) {
    console.error("Error reading wallet token:", error);
  }
  return null;
};

app.use(cors());
app.use(express.json());

// Create tenant
app.post("/create-tenant", async (req, res) => {
  const { wallet_label, wallet_name, roles } = req.body;

  const requestData = {
    wallet_label: wallet_label,
    wallet_name: wallet_name,
    roles: roles,
  };

  try {
    const response = await axios.post(
      `${acapyApiUrl}/tenant-admin/v1/tenants`,
      requestData,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": acapyAdminKey,
        },
      }
    );

    // Save wallet token to file
    saveWalletToken(response.data.wallet_id, response.data.access_token);

    // Respond with the data from the API
    res.json({
      success: true,
      wallet_id: response.data.wallet_id,
      access_token: response.data.access_token,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Request failed!" });
  }
});

// Get wallet token
app.get("/wallet/:wallet_id", (req, res) => {
  const { wallet_id } = req.params;
  const accessToken = getWalletToken(wallet_id);

  if (accessToken) {
    res.json({
      success: true,
      wallet_id: wallet_id,
      access_token: accessToken,
    });
  } else {
    res.status(404).json({ error: "Wallet not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
