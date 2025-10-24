// Challenge System Module
export class ChallengeSystem {
  constructor() {
    this.challenges = new Map();
    this.userProgress = new Map();
    this.validators = new Map();
    this.setupValidators();
  }

  // Challenge management
  addChallenge(challenge) {
    this.challenges.set(challenge.id, challenge);
    return challenge;
  }

  getChallenge(id) {
    return this.challenges.get(id);
  }

  getChallengesByCategory(category) {
    return Array.from(this.challenges.values()).filter(c => c.category === category);
  }

  getChallengesByDifficulty(difficulty) {
    return Array.from(this.challenges.values()).filter(c => c.difficulty === difficulty);
  }

  // Progress tracking
  getUserProgress(userId) {
    return this.userProgress.get(userId) || { completed: [], attempts: new Map() };
  }

  updateProgress(userId, challengeId, result) {
    const progress = this.getUserProgress(userId);
    const attempts = progress.attempts.get(challengeId) || 0;
    
    progress.attempts.set(challengeId, attempts + 1);
    
    if (result.success && !progress.completed.includes(challengeId)) {
      progress.completed.push(challengeId);
    }
    
    this.userProgress.set(userId, progress);
    return progress;
  }

  // Validation system
  setupValidators() {
    this.validators.set('html', this.validateHTML);
    this.validators.set('css', this.validateCSS);
    this.validators.set('javascript', this.validateJavaScript);
  }

  async validateChallenge(challengeId, userCode, userId) {
    const challenge = this.getChallenge(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const validator = this.validators.get(challenge.category);
    if (!validator) throw new Error('No validator for category');

    try {
      const result = await validator(userCode, challenge.expectedOutput);
      this.updateProgress(userId, challengeId, result);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  validateHTML(code, expected) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');
    const errors = doc.querySelectorAll('parsererror');
    
    return {
      success: errors.length === 0,
      message: errors.length === 0 ? 'Valid HTML' : 'HTML syntax errors found',
      score: errors.length === 0 ? 100 : 0
    };
  }

  validateCSS(code, expected) {
    try {
      const style = document.createElement('style');
      style.textContent = code;
      document.head.appendChild(style);
      document.head.removeChild(style);
      
      return { success: true, message: 'Valid CSS', score: 100 };
    } catch (error) {
      return { success: false, message: 'CSS syntax error', score: 0 };
    }
  }

  validateJavaScript(code, expected) {
    try {
      new Function(code);
      return { success: true, message: 'Valid JavaScript', score: 100 };
    } catch (error) {
      return { success: false, message: error.message, score: 0 };
    }
  }
}

export class Challenge {
  static difficulties = ['beginner', 'intermediate', 'advanced'];
  static categories = ['html', 'css', 'javascript', 'project'];

  constructor({ title, description, category, difficulty, starterCode = '', expectedOutput = '', hints = [] }) {
    this.id = this.generateId();
    this.title = title;
    this.description = description;
    this.category = category;
    this.difficulty = difficulty;
    this.starterCode = starterCode;
    this.expectedOutput = expectedOutput;
    this.hints = hints;
    this.createdAt = new Date();
    this.points = this.calculatePoints();
  }

  generateId() {
    return `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  calculatePoints() {
    const difficultyPoints = {
      beginner: 10,
      intermediate: 25,
      advanced: 50
    };
    return difficultyPoints[this.difficulty] || 10;
  }

  getHint(index) {
    return this.hints[index] || null;
  }

  addHint(hint) {
    this.hints.push(hint);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      difficulty: this.difficulty,
      starterCode: this.starterCode,
      points: this.points,
      createdAt: this.createdAt
    };
  }
}