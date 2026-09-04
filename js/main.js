document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-enabled');
    const langSelect = document.getElementById('language-select');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    let currentLang = 'en';
    let translations = {};

    const certificates = [
        {
            title: { en: 'Intro to Machine Learning', sq: 'Hyrje në Machine Learning', zh: '机器学习入门' },
            issuer: { en: 'Kaggle', sq: 'Kaggle', zh: 'Kaggle' },
            link: 'https://www.kaggle.com/learn/certification/adimemeti/intro-to-machine-learning',
            img: 'assets/images/intorml.jpg',
            verify: true
        },
        {
            title: { en: 'Python & Data Science', sq: 'Python & Data Science', zh: 'Python 与数据科学' },
            issuer: { en: 'Tectigon Academy', sq: 'Tectigon Academy', zh: 'Tectigon Academy' },
            link: '',
            img: 'assets/images/p&ds.jpg',
            verify: false
        },
        {
            title: { en: 'Intermediate Machine Learning', sq: 'Machine Learning i Ndërmjetëm', zh: '中级机器学习' },
            issuer: { en: 'Kaggle', sq: 'Kaggle', zh: 'Kaggle' },
            link: 'https://www.kaggle.com/learn/certification/adimemeti/intermediate-machine-learning',
            img: 'assets/images/intermediateml.jpg',
            verify: true
        },
        {
            title: { en: 'Programming Fundamentals', sq: 'Bazat e Programimit', zh: '编程基础' },
            issuer: { en: 'PërProgramera', sq: 'PërProgramera', zh: 'PërProgramera' },
            link: '',
            img: 'assets/images/pp.jpg',
            verify: false
        }
    ];

    const badges = [
        {
            name: { en: 'Linux Unhatched', sq: 'Linux Unhatched', zh: 'Linux Unhatched' },
            issuer: { en: 'Cisco', sq: 'Cisco', zh: 'Cisco' },
            link: 'https://www.netacad.com/certificates/?issuanceId=703f2196-e6c1-4166-b3ec-2308c3247cfd',
            img: 'assets/images/badgelinux.png'
        },
        {
            name: { en: 'Python Essentials 1', sq: 'Python Essentials 1', zh: 'Python 基础 1' },
            issuer: { en: 'Cisco', sq: 'Cisco', zh: 'Cisco' },
            link: 'https://www.netacad.com/certificates/?issuanceId=ac453b94-15f4-44b9-ad51-d9aaffa4013e',
            img: 'assets/images/badgepythonessentials1.png'
        },
        {
            name: { en: 'Python Essentials 2', sq: 'Python Essentials 2', zh: 'Python 基础 2' },
            issuer: { en: 'Cisco', sq: 'Cisco', zh: 'Cisco' },
            link: 'https://www.netacad.com/certificates/?issuanceId=ac453b94-15f4-44b9-ad51-d9aaffa4013e',
            img: 'assets/images/badgepythonessentials2.png'
        },
        {
            name: { en: 'Generative AI Fundamentals', sq: 'Bazat e AI Gjenerative', zh: '生成式人工智能基础' },
            issuer: { en: 'Databricks', sq: 'Databricks', zh: 'Databricks' },
            link: 'https://credentials.databricks.com/33447a19-1008-467a-a568-5404fb36cdb1',
            img: 'assets/images/badgegenai.png'
        },
        {
            name: { en: 'Introduction to Data Science', sq: 'Hyrje në Shkencën e të Dhënave', zh: '数据科学入门' },
            issuer: { en: 'Cisco', sq: 'Cisco', zh: 'Cisco' },
            link: 'https://www.netacad.com/certificates/?issuanceId=a6c82f09-308e-476f-87bd-6563e1d8bb95',
            img: 'assets/images/badgeds.png'
        }
    ];

    const projects = [
        {
            title: { en: 'FinSightAI (In Progress)', sq: 'FinSightAI (Në proces)', zh: 'FinSightAI (进行中)' },
            desc: {
                en: 'An AI-powered financial analysis platform designed to provide deep insights into market trends and financial data using advanced machine learning models.',
                sq: 'Një platformë analitike financiare e fuqizuar nga AI, e dizajnuar për të ofruar njohuri të thella mbi trendet e tregut dhe të dhënat financiare duke përdorur modele të avancuara të machine learning.',
                zh: '一个由 AI 驱动的财务分析平台，旨在利用先进的机器学习模型提供对市场趋势和财务数据的深入洞察。'
            },
            tags: ['AI', 'Machine Learning', 'Python', 'Finance'],
            github: 'https://github.com/adimemetii/finsightai',
            demo: 'https://finsightai-3ea6.onrender.com/'
        },
        {
            title: { en: 'MS Doors and Windows', sq: 'MS Doors and Windows', zh: 'MS Doors and Windows' },
            desc: {
                en: 'A professional corporate website for MS Doors and Windows, focusing on high-performance UI/UX and responsive design to showcase architectural products.',
                sq: 'Një faqe web korporative profesionale për MS Doors and Windows, me fokus në UI/UX performuese dhe dizajn responsiv për të shfaqur produktet arkitekturore.',
                zh: '为 MS Doors and Windows 构建的专业企业网站，专注于高性能 UI/UX 和响应式设计，以展示建筑产品。'
            },
            tags: ['Responsive Design', 'Frontend', 'UI/UX'],
            github: 'https://github.com/adimemetii/MS-DOORS-WINDOWS',
            demo: 'https://msdoorsandwindows.netlify.app'
        },
        {
            title: { en: 'BioPackKos', sq: 'BioPackKos', zh: 'BioPackKos' },
            desc: {
                en: 'A comprehensive corporate web presence for BioPackKos, integrating modern web standards to promote eco-friendly packaging solutions.',
                sq: 'Një prezencë profesionale web për BioPackKos, duke integruar standardet moderne të web-it për të promovuar zgjidhjet e paketimit ekologjik.',
                zh: '为 BioPackKos 构建的全面企业网站，集成现代 Web 标准以推广环保包装解决方案。'
            },
            tags: ['Corporate Web', 'Eco-friendly', 'Frontend'],
            github: 'https://github.com/adimemetii/BioPackKos',
            demo: 'https://biopackkos.com'
        }
    ];

    async function loadTranslations(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            translations = await response.json();
            updateUI();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = translations;
            keys.forEach(k => {
                value = value[k];
            });
            el.textContent = value;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = translations.assistant.placeholder;
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            el.setAttribute('aria-label', translations.assistant.send);
        });

        renderSkills();
        renderProjects();
        renderCerts();
        renderBadges();
        updateChatbotLanguage();
    }

    const chatMessages = document.getElementById('chat-messages');
    const chatSuggestions = document.getElementById('chat-suggestions');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const clearChatButton = document.getElementById('clear-chat');
    let conversationHistory = [];
    let chatRequestInProgress = false;

    const chatbotSuggestions = {
        en: [
            ['What can you help me with?', 'Capabilities'],
            ['Who is Adi Memeti?', 'About Adi'],
            ['Explain machine learning simply.', 'Machine learning'],
            ['What are the latest trends in AI?', 'AI trends'],
            ['How can I contact Adi?', 'Contact']
        ],
        sq: [
            ['Me çfarë mund të më ndihmosh?', 'Aftësitë'],
            ['Kush është Adi Memeti?', 'Rreth Adit'],
            ['Shpjego machine learning thjesht.', 'Machine learning'],
            ['Cilat janë trendet e fundit në AI?', 'Trendet e AI'],
            ['Si mund ta kontaktoj Adin?', 'Kontakti']
        ],
        zh: [
            ['你可以帮助我什么？', '功能'],
            ['Adi Memeti 是谁？', '关于 Adi'],
            ['请简单解释机器学习。', '机器学习'],
            ['AI 的最新趋势是什么？', 'AI 趋势'],
            ['如何联系 Adi？', '联系方式']
        ]
    };

    function addChatMessage(role, text) {
        const message = document.createElement('div');
        message.className = `message ${role}`;
        message.textContent = text;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return message;
    }

    function updateChatbotLanguage() {
        if (!chatMessages || !chatSuggestions) return;
        chatSuggestions.innerHTML = '';
        const suggestions = chatbotSuggestions[currentLang] || chatbotSuggestions.en;
        suggestions.forEach(([question, label]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'suggestion-btn';
            button.textContent = label;
            button.addEventListener('click', () => sendChatMessage(question));
            chatSuggestions.appendChild(button);
        });
        chatMessages.innerHTML = '';
        conversationHistory = [];
        const greeting = currentLang === 'sq'
            ? 'Përshëndetje! Më bëj çdo pyetje.'
            : currentLang === 'zh' ? '你好！你可以问我任何问题。' : 'Hello! Ask me anything.';
        addChatMessage('assistant', greeting);
        if (chatInput) chatInput.placeholder = translations.assistant?.placeholder || 'Ask a question...';
    }

    clearChatButton?.addEventListener('click', updateChatbotLanguage);

    async function sendChatMessage(text) {
        if (!text.trim() || chatRequestInProgress) return;
        chatRequestInProgress = true;
        addChatMessage('user', text);
        conversationHistory.push({ role: 'user', content: text });
        chatInput.value = '';
        const typingMessage = addChatMessage('assistant', '...');

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory, lang: currentLang })
            });
            const responseText = await response.text();
            let data = {};
            try { data = JSON.parse(responseText); } catch { /* Keep the raw response below. */ }
            typingMessage.remove();
            if (!response.ok) throw new Error(data.error || responseText || `AI service returned ${response.status}`);
            if (!data.reply) throw new Error('The AI returned an empty response.');
            addChatMessage('assistant', data.reply);
            conversationHistory.push({ role: 'assistant', content: data.reply });
        } catch (error) {
            typingMessage.remove();
            addChatMessage('assistant', error.message || 'Unable to connect to the AI service.');
        } finally {
            chatRequestInProgress = false;
        }
    }

    chatForm?.addEventListener('submit', event => {
        event.preventDefault();
        sendChatMessage(chatInput.value);
    });

    function renderSkills() {
        const container = document.getElementById('skills-container');
        container.innerHTML = '';
        const skillData = translations.skills.categories;

        let index = 0;
        for (const key in skillData) {
            const cat = skillData[key];
            const card = document.createElement('div');
            // Make the first card 'featured' for the Bento grid effect
            const isFeatured = index === 0;
            card.className = `skill-card reveal ${isFeatured ? 'featured' : ''}`;
            card.innerHTML = `
                <div class="skill-card-header">
                    <h3 class="skill-category-title">${cat.title}</h3>
                    <div class="skill-category-icon"><i class="fas fa-layer-group"></i></div>
                </div>
                <div class="skill-list">
                    ${cat.items.map(item => `<span class="skill-item">${item}</span>`).join('')}
                </div>
            `;
            container.appendChild(card);
            index++;
        }
    }

    function renderProjects() {
        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        projects.forEach((proj, index) => {
            const gradients = [
                'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1))',
                'linear-gradient(135deg, rgba(192, 132, 252, 0.1), rgba(56, 189, 248, 0.1))',
                'linear-gradient(135deg, rgba(129, 140, 248, 0.1), rgba(192, 132, 252, 0.1))'
            ];
            const gradient = gradients[index % gradients.length];

            const card = document.createElement('div');
            card.className = 'project-card reveal';
            card.style.setProperty('--project-gradient', gradient);
            card.innerHTML = `
                <div class="project-visual">
                    <div class="project-glow"></div>
                    <i class="fas fa-rocket project-main-icon"></i>
                </div>
                <div class="project-info">
                    <div class="project-header">
                        <h3>${proj.title[currentLang]}</h3>
                        <div class="project-status ${proj.title[currentLang].includes('Progress') ? 'status-progress' : 'status-completed'}">${proj.title[currentLang].includes('Progress') ? 'In Progress' : 'Completed'}</div>
                    </div>
                    <p>${proj.desc[currentLang]}</p>
                    <div class="project-tags">
                        ${proj.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${proj.github}" target="_blank" class="btn btn-small btn-secondary"><i class="fab fa-github"></i> Code</a>
                        <a href="${proj.demo}" target="_blank" class="btn btn-small btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function renderCerts() {
        const container = document.getElementById('certs-container');
        container.innerHTML = '';

        certificates.forEach((cert, index) => {
            const isLast = index === certificates.length - 1;
            const card = document.createElement('div');
            card.className = `cert-card reveal ${isLast ? 'cert-last' : ''}`;
            card.innerHTML = `
                <img src="${cert.img}" alt="${cert.title[currentLang]}" class="cert-img">
                <h3>${cert.title[currentLang]}</h3>
                <p>${cert.issuer[currentLang]}</p>
                ${cert.verify ? `<a href="${cert.link}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-primary">${translations.certifications.verify}</a>` : ''}
            `;
            container.appendChild(card);
        });
    }

    function renderBadges() {
        const container = document.getElementById('badges-container');
        container.innerHTML = '';

        badges.forEach(badge => {
            const card = document.createElement('div');
            card.className = 'badge-card reveal';
            card.innerHTML = `
                <img src="${badge.img}" alt="${badge.name[currentLang]}" class="badge-img">
                <h3>${badge.name[currentLang]}</h3>
                <p>${badge.issuer[currentLang]}</p>
                <a href="${badge.link}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-secondary">${translations.badges.verify}</a>
            `;
            container.appendChild(card);
        });
    }

    // --- Rest of functionality ---
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
        mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            mobileMenuToggle.querySelector('i').classList.remove('fa-times');
        });
    });

    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        loadTranslations(currentLang);
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    function applyReveal() {
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }

    loadTranslations('en').then(() => {
        applyReveal();
    });
});
