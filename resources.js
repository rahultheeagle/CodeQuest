class LearningResources {
    constructor() {
        this.tutorials = [
            {
                id: 1, title: 'HTML Basics Tutorial', description: 'Learn HTML from scratch with interactive examples',
                icon: '🏗️', difficulty: 'Beginner', duration: '30 min',
                steps: [
                    { title: 'What is HTML?', content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements and tags.' },
                    { title: 'Basic Structure', content: 'Every HTML document starts with <code>&lt;!DOCTYPE html&gt;</code> and contains <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, and <code>&lt;body&gt;</code> elements.' },
                    { title: 'Common Tags', content: 'Learn essential tags: <code>&lt;h1&gt;</code> for headings, <code>&lt;p&gt;</code> for paragraphs, <code>&lt;a&gt;</code> for links, and <code>&lt;img&gt;</code> for images.' },
                    { title: 'Attributes', content: 'HTML elements can have attributes that provide additional information. For example: <code>&lt;a href="url"&gt;</code> or <code>&lt;img src="image.jpg" alt="description"&gt;</code>' },
                    { title: 'Practice Time', content: 'Now try creating your first HTML page with a heading, paragraph, and link!' }
                ]
            },
            {
                id: 2, title: 'CSS Styling Guide', description: 'Master CSS properties and selectors',
                icon: '🎨', difficulty: 'Beginner', duration: '45 min',
                steps: [
                    { title: 'What is CSS?', content: 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and positioning.' },
                    { title: 'Selectors', content: 'CSS selectors target HTML elements: <code>h1</code> (element), <code>.class</code> (class), <code>#id</code> (ID).' },
                    { title: 'Properties', content: 'Common CSS properties: <code>color</code>, <code>font-size</code>, <code>margin</code>, <code>padding</code>, <code>background</code>.' },
                    { title: 'Box Model', content: 'Every element is a box with content, padding, border, and margin. Understanding this is crucial for layout.' },
                    { title: 'Practice', content: 'Style your HTML page with colors, fonts, and spacing!' }
                ]
            },
            {
                id: 3, title: 'JavaScript Fundamentals', description: 'Interactive programming with JavaScript',
                icon: '⚡', difficulty: 'Intermediate', duration: '60 min',
                steps: [
                    { title: 'What is JavaScript?', content: 'JavaScript is a programming language that makes web pages interactive. It can respond to user actions and modify content dynamically.' },
                    { title: 'Variables', content: 'Store data using <code>let</code>, <code>const</code>, or <code>var</code>: <code>let name = "CodeQuest";</code>' },
                    { title: 'Functions', content: 'Functions are reusable blocks of code: <code>function greet() { alert("Hello!"); }</code>' },
                    { title: 'DOM Manipulation', content: 'Change HTML content with JavaScript: <code>document.getElementById("demo").innerHTML = "New text";</code>' },
                    { title: 'Events', content: 'Respond to user actions: <code>button.addEventListener("click", function() { ... });</code>' }
                ]
            }
        ];

        this.snippets = [
            { id: 1, title: 'Basic HTML Template', category: 'html', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>' },
            { id: 2, title: 'Responsive Navigation', category: 'html', code: '<nav>\n    <ul>\n        <li><a href="#home">Home</a></li>\n        <li><a href="#about">About</a></li>\n        <li><a href="#contact">Contact</a></li>\n    </ul>\n</nav>' },
            { id: 3, title: 'CSS Reset', category: 'css', code: '* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: Arial, sans-serif;\n    line-height: 1.6;\n}' },
            { id: 4, title: 'Flexbox Center', category: 'css', code: '.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n}' },
            { id: 5, title: 'CSS Grid Layout', category: 'css', code: '.grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 20px;\n    padding: 20px;\n}' },
            { id: 6, title: 'DOM Element Selection', category: 'js', code: '// Select elements\nconst element = document.getElementById("myId");\nconst elements = document.querySelectorAll(".myClass");\nconst firstElement = document.querySelector("h1");' },
            { id: 7, title: 'Event Listener', category: 'js', code: 'const button = document.getElementById("myButton");\n\nbutton.addEventListener("click", function() {\n    alert("Button clicked!");\n});' },
            { id: 8, title: 'Fetch API', category: 'js', code: 'fetch("https://api.example.com/data")\n    .then(response => response.json())\n    .then(data => {\n        console.log(data);\n    })\n    .catch(error => {\n        console.error("Error:", error);\n    });' }
        ];

        this.cheatSheets = {
            html: [
                { section: 'Structure', items: [
                    { name: '<!DOCTYPE html>', desc: 'Document type declaration' },
                    { name: '<html>', desc: 'Root element' },
                    { name: '<head>', desc: 'Document metadata' },
                    { name: '<body>', desc: 'Document content' }
                ]},
                { section: 'Text Elements', items: [
                    { name: '<h1> to <h6>', desc: 'Headings' },
                    { name: '<p>', desc: 'Paragraph' },
                    { name: '<br>', desc: 'Line break' },
                    { name: '<strong>', desc: 'Bold text' }
                ]},
                { section: 'Links & Media', items: [
                    { name: '<a href="">', desc: 'Hyperlink' },
                    { name: '<img src="">', desc: 'Image' },
                    { name: '<video>', desc: 'Video content' },
                    { name: '<audio>', desc: 'Audio content' }
                ]}
            ],
            css: [
                { section: 'Selectors', items: [
                    { name: 'element', desc: 'Type selector' },
                    { name: '.class', desc: 'Class selector' },
                    { name: '#id', desc: 'ID selector' },
                    { name: 'element:hover', desc: 'Pseudo-class' }
                ]},
                { section: 'Layout', items: [
                    { name: 'display: flex', desc: 'Flexbox layout' },
                    { name: 'display: grid', desc: 'Grid layout' },
                    { name: 'position: relative', desc: 'Relative positioning' },
                    { name: 'float: left', desc: 'Float element' }
                ]},
                { section: 'Styling', items: [
                    { name: 'color: #333', desc: 'Text color' },
                    { name: 'background: #fff', desc: 'Background color' },
                    { name: 'font-size: 16px', desc: 'Font size' },
                    { name: 'margin: 10px', desc: 'Outer spacing' }
                ]}
            ],
            js: [
                { section: 'Variables', items: [
                    { name: 'let variable', desc: 'Block-scoped variable' },
                    { name: 'const constant', desc: 'Constant value' },
                    { name: 'var variable', desc: 'Function-scoped variable' },
                    { name: 'typeof variable', desc: 'Check data type' }
                ]},
                { section: 'Functions', items: [
                    { name: 'function name() {}', desc: 'Function declaration' },
                    { name: '() => {}', desc: 'Arrow function' },
                    { name: 'function() {}', desc: 'Anonymous function' },
                    { name: 'return value', desc: 'Return statement' }
                ]},
                { section: 'DOM', items: [
                    { name: 'getElementById()', desc: 'Select by ID' },
                    { name: 'querySelector()', desc: 'Select by CSS selector' },
                    { name: 'addEventListener()', desc: 'Add event listener' },
                    { name: 'innerHTML', desc: 'Get/set HTML content' }
                ]}
            ]
        };

        this.videos = [
            { id: 1, title: 'HTML Crash Course', description: 'Complete HTML tutorial for beginners', thumbnail: '🎬', url: 'https://www.youtube.com/embed/UB1O30fR-EE' },
            { id: 2, title: 'CSS Flexbox Tutorial', description: 'Master CSS Flexbox in 20 minutes', thumbnail: '📱', url: 'https://www.youtube.com/embed/JJSoEo8JSnc' },
            { id: 3, title: 'JavaScript DOM Manipulation', description: 'Learn to interact with HTML using JavaScript', thumbnail: '⚡', url: 'https://www.youtube.com/embed/0ik6X4DJKCc' },
            { id: 4, title: 'Responsive Web Design', description: 'Build websites that work on all devices', thumbnail: '📐', url: 'https://www.youtube.com/embed/srvUrASNdxk' }
        ];

        this.externalLinks = [
            { title: 'MDN Web Docs', description: 'Comprehensive web development documentation', icon: '📚', url: 'https://developer.mozilla.org/' },
            { title: 'W3Schools', description: 'Web development tutorials and references', icon: '🎓', url: 'https://www.w3schools.com/' },
            { title: 'CSS-Tricks', description: 'Tips, tricks, and techniques on CSS', icon: '🎨', url: 'https://css-tricks.com/' },
            { title: 'JavaScript.info', description: 'Modern JavaScript tutorial', icon: '⚡', url: 'https://javascript.info/' },
            { title: 'Can I Use', description: 'Browser compatibility tables', icon: '🌐', url: 'https://caniuse.com/' },
            { title: 'CodePen', description: 'Online code editor and community', icon: '✏️', url: 'https://codepen.io/' }
        ];

        this.glossary = [
            { term: 'API', definition: 'Application Programming Interface - a set of protocols and tools for building software applications.' },
            { term: 'CSS', definition: 'Cascading Style Sheets - a language used to describe the presentation of HTML documents.' },
            { term: 'DOM', definition: 'Document Object Model - a programming interface for HTML documents that represents the page structure.' },
            { term: 'HTML', definition: 'HyperText Markup Language - the standard markup language for creating web pages.' },
            { term: 'JavaScript', definition: 'A programming language that enables interactive web pages and dynamic content.' },
            { term: 'Responsive Design', definition: 'An approach to web design that makes pages render well on various devices and screen sizes.' },
            { term: 'Flexbox', definition: 'A CSS layout method for arranging items in rows or columns with flexible sizing.' },
            { term: 'Grid', definition: 'A CSS layout system for creating complex responsive layouts with rows and columns.' },
            { term: 'Semantic HTML', definition: 'HTML that uses meaningful tags to describe content structure and purpose.' },
            { term: 'Event Listener', definition: 'A JavaScript function that waits for and responds to specific events like clicks or key presses.' }
        ];

        this.currentTutorial = null;
        this.currentStep = 0;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.renderTutorials();
        this.renderSnippets();
        this.renderCheatSheet('html');
        this.renderVideos();
        this.renderExternalLinks();
        this.renderGlossary();
        this.setupTutorialModal();
        this.setupSearch();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(btn.dataset.section).classList.add('active');
            });
        });
    }

    renderTutorials() {
        const container = document.getElementById('tutorialsGrid');
        container.innerHTML = '';
        
        this.tutorials.forEach(tutorial => {
            const card = document.createElement('div');
            card.className = 'tutorial-card';
            card.innerHTML = `
                <div class="tutorial-icon">${tutorial.icon}</div>
                <h3>${tutorial.title}</h3>
                <p>${tutorial.description}</p>
                <div class="tutorial-meta">
                    <span>📊 ${tutorial.difficulty}</span>
                    <span>⏱️ ${tutorial.duration}</span>
                </div>
            `;
            
            card.addEventListener('click', () => {
                this.startTutorial(tutorial);
            });
            
            container.appendChild(card);
        });
    }

    renderSnippets() {
        const container = document.getElementById('snippetsGrid');
        const categoryFilter = document.getElementById('snippetCategory');
        const searchInput = document.getElementById('snippetSearch');
        
        const renderSnippetsList = () => {
            const category = categoryFilter.value;
            const search = searchInput.value.toLowerCase();
            
            const filtered = this.snippets.filter(snippet => {
                const matchesCategory = category === 'all' || snippet.category === category;
                const matchesSearch = snippet.title.toLowerCase().includes(search) || 
                                    snippet.code.toLowerCase().includes(search);
                return matchesCategory && matchesSearch;
            });
            
            container.innerHTML = '';
            
            filtered.forEach(snippet => {
                const card = document.createElement('div');
                card.className = 'snippet-card';
                card.innerHTML = `
                    <div class="snippet-header">
                        <h4>${snippet.title}</h4>
                        <button class="copy-btn" onclick="this.copyCode('${snippet.id}')">Copy</button>
                    </div>
                    <div class="snippet-code">${this.escapeHtml(snippet.code)}</div>
                `;
                
                const copyBtn = card.querySelector('.copy-btn');
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(snippet.code);
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => copyBtn.textContent = 'Copy', 2000);
                });
                
                container.appendChild(card);
            });
        };
        
        categoryFilter.addEventListener('change', renderSnippetsList);
        searchInput.addEventListener('input', renderSnippetsList);
        
        renderSnippetsList();
    }

    renderCheatSheet(lang) {
        const container = document.getElementById('cheatsheetContent');
        const sections = this.cheatSheets[lang];
        
        container.innerHTML = '';
        
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'cheat-section';
            sectionDiv.innerHTML = `
                <h4>${section.section}</h4>
                ${section.items.map(item => `
                    <div class="cheat-item">
                        <span>${item.name}</span>
                        <span>${item.desc}</span>
                    </div>
                `).join('')}
            `;
            container.appendChild(sectionDiv);
        });
        
        // Setup tab switching
        document.querySelectorAll('.cheat-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.cheat-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderCheatSheet(tab.dataset.lang);
            });
        });
    }

    renderVideos() {
        const container = document.getElementById('videosGrid');
        container.innerHTML = '';
        
        this.videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.innerHTML = `
                <div class="video-thumbnail" onclick="this.openVideo('${video.url}')">${video.thumbnail}</div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                </div>
            `;
            
            const thumbnail = card.querySelector('.video-thumbnail');
            thumbnail.addEventListener('click', () => {
                window.open(video.url, '_blank');
            });
            
            container.appendChild(card);
        });
    }

    renderExternalLinks() {
        const container = document.getElementById('linksGrid');
        container.innerHTML = '';
        
        this.externalLinks.forEach(link => {
            const card = document.createElement('a');
            card.className = 'link-card';
            card.href = link.url;
            card.target = '_blank';
            card.innerHTML = `
                <div class="link-icon">${link.icon}</div>
                <h4>${link.title}</h4>
                <p>${link.description}</p>
            `;
            container.appendChild(card);
        });
    }

    renderGlossary() {
        const container = document.getElementById('glossaryContent');
        const searchInput = document.getElementById('glossarySearch');
        
        const renderGlossaryList = () => {
            const search = searchInput.value.toLowerCase();
            const filtered = this.glossary.filter(item => 
                item.term.toLowerCase().includes(search) || 
                item.definition.toLowerCase().includes(search)
            );
            
            container.innerHTML = '';
            
            filtered.forEach(item => {
                const div = document.createElement('div');
                div.className = 'glossary-item';
                div.innerHTML = `
                    <div class="glossary-term">${item.term}</div>
                    <div class="glossary-definition">${item.definition}</div>
                `;
                container.appendChild(div);
            });
        };
        
        searchInput.addEventListener('input', renderGlossaryList);
        renderGlossaryList();
    }

    setupTutorialModal() {
        document.getElementById('closeTutorial').addEventListener('click', () => {
            document.getElementById('tutorialModal').style.display = 'none';
        });
        
        document.getElementById('prevStep').addEventListener('click', () => {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.updateTutorialStep();
            }
        });
        
        document.getElementById('nextStep').addEventListener('click', () => {
            if (this.currentStep < this.currentTutorial.steps.length - 1) {
                this.currentStep++;
                this.updateTutorialStep();
            }
        });
        
        document.getElementById('completeTutorial').addEventListener('click', () => {
            alert('Tutorial completed! 🎉');
            document.getElementById('tutorialModal').style.display = 'none';
        });
    }

    startTutorial(tutorial) {
        this.currentTutorial = tutorial;
        this.currentStep = 0;
        
        document.getElementById('tutorialTitle').textContent = tutorial.title;
        document.getElementById('tutorialModal').style.display = 'flex';
        
        this.updateTutorialStep();
    }

    updateTutorialStep() {
        const step = this.currentTutorial.steps[this.currentStep];
        const totalSteps = this.currentTutorial.steps.length;
        
        document.getElementById('tutorialStep').innerHTML = `
            <h4>${step.title}</h4>
            <p>${step.content}</p>
        `;
        
        document.getElementById('progressText').textContent = `Step ${this.currentStep + 1} of ${totalSteps}`;
        document.getElementById('tutorialProgress').style.width = `${((this.currentStep + 1) / totalSteps) * 100}%`;
        
        document.getElementById('prevStep').disabled = this.currentStep === 0;
        document.getElementById('nextStep').style.display = this.currentStep === totalSteps - 1 ? 'none' : 'block';
        document.getElementById('completeTutorial').style.display = this.currentStep === totalSteps - 1 ? 'block' : 'none';
    }

    setupSearch() {
        // Search functionality is already implemented in renderSnippets and renderGlossary
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize learning resources
const learningResources = new LearningResources();