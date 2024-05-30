const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let dino = {
    x: 50,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    color: "red"
};

let cactus = {
    x: canvas.width,
    y: canvas.height,
    width: 20,
    height: 60,
    speed: 5,
    maxSpeed: 17,
    initialSpeed: 5,
    speedIncrease: 0.25,
    color: {
        start: "#00ff00",
        end: "#00ff00"
    },
    name: "Felly"
};

let isJumping = false;
let isGameOver = false;
let score = 0;
let startTime = null;
let distanceFactor = 1;
const countdownTime = 3;

function startGame() {
    setTimeout(startCountdown, 1000);
}

function startCountdown() {
    let countdown = countdownTime;
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`Starting in ${countdown}`, canvas.width / 2 - 70, canvas.height / 2);
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            startTime = new Date().getTime();
            requestAnimationFrame(update);
        }
    }, 1000);
}

function drawDino() {
    ctx.beginPath();
    ctx.arc(dino.x + dino.width / 2, dino.y + dino.height / 2, 20, 0, Math.PI * 2);
    ctx.fillStyle = dino.color;
    ctx.fill();
    ctx.closePath();
}

function drawCactus() {
    const gradient = ctx.createLinearGradient(cactus.x, cactus.y - cactus.height, cactus.x + cactus.width, cactus.y);
    gradient.addColorStop(0, cactus.color.start);
    gradient.addColorStop(1, cactus.color.end);

    ctx.fillStyle = gradient;
    ctx.fillRect(cactus.x, cactus.y - cactus.height, cactus.width, cactus.height);

    ctx.save();
    ctx.translate(cactus.x + cactus.width / 2, cactus.y - cactus.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(cactus.name, -cactus.height / 2, cactus.width / 4);
    ctx.restore();
}

function update() {
    if (isGameOver) return gameOver();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDino();
    drawCactus();

    dino.y += dino.dy;
    dino.dy += dino.gravity;

    if (dino.y + dino.height > canvas.height - 20) {
        dino.y = canvas.height - dino.height - 20;
        dino.dy = 0;
        isJumping = false;
    }

    cactus.x -= cactus.speed * distanceFactor;
    if (cactus.x + cactus.width < 0) {
        cactus.x = canvas.width;
        if (cactus.speed < cactus.maxSpeed) {
            cactus.speed += cactus.speedIncrease;
        }
    }

    let currentTime = new Date().getTime();
    score = Math.floor((currentTime - startTime) / 10);

    if (score >= 3000 && score < 6000) {
        distanceFactor = 1.2;
    } else {
        distanceFactor = 1;
    }

    if (detectCollision(dino, cactus)) {
        isGameOver = true;
    }

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score} shillings`, 10, 20);

    requestAnimationFrame(update);
}

function detectCollision(dino, cactus) {
    return (
        dino.x < cactus.x + cactus.width &&
        dino.x + dino.width > cactus.x &&
        dino.y < cactus.y &&
        dino.y + dino.height > cactus.y - cactus.height
    );
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Felly Game Over", canvas.width / 2 - 200, canvas.height / 2 - 50);
    ctx.fillText(`Score: ${score} shillings`, canvas.width / 2 - 70, canvas.height / 2 + 50);

    setTimeout(() => {
        isGameOver = false;
        score = 0;
        cactus.x = canvas.width;
        cactus.speed = cactus.initialSpeed;
        distanceFactor = 1;
        dino.y = canvas.height - 60;
        startCountdown();
    }, 4000);
}

window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !isJumping) {
        dino.dy = dino.jumpPower;
        isJumping = true;
    }
});

window.addEventListener("touchstart", () => {
    if (!isJumping) {
        dino.dy = dino.jumpPower;
        isJumping = true;
    }
});

startGame();
