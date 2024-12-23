/******************************************
 * Snow Effect Script with CSS Snowflakes
 ******************************************/

// Configuration
const snowCount = 75; // Number of snowflakes
const hideSnowTime = 0; // Seconds before snow disappears (0 = never)
const snowDistance = "pageheight"; // "windowheight" or "pageheight"

// Add basic snowflake CSS
const snowStyle = document.createElement("style");
snowStyle.innerHTML = `
  .snowflake {
    position: absolute;
    border-radius: 50%;
    background: white;
    pointer-events: none;
  }
  #snow-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 105vh;
    overflow: hidden;
    pointer-events: none; /* Allow interaction with underlying elements */
  }
`;
document.head.appendChild(snowStyle);

// Create container div for snowflakes
const snowContainer = document.createElement("div");
snowContainer.id = "snow-container";
document.body.appendChild(snowContainer);

// Utility functions
function getDocumentDimensions() {
  return {
    width: snowContainer.offsetWidth,
    height: snowContainer.offsetHeight
  };
}

// Track cursor position
let cursorX = -1000, cursorY = -1000; // Start offscreen
document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

// Snowflake Class
class Snowflake {
  constructor(id) {
    this.el = document.createElement("div");
    this.el.className = "snowflake";
    this.el.style.zIndex = id;
    snowContainer.appendChild(this.el);

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

    // Randomize size and apply blur
    const scale = 0.5 + Math.random() * 1.5; // Scale between 0.5 and 2.0
    const blurStrength = ((scale - 0.5) / 1.5) * 5; // Blur proportional to size
    const size = scale * 10; // Base size multiplier
    this.el.style.width = `${size}px`;
    this.el.style.height = `${size}px`;
    this.el.style.filter = `blur(${blurStrength}px)`;
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
  }

  updatePosition() {
    this.dx += this.stepX;
    this.y += this.stepY;

    const { width, height } = getDocumentDimensions();
    if (this.y > height) {
      this.el.remove(); // Remove snowflake when it falls off the screen
    }

    // Calculate distance from cursor and apply repelling effect
    const distX = this.x - cursorX;
    const distY = this.y - cursorY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    const repelDistance = 100; // Distance within which snowflakes are repelled
    if (distance < repelDistance) {
      const angle = Math.atan2(distY, distX);
      this.x += Math.cos(angle) * 2; // Move away from cursor
      this.y += Math.sin(angle) * 2;
    }

    // Apply position with sine wave for gentle drifting
    this.el.style.top = `${this.y}px`;
    this.el.style.left = `${this.x + this.amplitude * Math.sin(this.dx)}px`;
  }
}

// Snow effect controller
class SnowEffect {
  constructor() {
    this.snowflakes = Array.from({ length: snowCount }, (_, i) => new Snowflake(i));
    this.animationFrame = null;
    this.hideTimeout = null;
    this.allowNewSnowflakes = true;

    this.update = this.update.bind(this);
    this.start();
  }

  update() {
    this.snowflakes = this.snowflakes.filter(snowflake => {
      snowflake.updatePosition();
      return document.body.contains(snowflake.el); // Keep only snowflakes still in the DOM
    });

    if (this.allowNewSnowflakes && this.snowflakes.length < snowCount) {
      this.snowflakes.push(new Snowflake(this.snowflakes.length));
    }

    this.animationFrame = requestAnimationFrame(this.update);
  }

  start() {
    this.update();
    if (hideSnowTime > 0) {
      this.hideTimeout = setTimeout(() => this.stopAddingSnowflakes(), hideSnowTime * 1000);
    }
  }

  stopAddingSnowflakes() {
    this.allowNewSnowflakes = false;

    // Calculate the maximum time needed for all snowflakes to fall
    const maxFallTime = Math.max(
      ...this.snowflakes.map(snowflake => {
        const { height } = getDocumentDimensions();
        return (height - snowflake.y) / snowflake.stepY;
      })
    );

    setTimeout(() => this.stop(), maxFallTime * 1000); // Dynamically wait for the last snowflake to fall
  }

  stop() {
    cancelAnimationFrame(this.animationFrame);
    this.snowflakes.forEach(snowflake => snowflake.el.remove());
  }
}

// Start the snow effect if supported
if ("requestAnimationFrame" in window) {
  new SnowEffect();
}
