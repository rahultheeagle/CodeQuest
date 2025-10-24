// Code Sharing System
class CodeSharing {
    constructor() {
        this.storage = new Storage();
        this.baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
    }

    // Generate shareable link
    shareCode(code, title = 'Shared Code', language = 'html') {
        const shareData = {
            code,
            title,
            language,
            timestamp: Date.now(),
            id: this.generateId()
        };
        
        // Store in localStorage (in production, use backend)
        this.storage.set(`share_${shareData.id}`, shareData);
        
        const shareUrl = `${this.baseUrl}shared.html?id=${shareData.id}`;
        return { url: shareUrl, id: shareData.id };
    }

    // Load shared code
    loadSharedCode(id) {
        return this.storage.get(`share_${id}`);
    }

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Utils.showNotification('Link copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            Utils.showNotification('Link copied!', 'success');
        }
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Initialize
window.codeSharing = new CodeSharing();