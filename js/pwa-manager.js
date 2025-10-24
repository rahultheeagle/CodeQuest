// PWA Manager
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.checkInstallStatus();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('SW registered:', registration);
            } catch (error) {
                console.log('SW registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallButton();
            Utils.showNotification('CodeQuest installed successfully!', 'success');
        });
    }

    async promptInstall() {
        if (!this.deferredPrompt) return false;

        this.deferredPrompt.prompt();
        const result = await this.deferredPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
            Utils.showNotification('Installing CodeQuest...', 'info');
        }
        
        this.deferredPrompt = null;
        return result.outcome === 'accepted';
    }

    showInstallButton() {
        let installBtn = document.getElementById('install-btn');
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'install-btn';
            installBtn.className = 'btn btn-primary install-btn';
            installBtn.innerHTML = '📱 Install App';
            installBtn.onclick = () => this.promptInstall();
            
            const header = document.querySelector('.header nav');
            if (header) header.appendChild(installBtn);
        }
        installBtn.style.display = 'inline-block';
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) installBtn.style.display = 'none';
    }

    checkInstallStatus() {
        // Check if running as PWA
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
        }
    }

    // Offline functionality
    isOnline() {
        return navigator.onLine;
    }

    setupOfflineHandling() {
        window.addEventListener('online', () => {
            Utils.showNotification('Back online!', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showNotification('You are offline. Some features may be limited.', 'warning');
        });
    }
}

// Initialize PWA
window.pwaManager = new PWAManager();