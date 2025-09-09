const overlay1 = document.querySelector('.bg-overlay-1');
const overlay2 = document.querySelector('.bg-overlay-2');
const buttons = document.querySelectorAll('.btn');

let activeOverlay = 1;
let currentGradient = null;
let hideTimeout = null;

function switchGradient(newColor) {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

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

  // Сбрасываем opacity новому слою для плавного старта
  incomingOverlay.style.opacity = '0';

  // Меняем класс градиента
  incomingOverlay.className = `bg-overlay bg-overlay-${activeOverlay} ${newColor}`;

  // Небольшая задержка, чтобы браузер применил класс
  setTimeout(() => {
    incomingOverlay.style.opacity = '1';
    outgoingOverlay.style.opacity = '0';
  }, 20);

  currentGradient = newColor;
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const btnColor = btn.classList.contains('blue') ? 'blue' :
                     btn.classList.contains('pink') ? 'pink' :
                     btn.classList.contains('green') ? 'green' : null;

    if (!btnColor) return;

    if (currentGradient === btnColor) {
      overlay1.style.opacity = '0';
      overlay2.style.opacity = '0';
      currentGradient = null;

      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        overlay1.className = 'bg-overlay bg-overlay-1';
        overlay2.className = 'bg-overlay bg-overlay-2';
      }, 1200);
      return;
    }

    switchGradient(btnColor);
  });
});