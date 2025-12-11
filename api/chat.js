import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const response = await client.responses.create({
      model: 'gpt-4o',
      input: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    let reply = 'Sorry, I could not generate a response.';

    if (response.output && response.output[0] && response.output[0].content) {
      const first = response.output[0].content[0];
      if (first && first.text) {
        reply = first.text;
      }
    } else if (response.output_text) {
      reply = response.output_text;
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    return res
      .status(500)
      .json({ error: 'OpenAI error', detail: err.message || String(err) });
  }
}
