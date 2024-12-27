// Easter Effect Script

// Configuration
const easterCount = 75; // Number of Easter elements
const hideEasterTime = 0; // Seconds before elements disappear (0 = never)
const easterDistance = "pageheight"; // "windowheight" or "pageheight"

// Add basic Easter CSS
const easterStyle = document.createElement("style");
easterStyle.innerHTML = `
  .easter {
    position: absolute;
    pointer-events: none;
    color: pastel;
    font-size: 20px;
    animation: bounce 5s ease-in-out infinite; /* Optional: elements bounce while floating */
  }
  #easter-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 105vh;
    overflow: hidden;
    pointer-events: none; /* Allow interaction with underlying elements */
  }
  @keyframes bounce {
    0% { transform: translateY(0) scale(1); }
    25% { transform: translateY(-10px) scale(1.1); }
    50% { transform: translateY(0) scale(1); }
    75% { transform: translateY(10px) scale(0.9); }
    100% { transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(easterStyle);

// Create container div for Easter elements
const easterContainer = document.createElement("div");
easterContainer.id = "easter-container";
document.body.appendChild(easterContainer);

// Utility functions
function getDocumentDimensions() {
  return {
    width: easterContainer.offsetWidth,
    height: easterContainer.offsetHeight
  };
}

// Easter Class
class Easter {
  constructor(id) {
    this.el = document.createElement("div");
    this.el.className = "easter";
    this.el.style.zIndex = id;

    // Randomly select an emoji for the Easter element
    const easterEmojis = ["🥚", "🐰", "🌸", "🐣", "🌼"];
    this.el.textContent = easterEmojis[Math.floor(Math.random() * easterEmojis.length)];

    easterContainer.appendChild(this.el);

    this.reset();
  }

  reset() {
    const { width, height } = getDocumentDimensions();
    this.x = Math.random() * (width - 50);
    this.y = Math.random() * height; // Start at random positions
    this.amplitude = Math.random() * 20;

    const scale = 0.5 + Math.random() * 1.5; // Scale between 0.5 and 2.0
    const size = scale * 20; // Base size multiplier
    this.el.style.fontSize = `${size}px`;
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
  }

  updatePosition() {
    const { width, height } = getDocumentDimensions();
    const distX = this.x - cursorX;
    const distY = this.y - cursorY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    const repelDistance = 150;
    if (distance < repelDistance) {
      const angle = Math.atan2(distY, distX);
      this.x += Math.cos(angle) * 3;
      this.y += Math.sin(angle) * 3;
    }

    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
  }
}

// Easter effect controller
class EasterEffect {
  constructor() {
    this.easters = Array.from({ length: easterCount }, (_, i) => new Easter(i));
    this.animationFrame = null;
    this.hideTimeout = null;
    this.allowNewEasters = true;

    this.update = this.update.bind(this);
    this.start();
  }

  update() {
    this.easters = this.easters.filter(easter => {
      easter.updatePosition();
      return document.body.contains(easter.el);
    });

    if (this.allowNewEasters && this.easters.length < easterCount) {
      this.easters.push(new Easter(this.easters.length));
    }

    this.animationFrame = requestAnimationFrame(this.update);
  }

  start() {
    this.update();
    if (hideEasterTime > 0) {
      this.hideTimeout = setTimeout(() => this.stopAddingEasters(), hideEasterTime * 1000);
    }
  }

  stopAddingEasters() {
    this.allowNewEasters = false;

    const maxFallTime = Math.max(
      ...this.easters.map(easter => {
        const { height } = getDocumentDimensions();
        return (height - easter.y) / easter.stepY;
      })
    );

    setTimeout(() => this.stop(), maxFallTime * 1000);
  }

  stop() {
    cancelAnimationFrame(this.animationFrame);
    this.easters.forEach(easter => easter.el.remove());
  }
}

if ("requestAnimationFrame" in window) {
  new EasterEffect();
}
