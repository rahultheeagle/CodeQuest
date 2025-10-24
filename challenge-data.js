const challengeData = {
    html: [
        {
            id: 1, title: "Basic HTML Structure", description: "Create a basic HTML document with head and body", 
            difficulty: "easy", xp: 10,
            requirements: ["Create DOCTYPE declaration", "Add html, head, and body tags", "Include a title element"],
            hint: "Start with <!DOCTYPE html> and remember the basic structure: html > head + body",
            solution: {
                html: "<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>",
                css: "", js: ""
            },
            validation: (code) => code.html.includes('<!DOCTYPE html>') && code.html.includes('<html>') && code.html.includes('<head>') && code.html.includes('<body>') && code.html.includes('<title>')
        },
        {
            id: 2, title: "Headings and Paragraphs", description: "Use different heading levels and paragraphs",
            difficulty: "easy", xp: 15,
            requirements: ["Use h1, h2, h3 headings", "Add multiple paragraphs", "Include proper text content"],
            hint: "Use <h1> for main title, <h2> for subtitles, and <p> for paragraphs",
            solution: {
                html: "<h1>Main Title</h1>\n<h2>Subtitle</h2>\n<h3>Section</h3>\n<p>First paragraph.</p>\n<p>Second paragraph.</p>",
                css: "", js: ""
            },
            validation: (code) => code.html.includes('<h1>') && code.html.includes('<h2>') && code.html.includes('<h3>') && code.html.includes('<p>')
        },
        {
            id: 3, title: "Lists and Links", description: "Create ordered and unordered lists with links",
            difficulty: "medium", xp: 20,
            requirements: ["Create ul and ol lists", "Add list items", "Include anchor tags with href"],
            hint: "Use <ul> for bullet points, <ol> for numbered lists, and <a href='#'> for links",
            solution: {
                html: "<ul>\n  <li><a href='#'>Link 1</a></li>\n  <li><a href='#'>Link 2</a></li>\n</ul>\n<ol>\n  <li>First item</li>\n  <li>Second item</li>\n</ol>",
                css: "", js: ""
            },
            validation: (code) => code.html.includes('<ul>') && code.html.includes('<ol>') && code.html.includes('<li>') && code.html.includes('<a href')
        }
    ],
    css: [
        {
            id: 1, title: "CSS Selectors", description: "Use different CSS selectors",
            difficulty: "easy", xp: 10,
            requirements: ["Element selectors", "Class selectors", "ID selectors"],
            hint: "Use element names, .class-name, and #id-name as selectors",
            solution: {
                html: "<div id='main' class='container'>\n  <h1>Title</h1>\n  <p class='text'>Content</p>\n</div>",
                css: "h1 { color: blue; }\n.container { padding: 20px; }\n#main { background: #f0f0f0; }\n.text { font-size: 16px; }",
                js: ""
            },
            validation: (code) => code.css.includes('h1') && code.css.includes('.') && code.css.includes('#')
        },
        {
            id: 2, title: "Colors and Fonts", description: "Style text with colors and fonts",
            difficulty: "easy", xp: 15,
            requirements: ["Set text colors", "Change font family", "Adjust font size"],
            hint: "Use color, font-family, and font-size properties",
            solution: {
                html: "<h1>Styled Text</h1>\n<p>This is styled content.</p>",
                css: "h1 { color: #333; font-family: Arial; font-size: 24px; }\np { color: #666; font-family: Georgia; font-size: 16px; }",
                js: ""
            },
            validation: (code) => code.css.includes('color:') && code.css.includes('font-family') && code.css.includes('font-size')
        }
    ],
    js: [
        {
            id: 1, title: "Variables and Data Types", description: "Learn JavaScript variables",
            difficulty: "easy", xp: 10,
            requirements: ["Declare variables", "Use different data types", "Console.log output"],
            hint: "Use let, const for variables. Try string, number, boolean types",
            solution: {
                html: "<div id='output'></div>",
                css: "body { font-family: Arial; padding: 20px; }",
                js: "let name = 'CodeQuest';\nlet score = 100;\nlet isActive = true;\nconsole.log(name, score, isActive);"
            },
            validation: (code) => code.js.includes('let') && code.js.includes('console.log')
        }
    ],
    projects: [
        {
            id: 1, title: "Personal Portfolio", description: "Build a complete personal portfolio website",
            difficulty: "hard", xp: 100,
            requirements: ["HTML structure", "CSS styling", "Responsive design", "JavaScript interactions"],
            hint: "Start with header, main sections (about, projects, contact), and footer",
            solution: {
                html: "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Portfolio</title>\n</head>\n<body>\n  <header><h1>John Doe</h1></header>\n  <main>\n    <section id='about'><h2>About</h2></section>\n    <section id='projects'><h2>Projects</h2></section>\n  </main>\n</body>\n</html>",
                css: "body { font-family: Arial; margin: 0; }\nheader { background: #333; color: white; padding: 20px; text-align: center; }\nsection { padding: 20px; }",
                js: "console.log('Portfolio loaded');"
            },
            validation: (code) => code.html.includes('<header>') && code.html.includes('<section>') && code.css.includes('padding') && code.js.length > 10
        }
    ]
};

const challengeAttempts = {};
const challengeHints = {};