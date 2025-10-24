// Advanced Validation System
class Validation {
    static validateChallenge(challenge, userCode) {
        try {
            const result = this.runTestCases(challenge, userCode);
            return {
                valid: result.score >= 0.7, // 70% threshold for pass
                score: result.score,
                message: result.message,
                xp: Math.floor(challenge.xp * result.score),
                details: result.details
            };
        } catch (error) {
            return { valid: false, score: 0, message: 'Validation error: ' + error.message, xp: 0 };
        }
    }

    static runTestCases(challenge, userCode) {
        const tests = challenge.testCases || this.generateTestCases(challenge);
        let passedTests = 0;
        const details = [];

        tests.forEach((test, index) => {
            try {
                const passed = this.runSingleTest(test, userCode, challenge.category);
                if (passed) passedTests++;
                details.push({ test: test.name, passed, message: test.message });
            } catch (error) {
                details.push({ test: test.name, passed: false, message: error.message });
            }
        });

        const score = tests.length > 0 ? passedTests / tests.length : 0;
        return {
            score,
            message: this.getScoreMessage(score, passedTests, tests.length),
            details
        };
    }

    static runSingleTest(test, userCode, category) {
        switch (category) {
            case 'html': return this.testHTML(test, userCode);
            case 'css': return this.testCSS(test, userCode);
            case 'javascript': return this.testJavaScript(test, userCode);
            default: return false;
        }
    }

    static testHTML(test, userCode) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(userCode, 'text/html');
        
