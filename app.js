let gameSeq = [];
let userSeq = [];
let level = 0;
let started = false;

let btns = ["yellow", "purple", "red", "green"];

let heading2 = document.querySelector("h2");

let highestScore = 0;

let hsBox = document.querySelector(".box h3");
hsBox.innerText = `Highest Score: ${highestScore}`;

function startGame() {
    if (!started) {
        started = true;
        levelUp();
    }
}

document.addEventListener("keypress", startGame);
document.addEventListener("click", startGame);

function beep(freq) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.25
    );

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
}

function playColorSound(color) {
    if (color === "red") beep(440);
    else if (color === "yellow") beep(554);
    else if (color === "green") beep(659);
    else if (color === "purple") beep(784);
}

function userFlash(btn) {
    btn.classList.add("userflash");

    setTimeout(() => {
        btn.classList.remove("userflash");
    }, 250);
}

function gameFlash(btn) {
    btn.classList.add("gameflash");

    setTimeout(() => {
        btn.classList.remove("gameflash");
    }, 250);
}

function playSequence() {
    gameSeq.forEach((color, index) => {
        setTimeout(() => {
            let btn = document.querySelector(`.${color}`);

            playColorSound(color);
            gameFlash(btn);
        }, index * 600);
    });
}

function levelUp() {
    userSeq = [];

    level++;

    heading2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * btns.length);
    let randCol = btns[randIdx];

    gameSeq.push(randCol);

    playSequence();
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {

        if (userSeq.length === gameSeq.length) {

            highestScore = Math.max(highestScore, level);

            hsBox.innerText = `Highest Score: ${highestScore}`;

            setTimeout(() => {
                levelUp();
            }, 1000);
        }

    } else {

        beep(150);

        heading2.innerHTML =
            `Game Over! Your score was <b>${level - 1}</b><br>Tap anywhere or press any key to restart`;

        gameOver();

        reset();
    }
}

function buttonPress(event) {

    event.stopPropagation();

    if (!started) return;

    let btn = this;

    let userColor = btn.getAttribute("id");

    playColorSound(userColor);

    userFlash(btn);

    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");

for (let btn of allBtns) {
    btn.addEventListener("click", buttonPress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

function gameOver() {

    document.body.classList.add("game-over");

    setTimeout(() => {
        document.body.classList.remove("game-over");
    }, 200);
}