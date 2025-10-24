// Real Challenge Validation System
class ChallengeValidator {
    constructor() {
        this.testResults = [];
    }

    // Validate HTML challenges
    validateHTML(userCode, requirements) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(userCode, 'text/html');
        const results = [];

        requirements.forEach(req => {
            let passed = false;
            let message = '';

            switch(req.type) {
                case 'element_exists':
                    const elements = doc.querySelectorAll(req.selector);
                    passed = elements.length > 0;
                    message = passed ? `✓ ${req.selector} element found` : `✗ ${req.message}`;
                    break;

                case 'element_count':
                    const count = doc.querySelectorAll(req.selector).length;
                    passed = count === req.expected;
                    message = passed ? `✓ Found ${count} ${req.selector} elements` : `✗ Expected ${req.expected}, found ${count}`;
                    break;

                case 'text_content':
                    const element = doc.querySelector(req.selector);
                    passed = element && element.textContent.trim() === req.expected;
                    message = passed ? `✓ Text content matches` : `✗ ${req.message}`;
                    break;

                case 'attribute_exists':
                    const attrElement = doc.querySelector(req.selector);
                    passed = attrElement && attrElement.hasAttribute(req.attribute);
                    message = passed ? `✓ Attribute ${req.attribute} found` : `✗ Missing ${req.attribute} attribute`;
                    break;
            }

            results.push({ name: req.name, passed, message, points: req.points || 10 });
        });

