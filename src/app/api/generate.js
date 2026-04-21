import OpenAI from "openai";

export default async function handler(req, res) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { topic, data } = req.body;

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Write a structured report.

Topic: ${topic}

Data:
${data}

Structure:
- Introduction
- Analysis
- Conclusion
`,
    });

    res.status(200).json({ result: response.output_text });
  } catch (error) {
    res.status(500).json({ error: "Error generating report" });
  }
}
