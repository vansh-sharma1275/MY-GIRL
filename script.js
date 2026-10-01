const flowerImages = [
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f338.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f33c.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f339.png",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f33a.png"
];

const letterSection = document.getElementById("letter-section");
const quizSection = document.getElementById("quiz-section");
const rewardSection = document.getElementById("reward-section");
const openBtn = document.getElementById("open-btn");
const noBtn = document.getElementById("no-btn");
const quizBox = document.getElementById("quiz-box");
const questionCounter = document.getElementById("question-counter");
const scoreLabel = document.getElementById("score-label");
const progressFill = document.getElementById("progress-fill");
const surpriseBox = document.getElementById("surprise-box");
const surpriseMessage = document.getElementById("surprise-message");

let questionIndex = 0;
let score = 0;
let letterOpened = false;
let quizFinished = false;

const quiz = [
    {
        question: "Which emoji best matches the mood of this website?",
        answers: ["💖 Love", "😴 Sleep", "🍕 Pizza", "🚀 Space"],
        correct: 0
    },
    {
        question: "What is falling across the page?",
        answers: ["Snowflakes", "Flowers", "Stars", "Leaves"],
        correct: 1
    },
    {
        question: "What do you unlock by getting every quiz answer right?",
        answers: ["A crown", "A pizza", "A new laptop", "Nothing"],
        correct: 0
    },
    {
        question: "What is the main surprise waiting on this page?",
        answers: ["A love letter", "A math exam", "A weather report", "A shopping list"],
        correct: 0
    },
    {
        question: "What should you do if you want to experience the page again?",
        answers: ["Close the browser", "Press Start again", "Delete the page", "Turn off JavaScript"],
        correct: 1
    }
];

const surprises = [
    "You are officially awarded unlimited virtual flowers today. 🌸💗",
    "Achievement unlocked: Professional Smile Maker. Your reward is one giant virtual hug! 🤗💖",
    "Secret message: you make ordinary moments feel a little more special. ✨",
    "You found the hidden surprise! Now go enjoy your well-deserved flowers. 💐"
];

function createFlower() {
    const flower = document.createElement("img");
    flower.src = flowerImages[Math.floor(Math.random() * flowerImages.length)];
    flower.className = "flower";
    flower.alt = "";
    flower.style.left = Math.random() * 100 + "vw";
    flower.style.top = "-50px";
    flower.style.width = flower.style.height = (24 + Math.random() * 20) + "px";

    const duration = 5 + Math.random() * 5;
    const drift = (Math.random() - 0.5) * 140;
    const start = performance.now();
    const startX = parseFloat(flower.style.left);

    document.getElementById("flowers-animation").appendChild(flower);

    function animate(now) {
        const progress = Math.min((now - start) / (duration * 1000), 1);
        flower.style.top = `${progress * (window.innerHeight + 80) - 50}px`;
        flower.style.left = `calc(${startX}vw + ${drift * progress}px)`;
        flower.style.transform = `rotate(${progress * 720}deg)`;
        flower.style.opacity = String(1 - progress * 0.25);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            flower.remove();
        }
    }

    requestAnimationFrame(animate);
}

setInterval(createFlower, 800);
for (let i = 0; i < 8; i++) {
    setTimeout(createFlower, i * 350);
}

function showLetter() {
    letterOpened = true;

    letterSection.innerHTML = `
        <div class="section-icon">💌</div>
        <div id="letter">
            <div class="letter-top">♡ A special letter ♡</div>
            <h2>To My Beautiful Girlfriend 💖</h2>
            <p>
                Happy Girlfriend's Day, my love! 🌸
                <br><br>
                I just want to remind you how much you mean to me.
                Thank you for always being here, caring, supporting and
                bringing beautiful moments into my life.
                <br><br>
                I hope today brings you as much happiness as you bring
                to the people around you. You deserve all the flowers,
                smiles and little surprises. 🌷
                <br><br>
                Forever yours,
                <br>
                ❤️
            </p>
        </div>
        <button class="primary-btn continue-btn" id="start-quiz-btn">Continue to the quiz 🧠</button>
    `;

    unlockReward("reward-letter");
    document.getElementById("start-quiz-btn").addEventListener("click", startQuiz);
    burstHearts();
}

function askAgain() {
    const messages = [
        "Are you sure? There is a tiny surprise waiting. 👀",
        "Okay... but the flowers are getting impatient. 🌸",
        "One more chance? The letter is still here. 💌",
        "Pretty please? It took all this JavaScript to make it! 😭",
        "The quiz is waiting too! 🧠💗"
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];

    letterSection.innerHTML = `
        <div class="section-icon">🥺</div>
        <h2>${message}</h2>
        <p class="greeting">No pressure — choose whenever you're ready.</p>
        <div class="button-group">
            <button class="primary-btn" id="try-open-btn">Okay, open it! 💗</button>
            <button class="secondary-btn" id="try-no-btn">Not yet</button>
        </div>
    `;

    document.getElementById("try-open-btn").addEventListener("click", showLetter);
    document.getElementById("try-no-btn").addEventListener("click", askAgain);
}

function startQuiz() {
    quizSection.classList.remove("hidden");
    rewardSection.classList.remove("hidden");
    quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
    questionIndex = 0;
    score = 0;
    quizFinished = false;
    renderQuestion();
}

