// Challenge Data Structure Implementation
const challengeData = [
  {
    id: 1,
    title: "Create Your First Heading",
    category: "html",
    difficulty: "easy",
    xp: 50,
    description: "Create an h1 element with the text 'Hello World'",
    starterCode: "<!-- Write your code here -->",
    solution: "<h1>Hello World</h1>",
    hints: ["Use the h1 tag", "Don't forget to close the tag"],
    validation: function(code) {
      return code.includes("<h1>") && code.includes("Hello World");
    }
  },
  {
    id: 2,
    title: "Style Your Text",
    category: "css",
    difficulty: "easy",
    xp: 75,
    description: "Make the h1 element red using CSS",
    starterCode: "h1 {\n  /* Add your styles here */\n}",
    solution: "h1 {\n  color: red;\n}",
    hints: ["Use the color property", "Set the value to red"],
    validation: function(code) {
      return code.includes("color") && code.includes("red");
    }
  },
  {
    id: 3,
    title: "Add Interactivity",
    category: "javascript",
    difficulty: "medium",
    xp: 100,
    description: "Create a button that shows an alert when clicked",
    starterCode: "// Write your JavaScript here",
    solution: "document.querySelector('button').addEventListener('click', () => alert('Hello!'));",
    hints: ["Use addEventListener", "Use the 'click' event", "Call alert() function"],
    validation: function(code) {
      return code.includes("addEventListener") && code.includes("click") && code.includes("alert");
    }
  },
  {
    id: 4,
    title: "Create a List",
    category: "html",
    difficulty: "easy",
    xp: 60,
    description: "Create an unordered list with 3 items",
    starterCode: "<!-- Create your list here -->",
    solution: "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>",
    hints: ["Use ul for unordered list", "Use li for list items", "Add 3 li elements"],
    validation: function(code) {
      return code.includes("<ul>") && (code.match(/<li>/g) || []).length >= 3;
    }
  },
  {
    id: 5,
    title: "Flexbox Layout",
    category: "css",
    difficulty: "medium",
    xp: 120,
    description: "Center content using flexbox",
    starterCode: ".container {\n  /* Add flexbox properties */\n}",
    solution: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
    hints: ["Set display to flex", "Use justify-content for horizontal", "Use align-items for vertical"],
    validation: function(code) {
      return code.includes("display: flex") && code.includes("justify-content") && code.includes("align-items");
    }
  },
  {
    id: 6,
    title: "Array Methods",
    category: "javascript",
    difficulty: "medium",
    xp: 150,
    description: "Filter an array to get only even numbers",
    starterCode: "const numbers = [1, 2, 3, 4, 5, 6];\n// Filter even numbers",
    solution: "const numbers = [1, 2, 3, 4, 5, 6];\nconst evens = numbers.filter(n => n % 2 === 0);",
    hints: ["Use the filter method", "Check if number % 2 === 0", "Use arrow function"],
    validation: function(code) {
      return code.includes("filter") && code.includes("% 2") && code.includes("===");
    }
  },
  {
    id: 7,
    title: "Form Elements",
    category: "html",
    difficulty: "medium",
    xp: 90,
    description: "Create a form with name input and submit button",
    starterCode: "<!-- Create your form here -->",
    solution: "<form>\n  <input type=\"text\" name=\"name\" placeholder=\"Your name\">\n  <button type=\"submit\">Submit</button>\n</form>",
    hints: ["Use form element", "Add input with type text", "Add submit button"],
    validation: function(code) {
      return code.includes("<form>") && code.includes("input") && code.includes("submit");
    }
  },
  {
    id: 8,
    title: "CSS Grid",
    category: "css",
    difficulty: "hard",
    xp: 200,
    description: "Create a 3-column grid layout",
    starterCode: ".grid {\n  /* Add grid properties */\n}",
    solution: ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 20px;\n}",
    hints: ["Set display to grid", "Use grid-template-columns", "Add gap for spacing"],
    validation: function(code) {
      return code.includes("display: grid") && code.includes("grid-template-columns") && code.includes("1fr");
    }
  },
  {
    id: 9,
    title: "Local Storage",
    category: "javascript",
    difficulty: "hard",
    xp: 180,
    description: "Save and retrieve data from localStorage",
    starterCode: "// Save name to localStorage and retrieve it",
    solution: "localStorage.setItem('name', 'John');\nconst name = localStorage.getItem('name');",
    hints: ["Use setItem to save", "Use getItem to retrieve", "Pass key and value"],
    validation: function(code) {
      return code.includes("setItem") && code.includes("getItem") && code.includes("localStorage");
    }
  },
  {
    id: 10,
    title: "Responsive Design",
    category: "css",
    difficulty: "hard",
    xp: 250,
    description: "Create a media query for mobile devices",
    starterCode: "/* Add media query for screens smaller than 768px */",
    solution: "@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}",
    hints: ["Use @media rule", "Set max-width condition", "Change layout for mobile"],
    validation: function(code) {
      return code.includes("@media") && code.includes("max-width") && code.includes("768px");
    }
  }
];

// Challenge Manager Class
class ChallengeManager {
  constructor() {
    this.challenges = challengeData;
    this.userProgress = this.loadProgress();
  }

  getChallenge(id) {
    return this.challenges.find(c => c.id === id);
  }

  getChallengesByCategory(category) {
    return this.challenges.filter(c => c.category === category);
  }

  getChallengesByDifficulty(difficulty) {
    return this.challenges.filter(c => c.difficulty === difficulty);
  }

  validateChallenge(id, userCode) {
    const challenge = this.getChallenge(id);
    if (!challenge) return { valid: false, message: "Challenge not found" };

    const isValid = challenge.validation(userCode);
    
    if (isValid && !this.userProgress.completed.includes(id)) {
      this.userProgress.completed.push(id);
      this.userProgress.totalXP += challenge.xp;
      this.saveProgress();
    }

    return {
      valid: isValid,
      message: isValid ? "Correct! Well done!" : "Not quite right. Try again!",
      xp: isValid ? challenge.xp : 0
    };
  }

  getHint(id, hintIndex = 0) {
    const challenge = this.getChallenge(id);
    return challenge?.hints[hintIndex] || null;
  }

  getSolution(id) {
    const challenge = this.getChallenge(id);
    return challenge?.solution || null;
  }

  getUserProgress() {
    return {
      ...this.userProgress,
      completionRate: (this.userProgress.completed.length / this.challenges.length) * 100
    };
  }

  loadProgress() {
    const stored = localStorage.getItem('challengeProgress');
    return stored ? JSON.parse(stored) : { completed: [], totalXP: 0 };
  }

  saveProgress() {
    localStorage.setItem('challengeProgress', JSON.stringify(this.userProgress));
  }

  resetProgress() {
    this.userProgress = { completed: [], totalXP: 0 };
    this.saveProgress();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { challengeData, ChallengeManager };
} else {
  window.challengeData = challengeData;
  window.ChallengeManager = ChallengeManager;
}