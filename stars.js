function randomSign() {
    // Return 1 or -1 based on a random number
    return Math.random() >= 0.5 ? 1 : -1;
}

function random(multiplier = 1, addition = 0) {
    return String(Math.floor(Math.random() * multiplier) + addition);
}

function stars() {
    let e = document.createElement("div");
    e.setAttribute("class", "star");
    document.body.appendChild(e);
    e.style.left = `${random(innerWidth)}px`;
    e.style.fontSize = `${random(20, 12)}px`;
    e.style.filter = `hue-rotate(${random(360)}deg)`;
    e.style.animationDuration = `${random(3, 2)}s`;
    e.style.setProperty("--random-drop", `${random(50, 50)}vh`);
    let spin = randomSign() * random(360, 360);
    e.style.setProperty("--spin-80", `${spin * Math.random()}deg`);
    e.style.setProperty("--spin-full", `${spin}deg`);

    setTimeout(() => {
        document.body.removeChild(e);
        e = null;
    }, 5000);
}

setInterval(() => {
    stars();
}, 25);