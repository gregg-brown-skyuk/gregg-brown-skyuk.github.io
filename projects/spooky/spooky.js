// Spooky Effect Script

// Configuration
const spookyCount = 75; // Number of spooky elements
const hideSpookyTime = 0; // Seconds before elements disappear (0 = never)
const spookyDistance = "pageheight"; // "windowheight" or "pageheight"

// Add basic spooky CSS
const spookyStyle = document.createElement("style");
spookyStyle.innerHTML = `
  .spooky {
    position: absolute;
    pointer-events: none;
    color: orange;
    font-size: 20px;
    animation: haunt 5s ease-in-out infinite; /* Optional: elements haunt while floating */
  }
  #spooky-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 105vh;
    overflow: hidden;
    pointer-events: none; /* Allow interaction with underlying elements */
  }
  @keyframes haunt {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
    25% { transform: translate(-20px, 30px) rotate(-10deg); opacity: 0.8; }
    50% { transform: translate(20px, 20px) rotate(10deg); opacity: 0.6; }
    75% { transform: translate(-15px, -20px) rotate(-5deg); opacity: 0.8; }
    100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  }
  #lightning {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    opacity: 0;
    z-index: 999;
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
  }
`;
document.head.appendChild(spookyStyle);

// Create container div for spooky elements
const spookyContainer = document.createElement("div");
spookyContainer.id = "spooky-container";
document.body.appendChild(spookyContainer);

// Create lightning effect overlay
const lightningOverlay = document.createElement("div");
lightningOverlay.id = "lightning";
document.body.appendChild(lightningOverlay);

// Utility functions
function getDocumentDimensions() {
  return {
    width: spookyContainer.offsetWidth,
    height: spookyContainer.offsetHeight
  };
}

function triggerLightning() {
  lightningOverlay.style.opacity = 1;
  setTimeout(() => {
    lightningOverlay.style.opacity = 0;
  }, 200);
}

// Randomly trigger lightning effect every few seconds
setInterval(() => {
  if (Math.random() > 0.7) { // 30% chance per interval
    triggerLightning();
  }
}, 2000);

// Track cursor position
let cursorX = -1000, cursorY = -1000; // Start offscreen
document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

// Spooky Class
class Spooky {
  constructor(id) {
    this.el = document.createElement("div");
    this.el.className = "spooky";
    this.el.style.zIndex = id;

    // Randomly select an emoji for the spooky element
    const spookyEmojis = ["🎃", "👻", "💀", "🕷️", "🕸️"];
    this.el.textContent = spookyEmojis[Math.floor(Math.random() * spookyEmojis.length)];

    spookyContainer.appendChild(this.el);

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

// Spooky effect controller
class SpookyEffect {
  constructor() {
    this.spookies = Array.from({ length: spookyCount }, (_, i) => new Spooky(i));
    this.animationFrame = null;
    this.hideTimeout = null;
    this.allowNewSpookies = true;

    this.update = this.update.bind(this);
    this.start();
  }

  update() {
    this.spookies = this.spookies.filter(spooky => {
      spooky.updatePosition();
      return document.body.contains(spooky.el);
    });

    if (this.allowNewSpookies && this.spookies.length < spookyCount) {
      this.spookies.push(new Spooky(this.spookies.length));
    }

    this.animationFrame = requestAnimationFrame(this.update);
  }

  start() {
    this.update();
    if (hideSpookyTime > 0) {
      this.hideTimeout = setTimeout(() => this.stopAddingSpookies(), hideSpookyTime * 1000);
    }
  }

  stopAddingSpookies() {
    this.allowNewSpookies = false;

    const maxFallTime = Math.max(
      ...this.spookies.map(spooky => {
        const { height } = getDocumentDimensions();
        return (height - spooky.y) / spooky.stepY;
      })
    );

    setTimeout(() => this.stop(), maxFallTime * 1000);
  }

  stop() {
    cancelAnimationFrame(this.animationFrame);
    this.spookies.forEach(spooky => spooky.el.remove());
  }
}

if ("requestAnimationFrame" in window) {
  new SpookyEffect();
}
