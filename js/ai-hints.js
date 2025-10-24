// AI Hints System (Mock Implementation)
class AIHints {
    constructor() {
        this.apiKey = null; // Set your OpenAI API key here
        this.mockMode = true; // Set to false when using real API
    }

    // Get AI-powered hint for challenge
    async getHint(challenge, userCode, attemptCount = 1) {
        if (this.mockMode) {
            return this.getMockHint(challenge, userCode, attemptCount);
        }
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a coding tutor. Provide helpful, encouraging hints for web development challenges. Keep responses under 100 words.'
                        },
                        {
                            role: 'user',
                            content: `Challenge: ${challenge.description}\nUser's code: ${userCode}\nAttempt: ${attemptCount}\nPlease provide a helpful hint.`
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return {
                hint: data.choices[0].message.content,
                confidence: 0.9,
                source: 'ai'
            };
        } catch (error) {
            console.error('AI Hint error:', error);
            return this.getMockHint(challenge, userCode, attemptCount);
        }
    }

    // Mock AI hints for demo
    getMockHint(challenge, userCode, attemptCount) {
        const hints = {
            html: [
                "Remember to use proper HTML tags with opening and closing brackets.",
                "Check if you're using the correct element for the task.",
                "Make sure your text content is between the opening and closing tags.",
                "HTML elements should be properly nested and closed."
            ],
            css: [
                "CSS properties need a colon (:) between property and value.",
                "Don't forget the semicolon (;) at the end of each CSS rule.",
                "Check if you're targeting the right selector.",
                "CSS values often need units like 'px', '%', or specific keywords."
            ],
            javascript: [
                "JavaScript is case-sensitive - check your spelling and capitalization.",
                "Make sure you're using the correct syntax for functions and methods.",
                "Don't forget parentheses () for function calls.",
                "Check if you need quotes around string values."
            ]
        };

        const categoryHints = hints[challenge.category] || hints.html;
        const baseHint = categoryHints[Math.min(attemptCount - 1, categoryHints.length - 1)];
        
        // Add personalized touch based on attempt count
        let personalizedHint = baseHint;
        if (attemptCount > 2) {
            personalizedHint = "You're getting close! " + baseHint + " Take your time and review the requirements.";
        } else if (attemptCount === 1) {
            personalizedHint = "Great start! " + baseHint;
        }

        return {
            hint: personalizedHint,
            confidence: 0.8,
            source: 'mock-ai',
            category: challenge.category
        };
    }

    // Get code explanation
    async explainCode(code, language) {
        if (this.mockMode) {
            return this.getMockExplanation(code, language);
        }
        
        // Real API implementation would go here
        return this.getMockExplanation(code, language);
    }

    getMockExplanation(code, language) {
        const explanations = {
            html: "This HTML code creates structure for a web page using elements and tags.",
            css: "This CSS code defines styling rules to control the appearance of HTML elements.",
            javascript: "This JavaScript code adds interactive behavior and functionality to the web page."
        };

        return {
            explanation: explanations[language] || "This code defines web content and behavior.",
            suggestions: [
                "Consider adding comments to explain complex parts",
                "Make sure your code follows best practices",
                "Test your code in different browsers"
            ]
        };
    }

    // Smart error detection
    detectCommonErrors(code, language) {
        const errors = [];
        
        switch (language) {
            case 'html':
                if (!code.includes('<') || !code.includes('>')) {
                    errors.push("Missing HTML tags - use < and > to create elements");
                }
                if (code.includes('<h1>') && !code.includes('</h1>')) {
                    errors.push("Unclosed h1 tag - don't forget the closing tag");
                }
                break;
                
            case 'css':
                if (!code.includes(':')) {
                    errors.push("Missing colon (:) in CSS property-value pairs");
                }
                if (!code.includes(';')) {
                    errors.push("Missing semicolon (;) at end of CSS rules");
                }
                break;
                
            case 'javascript':
                if (code.includes('function') && !code.includes('()')) {
                    errors.push("Function syntax error - check parentheses");
                }
                if (code.includes('=') && !code.includes(';')) {
                    errors.push("Missing semicolon (;) at end of statements");
                }
                break;
        }
        
        return errors;
    }
}

// Initialize
window.aiHints = new AIHints();