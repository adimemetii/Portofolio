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

    // Try every possible variation of the name 'portofolio' and common API keys
    const apiKey = (
        process.env.groq_api_key ||
        process.env.GROQ_API_KEY ||
        process.env.PORTOFOLIO_API_KEY ||
        process.env.portofolio ||
        process.env.PORTOFOLIO ||
        process.env.portfolio ||
        process.env.PORTFOLIO ||
        ''
    ).trim();

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'CRITICAL: API Key not found. I checked for "portofolio", "PORTOFOLIO", "portfolio", etc. Please check Netlify Environment Variables.'
        })
      };
    }

    if (!messages.length || messages.length > 30) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Please provide between 1 and 30 messages.' })
      };
    }

    const language = { en: 'English', sq: 'Albanian', zh: 'Chinese' }[lang];
    const systemPrompt = `You are a sophisticated, high-end AI ambassador representing Adi Memeti. Your goal is to showcase Adi's expertise and professionalism to recruiters and collaborators.

GUIDELINES:
1. PERSONALITY: Be elegant, professional, and engaging. You aren't just a bot; you are a digital representative of Adi.
2. KNOWLEDGE: Use the provided "VERIFIED DATA" to answer questions. If a question is slightly outside the data but relates to Data Science or professional growth, use your general knowledge to bridge the gap while keeping it centered on Adi's profile.
3. GUARDRAIL: Only redirect users if the question is completely irrelevant (e.g., asking for a cooking recipe). In those cases, be polite and steer the conversation back to Adi's professional world.
4. STRUCTURE: Be concise but comprehensive. Avoid one-word answers. Provide enough detail to impress the visitor, typically 2-5 sentences.
5. LANGUAGE: Always respond in ${language}.

VERIFIED DATA:
- WHO IS ADI: A dedicated Data Scientist specializing in Machine Learning and Data Analytics, passionate about turning complex data into actionable insights.
- EXPERTISE:
  * Programming & Tools: Expert in Python, SQL, Pandas, NumPy, Scikit-learn.
  * Visualization: Advanced use of Power BI and Tableau.
  * Process: Skilled in Data Cleaning, Exploratory Data Analysis (EDA), and version control with Git/GitHub.
- KEY PROJECTS:
  * FinSightAI: A sophisticated AI-driven financial analysis tool.
  * MS Doors and Windows: A professional corporate website.
  * BioPackKos: An innovative site for eco-friendly packaging solutions.
- EXPERIENCE: Significant practical experience at Tectigon Academy, where he continues to refine his skills and contribute to real-world projects.
- CONTACT:
  * Email: adimemeti97@gmail.com
  * LinkedIn: adi-memeti-880b31237
  * GitHub: adimemetii.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 500
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
