// Heart Effect Script

// Configuration
const heartCount = 75; // Number of hearts
const hideHeartTime = 0; // Seconds before hearts disappear (0 = never)
const heartDistance = "pageheight"; // "windowheight" or "pageheight"

// Add basic heart CSS
const heartStyle = document.createElement("style");
heartStyle.innerHTML = `
  .heart {
    position: absolute;
    pointer-events: none;
    color: red;
    font-size: 20px;
    animation: spin 3s linear infinite; /* Optional: hearts rotate while falling */
  }
  #heart-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 105vh;
    overflow: hidden;
    pointer-events: none; /* Allow interaction with underlying elements */
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(heartStyle);

// Create container div for hearts
const heartContainer = document.createElement("div");
heartContainer.id = "heart-container";
document.body.appendChild(heartContainer);

// Utility functions
function getDocumentDimensions() {
  return {
    width: heartContainer.offsetWidth,
    height: heartContainer.offsetHeight
  };
}

// Track cursor position
let cursorX = -1000, cursorY = -1000; // Start offscreen
document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

// Heart Class
class Heart {
  constructor(id) {
    this.el = document.createElement("div");
    this.el.className = "heart";
    this.el.style.zIndex = id;
    this.el.textContent = "❤️"; // Use a heart emoji
    heartContainer.appendChild(this.el);

    this.reset();
  }

  reset() {
    const { width, height } = getDocumentDimensions();
    this.x = Math.random() * (width - 50);
    this.y = -Math.random() * height; // Start above the view
    this.amplitude = Math.random() * 20;
    this.stepX = 0.02 + Math.random() / 10;
    this.stepY = 0.7 + Math.random();
    this.dx = 0;

    const scale = 0.5 + Math.random() * 1.5; // Scale between 0.5 and 2.0
    const size = scale * 20; // Base size multiplier
    this.el.style.fontSize = `${size}px`;
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
  }

  updatePosition() {
    this.dx += this.stepX;
    this.y += this.stepY;

    const { width, height } = getDocumentDimensions();
    if (this.y > height) {
      this.el.remove(); // Remove heart when it falls off the screen
    }

    const distX = this.x - cursorX;
    const distY = this.y - cursorY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    const repelDistance = 100;
    if (distance < repelDistance) {
      const angle = Math.atan2(distY, distX);
      this.x += Math.cos(angle) * 2;
      this.y += Math.sin(angle) * 2;
    }

    this.el.style.top = `${this.y}px`;
    this.el.style.left = `${this.x + this.amplitude * Math.sin(this.dx)}px`;
  }
}

// Heart effect controller
class HeartEffect {
  constructor() {
    this.hearts = Array.from({ length: heartCount }, (_, i) => new Heart(i));
    this.animationFrame = null;
    this.hideTimeout = null;
    this.allowNewHearts = true;

    this.update = this.update.bind(this);
    this.start();
  }

  update() {
    this.hearts = this.hearts.filter(heart => {
      heart.updatePosition();
      return document.body.contains(heart.el);
    });

    if (this.allowNewHearts && this.hearts.length < heartCount) {
      this.hearts.push(new Heart(this.hearts.length));
    }

    this.animationFrame = requestAnimationFrame(this.update);
  }

  start() {
    this.update();
    if (hideHeartTime > 0) {
      this.hideTimeout = setTimeout(() => this.stopAddingHearts(), hideHeartTime * 1000);
    }
  }

  stopAddingHearts() {
    this.allowNewHearts = false;

    const maxFallTime = Math.max(
      ...this.hearts.map(heart => {
        const { height } = getDocumentDimensions();
        return (height - heart.y) / heart.stepY;
      })
    );

    setTimeout(() => this.stop(), maxFallTime * 1000);
  }

  stop() {
    cancelAnimationFrame(this.animationFrame);
    this.hearts.forEach(heart => heart.el.remove());
  }
}

if ("requestAnimationFrame" in window) {
  new HeartEffect();
}
