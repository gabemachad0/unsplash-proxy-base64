const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

const ACCESS_KEY = process.env.UNSPLASH_KEY;

app.get("/api/image", async (req, res) => {
  const query = req.query.q;
  if (!query || !ACCESS_KEY) {
    return res.status(400).json({ error: "Missing query or API key" });
  }

  try {
    const search = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${ACCESS_KEY}`);
    const data = await search.json();
    const imageUrl = data.results[0]?.urls?.regular;

    if (!imageUrl) return res.status(404).json({ error: "No image found" });

    const imageRes = await fetch(imageUrl);
    const buffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mime = imageRes.headers.get("content-type");

    res.json({ image: `data:${mime};base64,${base64}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch image", details: err.message });
  }
});

app.listen(PORT, () => console.log("Proxy base64 rodando na porta", PORT));
