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
    const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OPENROUTER_API_KEY is not configured in Netlify.' })
      };
    }

    if (!messages.length || messages.length > 30) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Please provide between 1 and 30 messages.' })
      };
    }

    const language = { en: 'English', sq: 'Albanian', zh: 'Chinese' }[lang];
    const systemPrompt = `You are the helpful AI assistant on Adi Memeti's portfolio. Answer general questions clearly and accurately, not only portfolio questions. You may explain topics, write or debug code, summarize text, brainstorm, translate, and answer current-information questions when web search results are provided. Respond in ${language}. Do not claim live web access unless search results are included. For questions about Adi, use this verified information: Adi is a Data Scientist focused on Machine Learning and Data Analytics. Skills include Python, SQL, Pandas, NumPy, Scikit-learn, Power BI, Tableau, Data Cleaning, EDA, Git, and GitHub. Projects include FinSightAI, MS Doors and Windows, and BioPackKos. Contact: adimemeti97@gmail.com, LinkedIn adi-memeti-880b31237, GitHub adimemetii.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://adimemeti.me',
        'X-Title': 'Adi Memeti Portfolio AI'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openrouter/auto',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        plugins: [{ id: 'web', max_results: 3 }],
        temperature: 0.4
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
