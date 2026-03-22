import './style.css'
import questionsData from './questions.json'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <header>
      <h1>調理師試験対策アプリ</h1>
      <p class="subtitle">ランダムに出題される問題を解いて実力をチェックしましょう</p>
    </header>
    
    <main id="quiz-container" class="card">
      <div id="start-screen">
        <div class="stats">
          <p>収録問題数: <span class="highlight">${questionsData.length}</span> 問</p>
        </div>
        <button id="start-btn" class="primary-btn">スタート</button>
      </div>

      <div id="question-screen" class="hidden">
        <div class="progress-bar">
          <div id="progress" class="progress"></div>
        </div>
        <div class="question-header">
          <span id="question-number" class="badge">第 1 問</span>
          <span id="score" class="score-display">スコア: 0</span>
        </div>
        <h2 id="question-text" class="question-text"></h2>
        <div id="options-container" class="options-container"></div>
        <div id="feedback-container" class="feedback hidden">
          <p id="feedback-text"></p>
          <button id="next-btn" class="secondary-btn">次の問題へ</button>
        </div>
      </div>

      <div id="result-screen" class="hidden">
        <h2>結果発表</h2>
        <div class="final-score">
          <span id="final-score-text"></span> / <span id="total-questions"></span> 問正解
        </div>
        <p id="result-message" class="result-message"></p>
        <button id="restart-btn" class="primary-btn">もう一度挑戦する</button>
      </div>
    </main>
  </div>
`

// Game State
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
const TOTAL_QUESTIONS = Math.min(5, questionsData.length); // 1プレイ最大5問

// DOM Elements
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionNumberEl = document.getElementById('question-number');
const scoreEl = document.getElementById('score');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressEl = document.getElementById('progress');

const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback-text');

const finalScoreText = document.getElementById('final-score-text');
const totalQuestionsText = document.getElementById('total-questions');
const resultMessage = document.getElementById('result-message');

// Initialize Game
function initGame() {
    currentQuestions = [...questionsData].sort(() => 0.5 - Math.random()).slice(0, TOTAL_QUESTIONS);
    currentQuestionIndex = 0;
    score = 0;

    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');

    updateScore();
    showQuestion();
}

function showQuestion() {
    resetState();

    const currentQ = currentQuestions[currentQuestionIndex];
    questionNumberEl.textContent = `第 ${currentQuestionIndex + 1} 問`;
    questionTextEl.textContent = currentQ.question;

    // Update progress bar
    const progressPercent = ((currentQuestionIndex) / TOTAL_QUESTIONS) * 100;
    progressEl.style.width = `${progressPercent}%`;

    currentQ.options.forEach((optionText, index) => {
        const button = document.createElement('button');
        button.innerText = optionText;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(button, index + 1, currentQ.answer));
        optionsContainer.appendChild(button);
    });
}

function resetState() {
    nextBtn.classList.add('hidden');
    feedbackContainer.classList.add('hidden');
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function selectOption(selectedButton, selectedIndex, correctIndex) {
    // Disable all options
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;

        // Style correct option
        if (Array.from(optionsContainer.children).indexOf(button) + 1 === correctIndex) {
            button.classList.add('correct');
        }
    });

    feedbackContainer.classList.remove('hidden');
    nextBtn.classList.remove('hidden');

    if (selectedIndex === correctIndex) {
        selectedButton.classList.add('correct');
        score++;
        updateScore();
        feedbackText.innerHTML = '<span class="success-icon">⭕</span> 正解！';
        feedbackText.className = 'feedback-text success';
    } else {
        selectedButton.classList.add('wrong');
        feedbackText.innerHTML = '<span class="error-icon">❌</span> 残念、不正解...';
        feedbackText.className = 'feedback-text error';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < TOTAL_QUESTIONS) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    questionScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    finalScoreText.textContent = score;
    totalQuestionsText.textContent = TOTAL_QUESTIONS;

    const percentage = (score / TOTAL_QUESTIONS) * 100;
    if (percentage === 100) {
        resultMessage.textContent = 'パーフェクト！素晴らしい成績です💯';
    } else if (percentage >= 80) {
        resultMessage.textContent = '合格圏内です！その調子で頑張りましょう✨';
    } else if (percentage >= 60) {
        resultMessage.textContent = 'あと少し！復習を頑張りましょう📚';
    } else {
        resultMessage.textContent = 'もう少し勉強が必要かも？頑張って！💪';
    }
}

function updateScore() {
    scoreEl.textContent = `スコア: ${score}`;
}

// Event Listeners
startBtn.addEventListener('click', initGame);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', initGame);
