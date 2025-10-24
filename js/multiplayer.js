// Multiplayer Racing System (Mock Implementation)
class MultiplayerRacing {
    constructor() {
        this.socket = null; // WebSocket connection
        this.roomId = null;
        this.players = new Map();
        this.currentRace = null;
        this.mockMode = true; // Set to false for real multiplayer
    }

    // Create or join race room
    async joinRace(roomId = null) {
        if (this.mockMode) {
            return this.createMockRace(roomId);
        }
        
        // Real WebSocket implementation would go here
        this.roomId = roomId || this.generateRoomId();
        this.setupMockPlayers();
        return { roomId: this.roomId, players: Array.from(this.players.values()) };
    }

    createMockRace(roomId) {
        this.roomId = roomId || this.generateRoomId();
        this.setupMockPlayers();
        
        // Simulate race start
        setTimeout(() => {
            this.startRace();
        }, 3000);
        
        return { roomId: this.roomId, players: Array.from(this.players.values()) };
    }

    setupMockPlayers() {
        const mockNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const playerCount = Math.floor(Math.random() * 3) + 2; // 2-4 players
        
        this.players.clear();
        this.players.set('you', {
            id: 'you',
            name: 'You',
            progress: 0,
            completed: false,
            time: 0
        });
        
        for (let i = 0; i < playerCount - 1; i++) {
            const id = `player_${i}`;
            this.players.set(id, {
                id,
                name: mockNames[i],
                progress: 0,
                completed: false,
                time: 0
            });
        }
    }

    startRace() {
        this.currentRace = {
            startTime: Date.now(),
            challenge: this.getRandomChallenge(),
            status: 'active'
        };
        
        // Emit race start event
        document.dispatchEvent(new CustomEvent('race:started', {
            detail: { race: this.currentRace, players: Array.from(this.players.values()) }
        }));
        
        // Simulate other players' progress
        this.simulateOpponents();
    }

    simulateOpponents() {
        const opponents = Array.from(this.players.values()).filter(p => p.id !== 'you');
        
        opponents.forEach(player => {
            const progressInterval = setInterval(() => {
                if (this.currentRace?.status !== 'active') {
                    clearInterval(progressInterval);
                    return;
                }
                
                player.progress += Math.random() * 15 + 5; // 5-20% progress
                
                if (player.progress >= 100 && !player.completed) {
                    player.completed = true;
                    player.time = Date.now() - this.currentRace.startTime;
                    clearInterval(progressInterval);
                    
                    document.dispatchEvent(new CustomEvent('race:playerFinished', {
                        detail: { player, position: this.getFinishedCount() }
                    }));
                }
                
                document.dispatchEvent(new CustomEvent('race:progressUpdate', {
                    detail: { players: Array.from(this.players.values()) }
                }));
            }, 1000 + Math.random() * 2000); // Random interval
        });
    }

    updatePlayerProgress(progress) {
        const player = this.players.get('you');
        if (player && this.currentRace?.status === 'active') {
            player.progress = Math.min(progress, 100);
            
            if (progress >= 100 && !player.completed) {
                player.completed = true;
                player.time = Date.now() - this.currentRace.startTime;
                
                const position = this.getFinishedCount();
                document.dispatchEvent(new CustomEvent('race:finished', {
                    detail: { position, time: player.time, players: Array.from(this.players.values()) }
                }));
                
                this.currentRace.status = 'finished';
            }
        }
    }

    getFinishedCount() {
        return Array.from(this.players.values()).filter(p => p.completed).length;
    }

    getRandomChallenge() {
        const challenges = [
            { id: 1, title: "Create HTML Heading", description: "Create an h1 with 'Racing!'" },
            { id: 2, title: "Style with CSS", description: "Make text red and centered" },
            { id: 3, title: "Add JavaScript", description: "Show alert on button click" }
        ];
        return challenges[Math.floor(Math.random() * challenges.length)];
    }

    generateRoomId() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    leaveRace() {
        this.currentRace = null;
        this.players.clear();
        this.roomId = null;
    }
}

// Initialize
window.multiplayerRacing = new MultiplayerRacing();