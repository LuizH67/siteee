// CONFIGURAÇÕES DO SITE — personalize aqui!
const DIA_ANIVERSARIO = 31;
// O mês também pode ser escolhido na página. O padrão abaixo é outubro (10).
// Data de início do namoro: coloque o ano, mês e dia quando quiser adicionar
// um contador de tempo de relacionamento.
const DATA_INICIO_NAMORO = null; // exemplo: "2025-06-14"

const monthSelect = document.getElementById("birthday-month");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const countdownMessage = document.getElementById("countdown-message");
const birthdayState = document.getElementById("birthday-state");
let confettiStartedFor = "";
let confettiAnimation = null;

function nextBirthdayDate(now = new Date()) {
  const month = Number(monthSelect.value); // 1 a 12
  let year = now.getFullYear();
  let target = new Date(year, month - 1, DIA_ANIVERSARIO, 0, 0, 0, 0);

  // Se o dia deste mês já passou, conta para a próxima ocorrência.
  if (target <= now) {
    year += 1;
    target = new Date(year, month - 1, DIA_ANIVERSARIO, 0, 0, 0, 0);
  }
  return target;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const target = nextBirthdayDate(now);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    countdownMessage.textContent = "Chegou o grande dia! Hoje é todinho seu. 💗";
    birthdayState.hidden = false;
    const key = `${target.getFullYear()}-${target.getMonth()}-${target.getDate()}`;
    if (confettiStartedFor !== key) {
      confettiStartedFor = key;
      launchConfetti();
    }
    return;
  }

  daysEl.textContent = pad(Math.floor(diff / 86400000));
  hoursEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
  minutesEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
  secondsEl.textContent = pad(Math.floor((diff % 60000) / 1000));
  birthdayState.hidden = true;
  countdownMessage.textContent = "Cada segundo nos aproxima do seu dia. 💗";
}

monthSelect.addEventListener("change", () => {
  confettiStartedFor = "";
  updateCountdown();
});
updateCountdown();
setInterval(updateCountdown, 1000);

// Menu mobile
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "✕" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Confetes feitos em canvas, sem precisar instalar bibliotecas.
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const colors = ["#ff78ad", "#ffd166", "#ffffff", "#ef4c8a", "#c9a0ff", "#8ee3cf"];
  const pieces = Array.from({ length: 220 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -Math.random() * window.innerHeight,
    w: 5 + Math.random() * 7,
    h: 7 + Math.random() * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 5,
    rotation: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.15
  }));

  if (confettiAnimation) cancelAnimationFrame(confettiAnimation);
  const start = performance.now();
  function draw(time) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (time - start < 9000) {
      confettiAnimation = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      confettiAnimation = null;
    }
  }
  confettiAnimation = requestAnimationFrame(draw);
}

// Botão de surpresa: revela mensagem e solta uma chuva extra de confetes.
const surpriseButton = document.getElementById("surprise-button");
const surpriseMessage = document.getElementById("surprise-message");
surpriseButton.addEventListener("click", () => {
  surpriseMessage.hidden = !surpriseMessage.hidden;
  surpriseButton.textContent = surpriseMessage.hidden
    ? "Abrir minha surpresa ✨"
    : "Fechar surpresa 💕";
  if (!surpriseMessage.hidden) launchConfetti();
});

window.addEventListener("resize", () => {
  const canvas = document.getElementById("confetti-canvas");
  canvas.width = window.innerWidth * Math.max(1, window.devicePixelRatio || 1);
  canvas.height = window.innerHeight * Math.max(1, window.devicePixelRatio || 1);
});