// Start of Space Engine Protocol
const jet = document.getElementById("fighter-jet");
const arena = document.getElementById("game-container");
const scoreVal = document.getElementById("score-val");
const opName = document.getElementById("op-name");

let score = 0, isPoweredUp = false, isGameActive = false;
let jetX = window.innerWidth / 2 - 22, jetY = window.innerHeight - 100;
const speed = 7, keys = {};

// Start Game Handler
document.getElementById("start-btn").onclick = () => {
    document.getElementById("start-menu").style.display = "none";
    isGameActive = true;
    spawnEnemies();
    autoFire();
    gameLoop();
    setInterval(dropRandomPowerUp, 15000); 
};

// Keyboard Listeners
window.addEventListener("keydown", (e) => keys[e.code] = true);
window.addEventListener("keyup", (e) => keys[e.code] = false);

// PC Mouse Control
arena.addEventListener("mousemove", (e) => {
    if (!isGameActive) return;
    jetX = e.clientX - 22; jetY = e.clientY - 30;
});

// Mobile Touch Logic - Relative Dragging Protocol
let touchStartX = 0, touchStartY = 0;

arena.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

arena.addEventListener("touchmove", (e) => {
    if (!isGameActive) return;
    e.preventDefault(); 

    let touchX = e.touches[0].clientX;
    let touchY = e.touches[0].clientY;

    let deltaX = touchX - touchStartX;
    let deltaY = touchY - touchStartY;

    jetX += deltaX;
    jetY += deltaY;

    // Boundary Protection 
    if (jetX < 0) jetX = 0;
    if (jetX > window.innerWidth - 44) jetX = window.innerWidth - 44;
    if (jetY < 0) jetY = 0;
    if (jetY > window.innerHeight - 80) jetY = window.innerHeight - 80;

    touchStartX = touchX;
    touchStartY = touchY;
}, { passive: false });

// Game Update Loop
function gameLoop() {
    if (!isGameActive) return;
    
    // Keyboard Movement Logic
    if (keys["ArrowLeft"] && jetX > 0) jetX -= speed;
    if (keys["ArrowRight"] && jetX < window.innerWidth - 44) jetX += speed;
    if (keys["ArrowUp"] && jetY > 0) jetY -= speed;
    if (keys["ArrowDown"] && jetY < window.innerHeight - 80) jetY += speed;

    jet.style.left = jetX + "px";
    jet.style.top = jetY + "px";
    requestAnimationFrame(gameLoop);
}

// Shooting System
function createLaser(angle = 0, offset = 20) {
    const laser = document.createElement("div");
    laser.className = "laser";
    laser.style.left = (jetX + offset) + "px";
    laser.style.top = jetY + "px";
    arena.appendChild(laser);

    let moveLaser = setInterval(() => {
        laser.style.top = (laser.offsetTop - 12) + "px";
        if (angle !== 0) laser.style.left = (laser.offsetLeft + angle) + "px";
        
        if (laser.offsetTop < 0 || laser.offsetLeft < 0 || laser.offsetLeft > window.innerWidth) {
            clearInterval(moveLaser); laser.remove();
        }
        checkCollision(laser, moveLaser);
    }, 10);
}

function autoFire() {
    if (!isGameActive) return;
    createLaser(0, 20); 
    if (isPoweredUp) {
        createLaser(-3, 10); 
        createLaser(3, 30);  
    }
    setTimeout(autoFire, 250);
}

// Enemy Protocol
function spawnEnemies() {
    if (!isGameActive) return;
    const enemy = document.createElement("div");
    enemy.className = "enemy";
    enemy.style.left = Math.random() * (window.innerWidth - 40) + "px";
    enemy.style.top = "-50px";
    arena.appendChild(enemy);

    let moveEnemy = setInterval(() => {
        enemy.style.top = (enemy.offsetTop + 4.5) + "px";
        const jRect = jet.getBoundingClientRect();
        const eRect = enemy.getBoundingClientRect();

        if (jRect.left < eRect.right && jRect.right > eRect.left && jRect.top < eRect.bottom && jRect.bottom > eRect.top) {
            if (isPoweredUp) {
                enemy.remove(); clearInterval(moveEnemy);
            } else {
                triggerGameOver();
            }
        }
        if (enemy.offsetTop > window.innerHeight) { clearInterval(moveEnemy); enemy.remove(); }
    }, 20);
    setTimeout(spawnEnemies, 900);
}

function checkCollision(laser, laserInt) {
    document.querySelectorAll(".enemy").forEach(en => {
        const lR = laser.getBoundingClientRect();
        const eR = en.getBoundingClientRect();
        if (lR.left < eR.right && lR.right > eR.left && lR.top < eR.bottom) {
            en.remove(); laser.remove(); clearInterval(laserInt);
            score += 10; scoreVal.innerText = score;
        }
    });
}

// Power-Up Mechanism
function dropRandomPowerUp() {
    if (!isGameActive || isPoweredUp) return;
    const pu = document.createElement("div");
    pu.className = "power-up";
    pu.style.left = Math.random() * (window.innerWidth - 40) + "px";
    pu.style.top = "-50px";
    arena.appendChild(pu);

    let movePu = setInterval(() => {
        pu.style.top = (pu.offsetTop + 3) + "px";
        const jR = jet.getBoundingClientRect();
        const pR = pu.getBoundingClientRect();
        if (jR.left < pR.right && jR.right > pR.left && jR.top < pR.bottom && jR.bottom > pR.top) {
            pu.remove(); clearInterval(movePu); activatePowerUp();
        }
        if (pu.offsetTop > window.innerHeight) { clearInterval(movePu); pu.remove(); }
    }, 20);
}

function activatePowerUp() {
    isPoweredUp = true;
    const shield = document.createElement("div");
    shield.className = "shield";
    jet.appendChild(shield);
    jet.style.transform = "scale(1.3)";

    setTimeout(() => {
        isPoweredUp = false; shield.remove(); jet.style.transform = "scale(1)";
    }, 10000); // 10 seconds of power
}

function triggerGameOver() {
    isGameActive = false;
    document.getElementById("game-over").style.display = "flex";
    document.getElementById("final-score").innerText = score;
}