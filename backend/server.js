import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://w7vivek.github.io"
  ]
}));
app.use(express.json());

const OR_API_KEY = "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"; // real key
const OR_MODEL = "mistralai/devstral-2512:free";

app.post("/api/reply", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("📩 /api/reply hit with prompt length:", prompt?.length);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OR_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AI Chat App",
        },
        body: JSON.stringify({
          model: OR_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are an expert software engineer and coding tutor. You can help with many technologies including Java, Python, JavaScript, MERN stack, PHP, C/C++, C#, SQL, HTML, CSS, XML, machine learning, data structures and algorithms, system design, and more. Explain clearly with short code examples.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 880,
          temperature: 0.4,
        }),
      }
    );

    const data = await response.json();
    console.log("OpenRouter status:", response.status);
    console.log("OpenRouter data:", data);
    console.log("OR_API_KEY loaded?", !!OR_API_KEY);

    if (!response.ok) {
  return res.status(response.status).json({
    error: data.error?.message || "OpenRouter error",
  });
}

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "AI did not return a reply.";

    return res.json({ reply });
  } catch (err) {
    console.error("OpenRouter error:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`AI proxy running on http://localhost:${PORT}`);
});
