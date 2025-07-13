/* eslint-disable no-undef */
import express from "express";
import axios from "axios";
import cors from "cors";
import "dotenv/config"; // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;
const acapyApiUrl = process.env.ACAPY_API_URL;
const acapyAdminKey = process.env.ACAPY_ADMIN_KEY; 

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
