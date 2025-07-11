import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 5000;

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
      "https://221257d0ccd9.ngrok-free.app/tenant-admin/v1/tenants",
      requestData,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": "tenant-admin.adminApiKey",
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
