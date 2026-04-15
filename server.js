const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// 🔐 SUAS CHAVES AMADEUS
const API_KEY = "y1V2xwEDBiff15z5O3MHxbu5DTzTmcKK";
const API_SECRET = "Co5pi5ZPKdr5JzQd";

// 🔑 GERAR TOKEN
async function getToken() {
  const response = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: API_KEY,
      client_secret: API_SECRET,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return response.data.access_token;
}

// ✈️ ROTA DE VOOS
app.get("/voos", async (req, res) => {
  const { origin, destination, date } = req.query;

  if (!origin || !destination || !date) {
    return res.json({ error: "Missing parameters" });
  }

  try {
    const token = await getToken();

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: date,
          adults: 1,
          max: 5,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.json({ error: "API error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
