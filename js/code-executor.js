// High-Performance Code Executor
class CodeExecutor {
    constructor() {
        this.workerPool = [];
        this.maxWorkers = 4;
        this.executionCache = new Map();
        this.setupWorkerPool();
    }

    setupWorkerPool() {
        // Create web workers for code execution
        for (let i = 0; i < this.maxWorkers; i++) {
            const worker = this.createWorker();
            this.workerPool.push({ worker, busy: false });
        }
    }

    createWorker() {
        const workerCode = `
            self.onmessage = function(e) {
                const { code, language, id } = e.data;
                const startTime = performance.now();
                
                try {
                    let result;
                    
                    switch (language) {
                        case 'javascript':
                            result = executeJS(code);
                            break;
                        case 'html':
                            result = validateHTML(code);
                            break;
                        case 'css':
                            result = validateCSS(code);
                            break;
                        default:
                            result = { error: 'Unsupported language' };
                    }
                    
                    const executionTime = performance.now() - startTime;
                    
                    self.postMessage({
                        id,
                        result,
                        executionTime,
                        success: true
                    });
                } catch (error) {
                    self.postMessage({
                        id,
                        error: error.message,
                        success: false
                    });
                }
            };
            
            function executeJS(code) {
                const output = [];
                const mockConsole = {
                    log: (...args) => output.push(args.join(' ')),
                    error: (...args) => output.push('ERROR: ' + args.join(' ')),
                    warn: (...args) => output.push('WARN: ' + args.join(' '))
                };
                
                const func = new Function('console', code);
                func(mockConsole);
                
                return { output: output.join('\\n'), type: 'javascript' };
            }
            
            function validateHTML(code) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(code, 'text/html');
                const errors = doc.querySelectorAll('parsererror');
                
                return {
                    valid: errors.length === 0,
                    errors: errors.length,
                    type: 'html'
                };
            }
            
            function validateCSS(code) {
                try {
                    // Basic CSS validation
                    const rules = code.match(/[^{}]+\\{[^{}]*\\}/g) || [];
                    return {
                        valid: true,
                        rules: rules.length,
                        type: 'css'
                    };
                } catch (error) {
                    return {
                        valid: false,
                        error: error.message,
                        type: 'css'
                    };
                }
            }
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    }

    // Execute code with performance optimization
    async executeCode(code, language = 'javascript') {
        const cacheKey = `${language}:${this.hashCode(code)}`;
        
        // Check cache first
        if (this.executionCache.has(cacheKey)) {
            return this.executionCache.get(cacheKey);
        }

        const startTime = performance.now();
        
        // Get available worker
        const workerInfo = this.getAvailableWorker();
        if (!workerInfo) {
            // Fallback to main thread if no workers available
            return this.executeOnMainThread(code, language);
        }

        const result = await this.executeOnWorker(workerInfo, code, language);
        const totalTime = performance.now() - startTime;

        // Cache result if execution was fast
        if (totalTime < 50) {
            this.executionCache.set(cacheKey, result);
        }

        // Log performance warning if too slow
        if (totalTime > 100) {
            console.warn(`Code execution took ${totalTime.toFixed(2)}ms (Target: <100ms)`);
        }

        return result;
    }

    getAvailableWorker() {
        return this.workerPool.find(w => !w.busy);
    }

    executeOnWorker(workerInfo, code, language) {
        return new Promise((resolve) => {
            const id = Math.random().toString(36).substr(2, 9);
            workerInfo.busy = true;

            const timeout = setTimeout(() => {
                workerInfo.busy = false;
                resolve({ error: 'Execution timeout', success: false });
            }, 5000);

            workerInfo.worker.onmessage = (e) => {
                if (e.data.id === id) {
                    clearTimeout(timeout);
                    workerInfo.busy = false;
                    resolve(e.data);
                }
            };

            workerInfo.worker.postMessage({ code, language, id });
        });
    }

    executeOnMainThread(code, language) {
        const startTime = performance.now();
        
        try {
            let result;
            
            switch (language) {
                case 'javascript':
                    result = this.executeJS(code);
                    break;
                case 'html':
                    result = this.validateHTML(code);
                    break;
                case 'css':
                    result = this.validateCSS(code);
                    break;
                default:
                    result = { error: 'Unsupported language' };
            }
            
            const executionTime = performance.now() - startTime;
            return { result, executionTime, success: true };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }

    executeJS(code) {
        const output = [];
        const mockConsole = {
            log: (...args) => output.push(args.join(' ')),
            error: (...args) => output.push('ERROR: ' + args.join(' ')),
            warn: (...args) => output.push('WARN: ' + args.join(' '))
        };
        
        const func = new Function('console', code);
        func(mockConsole);
        
        return { output: output.join('\n'), type: 'javascript' };
    }

    validateHTML(code) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, 'text/html');
        const errors = doc.querySelectorAll('parsererror');
        
        return {
            valid: errors.length === 0,
            errors: errors.length,
            type: 'html'
        };
    }

    validateCSS(code) {
        try {
            const rules = code.match(/[^{}]+\{[^{}]*\}/g) || [];
            return {
                valid: true,
                rules: rules.length,
                type: 'css'
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message,
                type: 'css'
            };
        }
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Cleanup
    destroy() {
        this.workerPool.forEach(w => w.worker.terminate());
        this.executionCache.clear();
    }
}

// Initialize code executor
window.codeExecutor = new CodeExecutor();