        return results;
    }

    // Validate CSS challenges
    validateCSS(userCode, requirements) {
        const results = [];
        
        requirements.forEach(req => {
            let passed = false;
            let message = '';

            switch(req.type) {
                case 'property_exists':
                    passed = userCode.includes(req.property + ':');
                    message = passed ? `✓ ${req.property} property used` : `✗ Missing ${req.property} property`;
                    break;

                case 'property_value':
                    const regex = new RegExp(`${req.property}\\s*:\\s*${req.expected}`, 'i');
                    passed = regex.test(userCode);
                    message = passed ? `✓ ${req.property}: ${req.expected}` : `✗ ${req.message}`;
                    break;

                case 'selector_exists':
                    passed = userCode.includes(req.selector);
                    message = passed ? `✓ Selector ${req.selector} found` : `✗ Missing selector ${req.selector}`;
                    break;

                case 'contains_keyword':
                    passed = userCode.includes(req.keyword);
                    message = passed ? `✓ Uses ${req.keyword}` : `✗ Missing ${req.keyword}`;
                    break;
            }

            results.push({ name: req.name, passed, message, points: req.points || 10 });
        });

        return results;
    }

    // Validate JavaScript challenges
    validateJavaScript(userCode, requirements) {
        const results = [];
        
        requirements.forEach(req => {
            let passed = false;
            let message = '';

            try {
                switch(req.type) {
                    case 'syntax_valid':
                        try {
                            new Function(userCode);
                            passed = true;
                            message = '✓ Valid JavaScript syntax';
                        } catch (e) {
                            passed = false;
                            message = `✗ Syntax error: ${e.message}`;
                        }
                        break;

                    case 'contains_keyword':
                        passed = userCode.includes(req.keyword);
                        message = passed ? `✓ Uses ${req.keyword}` : `✗ Missing ${req.keyword}`;
                        break;

                    case 'method_called':
                        const methodRegex = new RegExp(`\\.${req.method}\\s*\\(`, 'g');
                        passed = methodRegex.test(userCode);
                        message = passed ? `✓ Calls ${req.method}()` : `✗ Missing ${req.method}() call`;
                        break;

                    case 'variable_declared':
                        const varRegex = new RegExp(`(var|let|const)\\s+${req.name}\\s*=`, 'g');
                        passed = varRegex.test(userCode);
                        message = passed ? `✓ Variable ${req.name} declared` : `✗ Missing variable ${req.name}`;
                        break;

                    case 'function_execution':
                        // Safe execution test
                        const testCode = `
                            ${userCode}
                            ${req.testCode}
                        `;
                        const result = this.safeExecute(testCode);
                        passed = result.success && result.output === req.expected;
                        message = passed ? `✓ Function works correctly` : `✗ ${req.message}`;
                        break;
                }
            } catch (error) {
                passed = false;
                message = `✗ Error: ${error.message}`;
            }

            results.push({ name: req.name, passed, message, points: req.points || 10 });
        });

        return results;
    }

    safeExecute(code) {
        try {
            // Create isolated execution context
            const func = new Function(`
                let output = '';
                const console = { log: (msg) => output += msg + '\\n' };
                ${code}
                return output.trim();
            `);
            
            const result = func();
            return { success: true, output: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Validate complete project
    validateProject(files, requirements) {
        const results = [];
        let allPassed = true;

        requirements.forEach(req => {
            let passed = false;
            let message = '';

            switch(req.type) {
                case 'file_exists':
                    passed = files[req.filename] !== undefined;
                    message = passed ? `✓ File ${req.filename} exists` : `✗ Missing file: ${req.filename}`;
                    break;

                case 'html_structure':
                    if (files['index.html']) {
                        const htmlResults = this.validateHTML(files['index.html'], req.tests);
                        passed = htmlResults.every(r => r.passed);
                        message = passed ? '✓ HTML structure correct' : '✗ HTML structure incomplete';
                    } else {
                        passed = false;
                        message = '✗ Missing index.html file';
                    }
                    break;

                case 'css_styling':
                    if (files['style.css'] || files['styles.css']) {
                        const cssFile = files['style.css'] || files['styles.css'];
                        const cssResults = this.validateCSS(cssFile, req.tests);
                        passed = cssResults.every(r => r.passed);
                        message = passed ? '✓ CSS styling correct' : '✗ CSS styling incomplete';
                    } else {
                        passed = false;
                        message = '✗ Missing CSS file';
                    }
                    break;

                case 'js_functionality':
                    if (files['script.js'] || files['main.js']) {
                        const jsFile = files['script.js'] || files['main.js'];
                        const jsResults = this.validateJavaScript(jsFile, req.tests);
                        passed = jsResults.every(r => r.passed);
                        message = passed ? '✓ JavaScript functionality correct' : '✗ JavaScript functionality incomplete';
                    } else {
                        passed = false;
                        message = '✗ Missing JavaScript file';
                    }
                    break;
            }

            if (!passed) allPassed = false;
            results.push({ name: req.name, passed, message, points: req.points || 20 });
        });

        return { results, allPassed };
    }

    // Calculate score
    calculateScore(results) {
        const totalPoints = results.reduce((sum, r) => sum + (r.points || 10), 0);
        const earnedPoints = results.filter(r => r.passed).reduce((sum, r) => sum + (r.points || 10), 0);
        
        return {
            earned: earnedPoints,
            total: totalPoints,
            percentage: Math.round((earnedPoints / totalPoints) * 100)
        };
    }

    // Generate detailed feedback
    generateFeedback(results, score) {
        const passed = results.filter(r => r.passed);
        const failed = results.filter(r => !r.passed);

        let feedback = `Score: ${score.earned}/${score.total} (${score.percentage}%)\n\n`;
        
        if (passed.length > 0) {
            feedback += '✅ Completed Requirements:\n';
            passed.forEach(r => feedback += `  ${r.message}\n`);
            feedback += '\n';
        }

        if (failed.length > 0) {
            feedback += '❌ Missing Requirements:\n';
            failed.forEach(r => feedback += `  ${r.message}\n`);
            feedback += '\n';
        }

        if (score.percentage === 100) {
            feedback += '🎉 Excellent work! Challenge completed successfully!';
        } else if (score.percentage >= 80) {
            feedback += '👍 Good job! Complete the remaining requirements to finish.';
        } else {
            feedback += '💪 Keep working! Review the requirements and try again.';
        }

        return feedback;
    }
}

// Initialize validator
window.challengeValidator = new ChallengeValidator();