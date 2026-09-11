exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const lang = ['en', 'sq', 'zh'].includes(body.lang) ? body.lang : 'en';
    const apiKey = (process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY || '').trim();

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API Key is not configured in Netlify.' })
      };
    }

    if (!messages.length || messages.length > 30) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Please provide between 1 and 30 messages.' })
      };
    }

    const language = { en: 'English', sq: 'Albanian', zh: 'Chinese' }[lang];
    const systemPrompt = `You are the premium AI assistant for Adi Memeti's portfolio.

STRICT GUIDELINES:
1. FOCUS: Prioritize questions about Adi's skills, projects (FinSightAI, MS Doors and Windows, BioPackKos), education, and experience.
2. GUARDRAIL: If a query is unrelated to Adi or his professional background, politely redirect using: "I'm mainly here to answer questions about Adi, his projects, skills, experience and this portfolio."
3. BREVITY: Responses MUST be concise. Limit each answer to 1-4 sentences.
4. TONE: Professional, helpful, and efficient.
5. LANGUAGE: Respond in ${language}.

VERIFIED DATA:
- Adi is a Data Scientist focused on Machine Learning and Data Analytics.
- Skills: Python, SQL, Pandas, NumPy, Scikit-learn, Power BI, Tableau, Data Cleaning, EDA, Git, GitHub.
- Projects: FinSightAI (AI financial analysis), MS Doors and Windows (Corporate site), BioPackKos (Eco-friendly packaging site).
- Contact: adimemeti97@gmail.com, LinkedIn adi-memeti-880b31237, GitHub adimemetii.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || process.env.OPENROUTER_MODEL || 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.4,
        max_tokens: 150
      })
    });

    const responseText = await response.text();
    let data = {};
    try {
      data = JSON.parse(responseText);
    } catch {
      data = {};
    }

    if (!response.ok || data.error) {
      const error = new Error(data.error?.message || responseText || `OpenRouter returned ${response.status}`);
      error.statusCode = response.status === 401 ? 401 : 502;
      throw error;
    }

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error('The AI returned an empty response.');

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error('Chat Error:', error.message);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};
