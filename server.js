const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create OpenAI client using the backend env var
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: 'No message provided' });
    }

    // Use input for the Responses API
    const response = await client.responses.create({
      model: 'gpt-4o',
      input: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Safely extract text
    let reply = 'Sorry, I could not generate a response.';
    if (response.output && response.output[0] && response.output[0].content) {
      const first = response.output[0].content[0];
      if (first && first.text) {
        reply = first.text;
      }
    } else if (response.output_text) {
      reply = response.output_text;
    }

    return res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    // For now, send back the error message so you can see what’s going on
    return res.json({
      reply: 'Server error: ' + (err?.message || 'Unknown error'),
    });
  }
});

// Backend listens on port 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