function renderQuestion() {
    const current = quiz[questionIndex];
    const total = quiz.length;

    questionCounter.textContent = `Question ${questionIndex + 1} of ${total}`;
    scoreLabel.textContent = `💗 ${score} hearts`;
    progressFill.style.width = `${(questionIndex / total) * 100}%`;

    quizBox.innerHTML = `
        <div class="question-card">
            <div class="question-number">Question ${questionIndex + 1}</div>
            <h3>${current.question}</h3>
            <div class="answers">
                ${current.answers.map((answer, i) => `
                    <button class="answer-btn" data-index="${i}">
                        <span>${String.fromCharCode(65 + i)}</span>
                        ${answer}
                    </button>
                `).join("")}
            </div>
            <p class="quiz-feedback" id="quiz-feedback"></p>
        </div>
    `;

    document.querySelectorAll(".answer-btn").forEach(btn => {
        btn.addEventListener("click", () => chooseAnswer(Number(btn.dataset.index)));
    });
}

function chooseAnswer(answerIndex) {
    const current = quiz[questionIndex];
    const buttons = document.querySelectorAll(".answer-btn");
    const feedback = document.getElementById("quiz-feedback");

    buttons.forEach(button => button.disabled = true);

    if (answerIndex === current.correct) {
        score++;
        buttons[answerIndex].classList.add("correct");
        feedback.textContent = "Correct! 💖 +1 heart";
        feedback.className = "quiz-feedback good";
        burstHearts();
    } else {
        buttons[answerIndex].classList.add("wrong");
        buttons[current.correct].classList.add("correct");
        feedback.textContent = `Almost! The answer was ${current.answers[current.correct]}. 🌷`;
        feedback.className = "quiz-feedback";
    }

    scoreLabel.textContent = `💗 ${score} hearts`;
    progressFill.style.width = `${((questionIndex + 1) / quiz.length) * 100}%`;

    setTimeout(() => {
        questionIndex++;

        if (questionIndex < quiz.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    }, 1000);
}

function finishQuiz() {
    quizFinished = true;
    const percentage = Math.round((score / quiz.length) * 100);

    quizBox.innerHTML = `
        <div class="result-card">
            <div class="result-emoji">${score === quiz.length ? "👑" : "🌟"}</div>
            <h3>Quiz complete!</h3>
            <p>You collected <strong>${score} / ${quiz.length}</strong> hearts (${percentage}%).</p>
            <p>${getResultMessage()}</p>
            <button class="primary-btn" id="replay-btn">Play again 🔄</button>
        </div>
    `;

    document.getElementById("replay-btn").addEventListener("click", startQuiz);
    progressFill.style.width = "100%";

    unlockReward("reward-quiz");

    if (score === quiz.length) {
        unlockReward("reward-perfect");
    }

    if (letterOpened && quizFinished) {
        unlockReward("reward-surprise");
        revealSurprise();
    }

    rewardSection.scrollIntoView({ behavior: "smooth", block: "center" });
    burstHearts();
}

function getResultMessage() {
    if (score === quiz.length) return "PERFECT! The crown belongs to you. 👑💖";
    if (score >= 4) return "Almost perfect! You definitely earned those flowers. 🌸";
    if (score >= 3) return "Nice! A few more flowers are heading your way. 🌷";
    return "You still get flowers because this is a love website, not a strict exam. 💐";
}

function unlockReward(id) {
    const reward = document.getElementById(id);
    if (!reward) return;

    reward.classList.remove("locked");
    reward.classList.add("unlocked");

    const status = reward.querySelector(".status");
    if (status) status.textContent = "✨ Unlocked!";
}

function revealSurprise() {
    surpriseBox.classList.remove("hidden");
    surpriseMessage.textContent = surprises[Math.floor(Math.random() * surprises.length)];
}

document.getElementById("another-btn").addEventListener("click", () => {
    surpriseMessage.textContent = surprises[Math.floor(Math.random() * surprises.length)];
    burstHearts();
});

document.getElementById("reset-btn").addEventListener("click", () => {
    questionIndex = 0;
    score = 0;
    letterOpened = false;
    quizFinished = false;

    quizSection.classList.add("hidden");
    rewardSection.classList.add("hidden");
    surpriseBox.classList.add("hidden");

    document.querySelectorAll(".reward").forEach(reward => {
        reward.classList.remove("unlocked");
        reward.classList.add("locked");
        reward.querySelector(".status").textContent = "🔒 Locked";
    });

    letterSection.innerHTML = `
        <div class="section-icon">💌</div>
        <h2>First, there's a letter...</h2>
        <p class="greeting">Someone wrote something special for you. Would you like to open it?</p>
        <div class="button-group">
            <button class="primary-btn" id="open-btn">Yes, open it! 💗</button>
            <button class="secondary-btn" id="no-btn">Not yet 🙈</button>
        </div>
    `;

    document.getElementById("open-btn").addEventListener("click", showLetter);
    document.getElementById("no-btn").addEventListener("click", askAgain);

    window.scrollTo({ top: 0, behavior: "smooth" });
});

openBtn.addEventListener("click", showLetter);
noBtn.addEventListener("click", askAgain);

function burstHearts() {
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement("span");
        heart.className = "burst-heart";
        heart.textContent = ["💗", "💖", "💕", "🌸"][Math.floor(Math.random() * 4)];
        heart.style.left = `${35 + Math.random() * 30}%`;
        heart.style.top = `${35 + Math.random() * 20}%`;
        heart.style.setProperty("--x", Math.random());
        heart.style.animationDelay = `${Math.random() * 0.2}s`;
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1400);
    }
}
