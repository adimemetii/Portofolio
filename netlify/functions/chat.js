const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { messages, lang } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid messages format' }),
      };
    }

    const apiKey = process.env.OPENROUTE_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API Key not configured' }),
      };
    }

    const systemPrompts = {
      en: `You are the AI assistant for Adi Memeti's professional portfolio.
            Adi is a Data Scientist specializing in Machine Learning, Data Analytics, and Software Engineering.
            Your goal is to be a helpful, professional, and concise representative.
            Respond in English.`,
      sq: `Ju jeni asistenti AI për portofolin profesional të Adi Memeti.
            Adi është një Data Scientist i specializuar në Machine Learning, Analitikën e të Dhënave dhe Inxhinierinë e Softuerit.
            Qëllimi juaj është të jeni një përfaqësues ndihmues, profesional dhe konciz.
            Ktheuni përgjigje në gjuhën Shqipe.`,
      zh: `你是 Adi Memeti 专业作品集的 AI 助手。
            Adi 是一位专注于机器学习、数据分析和软件工程的数据科学家。
            你的目标是成为一名得力、专业且简洁的代表。
            请用中文回答。`
    };

    const systemPrompt = systemPrompts[lang] || systemPrompts.en;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://adimemeti.me',
        'X-Title': 'Adi Memeti Portfolio AI',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: `${systemPrompt}
            Use only the following information:
            - Skills: Python, SQL, Pandas, NumPy, Scikit-learn, Power BI, Data Cleaning, EDA, Git, GitHub.
            - Projects:
              1. FinSightAI: AI-powered financial analysis platform.
              2. MS Doors and Windows: Corporate website with high-performance UI/UX.
              3. BioPackKos: Corporate presence for eco-friendly packaging.
            - Certifications: Kaggle (Intro & Intermediate ML), Tectigon Academy (Python & Data Science), PërProgramera (Full Stack Web Dev).
            - Badges: Linux Unhatched, Python Essentials 1 & 2, Generative AI Fundamentals, Intro to Data Science.
            - Contact: adimemeti97@gmail.com, LinkedIn (adi-memeti-880b31237), GitHub (adimemetii).

            If a question is asked that is not covered by this information, politely state that you don't have that information but suggest they contact Adi via email or LinkedIn.`,
          },
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'OpenRouter API Error');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices[0].message.content,
      }),
    };
  } catch (error) {
    console.error('Chat Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