        switch (test.type) {
            case 'element_exists':
                return doc.querySelector(test.selector) !== null;
            case 'element_count':
                return doc.querySelectorAll(test.selector).length === test.expected;
            case 'text_content':
                const el = doc.querySelector(test.selector);
                return el && el.textContent.trim() === test.expected;
            case 'attribute_exists':
                const elem = doc.querySelector(test.selector);
                return elem && elem.hasAttribute(test.attribute);
            case 'attribute_value':
                const element = doc.querySelector(test.selector);
                return element && element.getAttribute(test.attribute) === test.expected;
            case 'contains_text':
                return userCode.toLowerCase().includes(test.expected.toLowerCase());
            default:
                return test.validator ? test.validator(userCode, doc) : false;
        }
    }

    static testCSS(test, userCode) {
        const normalizedCode = userCode.replace(/\s+/g, ' ').toLowerCase();
        
        switch (test.type) {
            case 'property_exists':
                return normalizedCode.includes(test.property + ':');
            case 'property_value':
                const regex = new RegExp(test.property + '\\s*:\\s*' + test.expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                return regex.test(userCode);
            case 'selector_exists':
                return normalizedCode.includes(test.selector.toLowerCase());
            case 'contains_rule':
                return normalizedCode.includes(test.rule.toLowerCase());
            case 'valid_syntax':
                try {
                    const style = document.createElement('style');
                    style.textContent = userCode;
                    document.head.appendChild(style);
                    document.head.removeChild(style);
                    return true;
                } catch { return false; }
            default:
                return test.validator ? test.validator(userCode) : false;
        }
    }

    static testJavaScript(test, userCode) {
        switch (test.type) {
            case 'function_exists':
                return userCode.includes('function ' + test.name) || userCode.includes(test.name + ' =');
            case 'method_called':
                return userCode.includes(test.method + '(');
            case 'variable_declared':
                return userCode.includes('let ' + test.name) || userCode.includes('const ' + test.name) || userCode.includes('var ' + test.name);
            case 'contains_keyword':
                return userCode.includes(test.keyword);
            case 'syntax_valid':
                try { new Function(userCode); return true; } catch { return false; }
            case 'output_matches':
                return this.testJSOutput(userCode, test.expected);
            default:
                return test.validator ? test.validator(userCode) : false;
        }
    }

    static testJSOutput(code, expected) {
        try {
            let output = '';
            const mockConsole = { log: (msg) => output += String(msg) };
            const func = new Function('console', code);
            func(mockConsole);
            return output.trim() === String(expected).trim();
        } catch { return false; }
    }

    static generateTestCases(challenge) {
        const tests = [];
        
        // Generate basic test cases based on challenge requirements
        if (challenge.requiredElements) {
            challenge.requiredElements.forEach(element => {
                tests.push({
                    name: `Contains ${element} element`,
                    type: 'element_exists',
                    selector: element,
                    message: `Missing ${element} element`
                });
            });
        }

        if (challenge.requiredProperties) {
            challenge.requiredProperties.forEach(prop => {
                tests.push({
                    name: `Uses ${prop} property`,
                    type: 'property_exists',
                    property: prop,
                    message: `Missing ${prop} property`
                });
            });
        }

        if (challenge.requiredFunctions) {
            challenge.requiredFunctions.forEach(func => {
                tests.push({
                    name: `Calls ${func} function`,
                    type: 'method_called',
                    method: func,
                    message: `Missing ${func} function call`
                });
            });
        }

        // Fallback to basic validation if no specific tests
        if (tests.length === 0 && challenge.validation) {
            tests.push({
                name: 'Custom validation',
                validator: challenge.validation,
                message: 'Custom validation failed'
            });
        }

        return tests;
    }

    static getScoreMessage(score, passed, total) {
        if (score === 1) return `Perfect! All ${total} tests passed! 🎉`;
        if (score >= 0.8) return `Excellent! ${passed}/${total} tests passed! 🌟`;
        if (score >= 0.7) return `Good job! ${passed}/${total} tests passed! ✅`;
        if (score >= 0.5) return `Getting there! ${passed}/${total} tests passed. Keep trying! 💪`;
        if (score > 0) return `Some progress! ${passed}/${total} tests passed. Review the requirements. 📚`;
        return `No tests passed. Check your code and try again. 🔍`;
    }

    // Output comparison utilities
    static compareOutput(userOutput, expectedOutput, tolerance = 0.1) {
        if (typeof expectedOutput === 'number') {
            const userNum = parseFloat(userOutput);
            return Math.abs(userNum - expectedOutput) <= tolerance;
        }
        
        if (typeof expectedOutput === 'string') {
            return this.normalizeString(userOutput) === this.normalizeString(expectedOutput);
        }
        
        return JSON.stringify(userOutput) === JSON.stringify(expectedOutput);
    }

    static normalizeString(str) {
        return String(str).trim().toLowerCase().replace(/\s+/g, ' ');
    }

    // HTML structure comparison
    static compareHTMLStructure(userHTML, expectedHTML) {
        const userDoc = new DOMParser().parseFromString(userHTML, 'text/html');
        const expectedDoc = new DOMParser().parseFromString(expectedHTML, 'text/html');
        
        return this.compareElements(userDoc.body, expectedDoc.body);
    }

    static compareElements(userEl, expectedEl) {
        if (userEl.tagName !== expectedEl.tagName) return false;
        if (userEl.children.length !== expectedEl.children.length) return false;
        
        for (let i = 0; i < userEl.children.length; i++) {
            if (!this.compareElements(userEl.children[i], expectedEl.children[i])) {
                return false;
            }
        }
        return true;
    }

    // CSS property extraction
    static extractCSSProperties(cssCode) {
        const properties = {};
        const rules = cssCode.match(/[^{}]+\{[^{}]*\}/g) || [];
        
        rules.forEach(rule => {
            const [selector, declarations] = rule.split('{');
            const props = declarations.replace('}', '').split(';');
            
            props.forEach(prop => {
                const [property, value] = prop.split(':').map(s => s.trim());
                if (property && value) {
                    properties[property] = value;
                }
            });
        });
        
        return properties;
    }

    // Legacy validation methods
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static validatePassword(password) {
        return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    }

    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
}