let questions = [];
let currentIndex = 0;
let score = 0;

const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const quiz = document.getElementById('quiz');
const qCounter = document.getElementById('questionCounter');
const qEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const resultPanel = document.getElementById('resultPanel');
const scoreText = document.getElementById('scoreText');
const restartBtn = document.getElementById('restartBtn');
const themeToggle = document.getElementById('themeToggle');

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);
themeToggle.addEventListener('click', toggleTheme);

async function startQuiz() {
  const res = await fetch('questions.json');
  questions = await res.json();
  startScreen.classList.add('hidden');
  quiz.classList.remove('hidden');
  currentIndex = 0;
  score = 0;
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];
  qCounter.textContent = `السؤال ${currentIndex + 1} من ${questions.length}`;
  qEl.textContent = q.text;
  feedbackEl.textContent = '';
  choicesEl.innerHTML = '';

  q.choices.forEach((choiceText, idx) => {
    const li = document.createElement('li');
    li.className = 'choice';
    li.textContent = choiceText;
    li.dataset.index = idx;
    li.addEventListener('click', () => onSelect(idx, li));
    choicesEl.appendChild(li);
  });
}

function onSelect(idx, li) {
  const q = questions[currentIndex];
  const isCorrect = idx === q.answer;

  Array.from(choicesEl.children).forEach((c, i) => {
    if (i === q.answer) c.classList.add('correct');
    if (i === idx && !isCorrect) c.classList.add('wrong');
  });

  if (isCorrect) {
    score++;
    feedbackEl.textContent = q.feedback.correct;
    feedbackEl.className = 'success';
  } else {
    feedbackEl.textContent = q.feedback.wrong;
    feedbackEl.className = 'error';
  }

  setTimeout(() => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

function showResult() {
  quiz.classList.add('hidden');
  resultPanel.classList.remove('hidden');
  const total = questions.length;
  const percent = Math.round((score / total) * 100);

  let message = '';
  if (percent >= 80) message = 'ممتاز جدًا!';
  else if (percent >= 60) message = 'جيد!';
  else message = 'بحاجة لمراجعة أكثر.';

  scoreText.textContent = `النتيجة: ${score} من ${total} (${percent}%) — ${message}`;
}

function restartQuiz() {
  resultPanel.classList.add('hidden');
  startScreen.classList.remove('hidden');
}

function toggleTheme() {
  if (document.body.classList.contains('night')) {
    document.body.classList.remove('night');
    document.body.classList.add('day');
    themeToggle.textContent = "ثيم ليلي";
  } else {
    document.body.classList.remove('day');
    document.body.classList.add('night');
    themeToggle.textContent = "ثيم نهاري";
  }
}
