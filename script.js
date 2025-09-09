const overlay1 = document.querySelector('.bg-overlay-1');
const overlay2 = document.querySelector('.bg-overlay-2');
const buttons = document.querySelectorAll('.btn');
let activeOverlay = 1;
let currentGradient = null;
let hideTimeout = null;
const maxShiftPercent = 15;
let animationFrameId = null;
let autoParallaxId = null;

const balls = {
  blue: Array.from(document.querySelectorAll('.blue-ball')),
  pink: Array.from(document.querySelectorAll('.pink-ball')),
  green: Array.from(document.querySelectorAll('.green-ball'))
};
const ballData = {};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function startAutoParallax() {
  let time = 0;
  let baseShiftX = 50, baseShiftY = 50;
  function updateParallax() {
    time += 0.01;
    // Автопарллакс остается, но без влияния мыши
    const adjustedTime = time; // Убрал speedMultiplier
    let shiftX = baseShiftX + Math.sin(adjustedTime) * maxShiftPercent;
    let shiftY = baseShiftY + Math.cos(adjustedTime * 0.8) * maxShiftPercent;
    // Убрал добавки mouseVelX/mouseVelY для фона
    const pos = `${shiftX}% ${shiftY}%`;
    if (activeOverlay === 1 && currentGradient) overlay1.style.backgroundPosition = pos;
    else if (activeOverlay === 2 && currentGradient) overlay2.style.backgroundPosition = pos;
    autoParallaxId = requestAnimationFrame(updateParallax);
  }
  updateParallax();
}

function stopAutoParallax() {
  if (autoParallaxId) {
    cancelAnimationFrame(autoParallaxId);
    autoParallaxId = null;
  }
}

function startBallsMovement(theme) {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  balls[theme].forEach((ball, index) => {
    ball.style.left = randomBetween(5, 95) + 'vw';
    ball.style.bottom = randomBetween(5, 55) + 'vh';
    ball.style.opacity = randomBetween(0.5, 1.0); // Разнообразная яркость (opacity)
    ball.style.transform = 'scale(0.3)';
    ballData[ball] = {
      x: parseFloat(ball.style.left) / 100 * window.innerWidth,
      y: window.innerHeight - parseFloat(ball.style.bottom) / 100 * window.innerHeight,
      dx: randomBetween(-8, 8), // Увеличил диапазон скорости для разнообразия
      dy: randomBetween(-8, 8),
      speed: randomBetween(1.5, 6), // Разнообразная скорость
      angle: randomBetween(0, 360),
      baseSpeed: randomBetween(1.5, 6),
      brightness: randomBetween(0.5, 1.0), // Добавил яркость через фильтр
      wiggleX: 0, wiggleY: 0 // Для дополнительного хаоса
    };
  });

  function animateBalls() {
    balls[theme].forEach(ball => {
      if (!ballData[ball]) return;
      const data = ballData[ball];
      
      // Добавил хаос: угол меняется сильнее, плюс "вибрация" для разнообразия
      data.angle += randomBetween(-50, 50); // Увеличил хаос угла
      data.wiggleX += randomBetween(-2, 2); // Вибрация X
      data.wiggleY += randomBetween(-2, 2); // Вибрация Y
      
      data.dx = Math.cos(data.angle * Math.PI / 180) * data.speed + data.wiggleX;
      data.dy = Math.sin(data.angle * Math.PI / 180) * data.speed + data.wiggleY;
      
      // Убрал влияние мыши на скорость — теперь только авто
      data.speed += (data.baseSpeed - data.speed) * 0.05; // Плавный возврат
      
      data.x += data.dx;
      data.y += data.dy;
      
      // Мягкий отскок
      if (data.x <= 0 && data.dx < 0) data.dx = -data.dx;
      else if (data.x >= window.innerWidth && data.dx > 0) data.dx = -data.dx;
      
      if (data.y <= 0 && data.dy < 0) data.dy = -data.dy;
      else if (data.y >= window.innerHeight && data.dy > 0) data.dy = -data.dy;
      
      data.x = Math.max(0, Math.min(window.innerWidth, data.x));
      data.y = Math.max(0, Math.min(window.innerHeight, data.y));
      
      ball.style.left = (data.x / window.innerWidth * 100) + '%';
      ball.style.top = (data.y / window.innerHeight * 100) + '%';
      
      const scale = 0.3 + Math.abs(Math.sin(Date.now() / 2000 + index)) * 1.2; // Разнообразный рост по индексу
      ball.style.transform = `scale(${scale})`;
      
      // Разнообразная яркость через opacity и фильтр brightness
      const opacityPulse = 0.5 + Math.abs(Math.sin(Date.now() / 1500 + index * 0.5)) * 0.5; // Пульсация
      ball.style.opacity = data.brightness * opacityPulse;
      ball.style.filter = `blur(40px) brightness(${data.brightness})`;
    });
    
    animationFrameId = requestAnimationFrame(animateBalls);
  }
  animateBalls();
}

function stopBallsMovement() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// Убрал обработчик движения мыши
// window.addEventListener('mousemove', ...);

function switchGradient(newTheme) {
  if (hideTimeout) clearTimeout(hideTimeout);
  stopAutoParallax();
  stopBallsMovement();
  let incomingOverlay, outgoingOverlay;
  if (activeOverlay === 1) {
    incomingOverlay = overlay2;
    outgoingOverlay = overlay1;
    activeOverlay = 2;
  } else {
    incomingOverlay = overlay1;
    outgoingOverlay = overlay2;
    activeOverlay = 1;
  }
  incomingOverlay.style.backgroundPosition = '50% 50%';
  outgoingOverlay.style.backgroundPosition = '50% 50%';
  incomingOverlay.style.opacity = '0';
  incomingOverlay.className = `bg-overlay bg-overlay-${activeOverlay} ${newTheme}`;
  setTimeout(() => {
    incomingOverlay.style.opacity = '0.6';
    outgoingOverlay.style.opacity = '0';
  }, 20);
  currentGradient = newTheme;
  startAutoParallax();
  startBallsMovement(newTheme);
  Object.values(balls).flat().forEach(ball => {
    if (balls[newTheme].indexOf(ball) === -1) {
      ball.style.opacity = '0';
      delete ballData[ball];
    }
  });
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const btnTheme = btn.classList.contains('blue') ? 'blue' :
                     btn.classList.contains('pink') ? 'pink' :
                     btn.classList.contains('green') ? 'green' : null;
    if (!btnTheme) return;
    if (currentGradient === btnTheme) {
      overlay1.style.opacity = '0';
      overlay2.style.opacity = '0';
      currentGradient = null;
      stopAutoParallax();
      stopBallsMovement();
      Object.values(balls).flat().forEach(ball => {
        ball.style.opacity = '0';
        delete ballData[ball];
      });
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        overlay1.className = 'bg-overlay bg-overlay-1';
        overlay2.className = 'bg-overlay bg-overlay-2';
        overlay1.style.backgroundPosition = '50% 50%';
        overlay2.style.backgroundPosition = '50% 50%';
      }, 1200);
      return;
    }
    switchGradient(btnTheme);
  });
});