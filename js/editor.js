// Code Editor
class CodeEditor {
    constructor() {
        this.htmlEditor = document.getElementById('htmlEditor');
        this.cssEditor = document.getElementById('cssEditor');
        this.jsEditor = document.getElementById('jsEditor');
        this.preview = document.getElementById('preview');
        this.console = document.getElementById('console');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedCode();
        this.updatePreview();
    }

    setupEventListeners() {
        [this.htmlEditor, this.cssEditor, this.jsEditor].forEach(editor => {
            if (editor) {
                editor.addEventListener('input', () => {
                    this.updatePreview();
                    this.saveCode();
                });
            }
        });
    }

    updatePreview() {
        if (!this.preview) return;

        const html = this.htmlEditor?.value || '';
        const css = this.cssEditor?.value || '';
        const js = this.jsEditor?.value || '';

        const previewContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>
                    try {
                        ${js}
                    } catch (error) {
                        parent.postMessage({type: 'error', message: error.message}, '*');
                    }
                </script>
            </body>
            </html>
        `;

        this.preview.srcdoc = previewContent;
    }

    saveCode() {
        const code = {
            html: this.htmlEditor?.value || '',
            css: this.cssEditor?.value || '',
            js: this.jsEditor?.value || ''
        };
        localStorage.setItem('editorCode', JSON.stringify(code));
    }

    loadSavedCode() {
        const saved = localStorage.getItem('editorCode');
        if (saved) {
            const code = JSON.parse(saved);
            if (this.htmlEditor) this.htmlEditor.value = code.html || '';
            if (this.cssEditor) this.cssEditor.value = code.css || '';
            if (this.jsEditor) this.jsEditor.value = code.js || '';
        }
    }

    clearCode() {
        if (this.htmlEditor) this.htmlEditor.value = '';
        if (this.cssEditor) this.cssEditor.value = '';
        if (this.jsEditor) this.jsEditor.value = '';
        this.updatePreview();
        this.saveCode();
    }

    formatCode() {
        // Basic code formatting
        [this.htmlEditor, this.cssEditor, this.jsEditor].forEach(editor => {
            if (editor && editor.value) {
                editor.value = editor.value.replace(/\s+/g, ' ').trim();
            }
        });
        this.updatePreview();
    }
}

// Handle console messages from preview
window.addEventListener('message', (event) => {
    if (event.data.type === 'error') {
        const console = document.getElementById('console');
        if (console) {
            console.innerHTML += `<div style="color: #ff6b6b;">Error: ${event.data.message}</div>`;
        }
    }
});

// Initialize editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.editor = new CodeEditor();
});