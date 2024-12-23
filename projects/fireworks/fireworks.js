/******************************************
 * Fireworks Effect Script
 ******************************************/

// Configuration
const fireworksDuration = 20000; // Duration of fireworks show in milliseconds
const particleColors = ["#FF7800", "#F80032", "#FF00A0", "#8C28FF", "#0023FF", "#1798FF"]; // Sky colours
const maxParticles = 100; // Number of particles per explosion
const gravity = 0.1; // Gravity effect on particles
const explosionRadius = 200; // Radius of explosion

// Add CSS for particles
const fireworkStyle = document.createElement("style");
fireworkStyle.innerHTML = `
  .firework-particle {
    position: absolute;
    border-radius: 50%;
    will-change: transform, opacity;
    pointer-events: none;
  }
  #fireworks-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    pointer-events: none;
    z-index: 9999;
  }
`;
document.head.appendChild(fireworkStyle);

// Create container for fireworks
const fireworksContainer = document.createElement("div");
fireworksContainer.id = "fireworks-container";
document.body.appendChild(fireworksContainer);

// Utility function to create random values within a range
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to create particles for the explosion
function createExplosion(x, y) {
  for (let i = 0; i < maxParticles; i++) {
    const particle = document.createElement("div");
    const size = randomBetween(4, 8);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
    particle.style.position = "absolute";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.className = "firework-particle";
    fireworksContainer.appendChild(particle);

    // Initial speed and direction
    const angle = randomBetween(0, 2 * Math.PI);
    const speed = randomBetween(2, 5);
    let speedX = Math.cos(angle) * speed;
    let speedY = Math.sin(angle) * speed;

    let posX = x;
    let posY = y;

    // Particle update loop
    function updateParticle() {
      speedY += gravity; // Apply gravity
      posX += speedX;
      posY += speedY;

      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.opacity = `${Math.max(0, 1 - (posY - y) / explosionRadius)}`; // Fade out based on distance

      // Remove particle when it fades completely
      if (parseFloat(particle.style.opacity) <= 0) {
        particle.remove();
      } else {
        requestAnimationFrame(updateParticle);
      }
    }

    requestAnimationFrame(updateParticle);
  }
}

// Function to launch fireworks
function launchFirework() {
  const startX = randomBetween(50, window.innerWidth - 50);
  const startY = window.innerHeight;
  const targetY = randomBetween(50, window.innerHeight / 2);

  const firework = document.createElement("div");
  firework.style.width = "6px";
  firework.style.height = "20px";
  firework.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
  firework.style.position = "absolute";
  firework.style.left = `${startX}px`;
  firework.style.top = `${startY}px`;
  firework.style.borderRadius = "3px";
  firework.style.boxShadow = "#e8ff17 0 5px 2px";
  firework.className = "firework-particle";
  fireworksContainer.appendChild(firework);

  let posY = startY;

  function updateFirework() {
    posY -= 5; // Move upward
    firework.style.top = `${posY}px`;

    // When the firework reaches its target height, explode
    if (posY <= targetY) {
      firework.remove();
      createExplosion(startX, posY); // Trigger explosion
      return; // Exit loop after explosion
    }

    requestAnimationFrame(updateFirework);
  }

  requestAnimationFrame(updateFirework);
}

// Start the fireworks show
const fireworksInterval = setInterval(launchFirework, 500); // Launch a firework every 500ms

// Stop the fireworks after the set duration
setTimeout(() => clearInterval(fireworksInterval), fireworksDuration);
