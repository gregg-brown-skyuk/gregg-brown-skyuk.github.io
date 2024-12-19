/******************************************
 * Snow Effect Script with Alternating Snowflake Images
 ******************************************/

// Configuration
const snowImages = ["images/png/snow1.png", "images/png/snow2.png", "images/png/snow3.png", "images/png/snow4.png", "images/png/snow5.png", "images/png/snow6.png"]; // Paths to snow images
const snowCount = 75; // Number of snowflakes
const hideSnowTime = 0; // Seconds before snow disappears (0 = never)
const snowDistance = "pageheight"; // "windowheight" or "pageheight"

// Add spinning animation CSS
const snowStyle = document.createElement("style");
snowStyle.innerHTML = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .snowflake img {
    animation: spin 5s linear infinite;
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
let snowflakeImageIndex = 0; // Track the current image index
class Snowflake {
  constructor(id) {
    this.el = document.createElement("div");
    this.el.className = "snowflake";
    this.el.style.position = "absolute";
    this.el.style.zIndex = id;

    // Use the next image in the sequence and update the index
    const imageSrc = snowImages[snowflakeImageIndex];
    snowflakeImageIndex = (snowflakeImageIndex + 1) % snowImages.length;

    this.el.innerHTML = `<img src="${imageSrc}" alt="snowflake">`;
    snowContainer.appendChild(this.el);

    this.reset();
  }

  reset() {
    const { width, height } = getDocumentDimensions();
    this.x = Math.random() * (width - 50);
    this.y = Math.random() * height;
    this.amplitude = Math.random() * 20;
    this.stepX = 0.02 + Math.random() / 10;
    this.stepY = 0.7 + Math.random();
    this.dx = 0;

    // Randomize size and apply blur
    const scale = 0.5 + Math.random() * 1.5; // Scale between 0.5 and 2.0
    const blurStrength = ((scale - 0.5) / 1.5) * 5; // Blur proportional to size
    this.el.style.transform = `scale(${scale})`;
    this.el.style.filter = `blur(${blurStrength}px)`;
  }

  updatePosition() {
    this.dx += this.stepX;
    this.y += this.stepY;

    const { width, height } = getDocumentDimensions();
    if (this.y > height - 50) {
      if (hideSnowTime > 0) {
        this.el.style.visibility = "hidden";
      } else {
        this.reset();
        this.y = 0;
      }
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

    this.update = this.update.bind(this);
    this.start();
  }

  update() {
    this.snowflakes.forEach(snowflake => snowflake.updatePosition());
    this.animationFrame = requestAnimationFrame(this.update);
  }

  start() {
    this.update();
    if (hideSnowTime > 0) {
      this.hideTimeout = setTimeout(() => this.stop(), hideSnowTime * 1000);
    }
  }

  stop() {
    cancelAnimationFrame(this.animationFrame);
    this.snowflakes.forEach(snowflake => (snowflake.el.style.visibility = "hidden"));
  }
}

// Start the snow effect if supported
if ("requestAnimationFrame" in window) {
  new SnowEffect();
}
