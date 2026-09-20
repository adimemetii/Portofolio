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
    const systemPrompt = `You are Adi Memeti's portfolio assistant. Answer only questions about Adi's portfolio, projects, skills, education, experience, certifications, technologies, and contact details.

GUIDELINES:
1. PERSONALITY: Be elegant, professional, and engaging. You aren't just a bot; you are a digital representative of Adi.
2. KNOWLEDGE: Use only the provided "VERIFIED DATA" and the visitor's question. If information is missing, say it is not currently listed in the portfolio.
3. NAVIGATION: If the user asks to open or go to a section, start your response with exactly one tag. Use the exact mapping: about/Rreth/关于 -> \`[NAV: #about]\`; skills/aftësitë/技能 -> \`[NAV: #skills]\`; projects/projektet/项目 -> \`[NAV: #projects]\`; certifications/certifikimet/证书 -> \`[NAV: #certifications]\`; badges/badge-et/徽章 -> \`[NAV: #badges]\`; CV/rezume/简历 -> \`[NAV: #cv]\`; contact/kontakti/联系 -> \`[NAV: #contact]\`; home/kreu/首页 -> \`[NAV: #home]\`. Never substitute one section for another. For example: "\`[NAV: #badges]\` Po të dërgoj te badge-et profesionale."
4. SCOPE: For unrelated questions such as current events, weather, politics, general coding tasks, or recipes, do not answer the unrelated request. Reply briefly: "I'm here to answer questions about Adi's portfolio, projects, skills, education, and experience."
5. ACCURACY: Never invent dates, employers, projects, qualifications, technologies, achievements, or personal information. Treat current education as present/current and do not infer a start date or graduation date.
6. STRUCTURE: Give a direct, moderately sized answer in 2-5 short paragraphs or concise bullets when useful. Avoid long introductions, repetition, and one-word answers.
7. LANGUAGE: Always respond in ${language}.

VERIFIED DATA:
- WHO IS ADI: A dedicated Data Scientist specializing in Machine Learning and Data Analytics, passionate about turning complex data into actionable insights. He is based in Gjilan, Kosovo, and works remotely for a company located in Prishtina.
- CURRENT EDUCATION: University of Prishtina, Faculty of Electrical and Computer Engineering (FIEK), Computer & Software Engineering. Adi is currently studying there; no start date or graduation date is listed.
- EXPERTISE:
  * Programming & Backend: Expert in Python, SQL, Flask, and FastAPI; practical experience with Pandas, NumPy, and Scikit-learn.
  * Visualization: Advanced use of Power BI and Tableau.
  * Process: Skilled in Data Cleaning, Exploratory Data Analysis (EDA), and version control with Git/GitHub.
- KEY PROJECTS:
  * FinSightAI: A sophisticated AI-driven financial analysis tool.
  * MS Doors and Windows: A professional corporate website.
  * BioPackKos: An innovative site for eco-friendly packaging solutions.
  * CryptoVison: A completed AI project with a live demo and public GitHub repository.
- CERTIFICATIONS:
  * Intro to Machine Learning (Kaggle)
  * Python & Data Science (Tectigon Academy)
  * Intermediate Machine Learning (Kaggle)
  * Programming Fundamentals (PërProgramera)
- PROFESSIONAL BADGES:
  * Linux Unhatched (Cisco)
  * Python Essentials 1 & 2 (Cisco)
  * Generative AI Fundamentals (Databricks)
  * Introduction to Data Science (Cisco)
- EXPERIENCE: Significant practical experience at Tectigon Academy, where he continues to refine his skills and contribute to real-world projects.
- CONTACT:
  * Email: adimemeti97@gmail.com
  * LinkedIn: adi-memeti-880b31237
  * GitHub: adimemetii
  * Phone: +38348240869`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.25,
        max_tokens: 360
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
