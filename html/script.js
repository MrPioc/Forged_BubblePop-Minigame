let total = 0;
let clicked = 0;
let nextExpected = 1;
let timeout;
let minigameActive = false;
const popSound = new Audio("click.mp3");
popSound.load();

window.addEventListener("message", function(event) {
    const data = event.data;
    if (data.action === "start") {
        startBubbles(data.count, data.time);
    } else if (data.action === "stop") {
        clearMinigame();
    }
});

function startBubbles(count, time) {
    clearMinigame();
    minigameActive = true;

    const container = document.getElementById("bubble-container");
    container.addEventListener('click', onContainerClick);

    total = count;
    clicked = 0;
    nextExpected = 1;

    (async () => {
        const centerX = 50;
        const centerY = 50;
        const spread = 10;

        for (let i = 0; i < count; i++) {
            if (!minigameActive) break;  // STOP spawning if game ended
            createBubble(i, container, centerX, centerY, spread);
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    })();

    timeout = setTimeout(() => {
        if (clicked < total) {
            fetch(`https://${GetParentResourceName()}/bubbleFail`, { method: "POST" });
            clearMinigame();
        }
    }, time * 1000);
}

function onContainerClick(e) {
    if (!e.target.classList.contains('bubble')) {
        clearTimeout(timeout);
        fetch(`https://${GetParentResourceName()}/bubbleFail`, { method: "POST" });
        clearMinigame();
    }
}

function createBubble(i, container, centerX, centerY, spread) {
    const bubble = document.createElement("div");
    bubble.className = "bubble pixel-glow pixel-border float-rotate"; // keep float-rotate if you want subtle movement, else remove it
    bubble.innerText = i + 1;

    bubble.dataset.number = i + 1;

    const offsetX = (Math.random() * spread * 4) - spread;
    const offsetY = (Math.random() * spread * 3) - spread;

    const posX = Math.min(Math.max(centerX + offsetX, 8), 95);
    const posY = Math.min(Math.max(centerY + offsetY, 5), 95);

    bubble.style.left = `${posX}%`;
    bubble.style.top = `${posY}%`;

    // No float timers, bubbles stay where they are

    bubble.addEventListener("click", () => {
    const num = parseInt(bubble.dataset.number);

    // Play sound on every bubble click attempt
    popSound.currentTime = 0; // rewind to start
    popSound.play().catch(e => console.warn("Audio play failed:", e));

    if (num === nextExpected) {
        bubble.remove();
        clicked++;
        nextExpected++;
        if (clicked === total) {
            clearTimeout(timeout);
            fetch(`https://${GetParentResourceName()}/bubbleSuccess`, { method: "POST" });
        }
    } else {
        clearTimeout(timeout);
        fetch(`https://${GetParentResourceName()}/bubbleFail`, { method: "POST" });
        clearMinigame();
    }
});

    container.appendChild(bubble);
}

function clearMinigame() {
    minigameActive = false;

    const container = document.getElementById("bubble-container");
    container.removeEventListener('click', onContainerClick);

    container.innerHTML = "";
    clearTimeout(timeout);
    nextExpected = 1;
}
