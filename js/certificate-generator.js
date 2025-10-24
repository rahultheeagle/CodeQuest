// Certificate Generator
class CertificateGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
    }

    // Generate completion certificate
    async generateCertificate(userData) {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, 760, 560);

        // Title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Completion', 400, 120);

        // Subtitle
        ctx.font = '24px Arial';
        ctx.fillText('CodeQuest Interactive Learning Platform', 400, 160);

        // Main text
        ctx.font = '32px Arial';
        ctx.fillText('This certifies that', 400, 240);

        // Name
        ctx.font = 'bold 42px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(userData.name || 'Student', 400, 300);

        // Achievement text
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        ctx.fillText('has successfully completed', 400, 360);

        // Stats
        ctx.font = '24px Arial';
        const stats = `${userData.completedChallenges || 0} challenges • ${userData.totalXP || 0} XP earned`;
        ctx.fillText(stats, 400, 400);

        // Date
        ctx.font = '20px Arial';
        ctx.fillText(`Completed on ${new Date().toLocaleDateString()}`, 400, 480);

        // Signature line
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(500, 520);
        ctx.lineTo(700, 520);
        ctx.stroke();

        ctx.font = '16px Arial';
        ctx.fillText('CodeQuest Team', 600, 540);

        return canvas.toDataURL('image/png');
    }

    // Download certificate
    async downloadCertificate(userData) {
        const dataUrl = await this.generateCertificate(userData);
        
        const link = document.createElement('a');
        link.download = `CodeQuest_Certificate_${userData.name || 'Student'}.png`;
        link.href = dataUrl;
        link.click();
        
        Utils.showNotification('Certificate downloaded!', 'success');
    }

    // Share certificate
    async shareCertificate(userData) {
        const dataUrl = await this.generateCertificate(userData);
        
        if (navigator.share) {
            try {
                // Convert data URL to blob for sharing
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const file = new File([blob], 'certificate.png', { type: 'image/png' });
                
                await navigator.share({
                    title: 'My CodeQuest Certificate',
                    text: `I completed ${userData.completedChallenges || 0} coding challenges on CodeQuest!`,
                    files: [file]
                });
            } catch (error) {
                // Fallback to download
                this.downloadCertificate(userData);
            }
        } else {
            // Fallback to download
            this.downloadCertificate(userData);
        }
    }

    // Check if user qualifies for certificate
    qualifiesForCertificate(userData) {
        return (userData.completedChallenges || 0) >= 5; // Minimum 5 challenges
    }
}

// Initialize
window.certificateGenerator = new CertificateGenerator();