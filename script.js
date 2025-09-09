// JS здесь не обязателен, но для примера можно добавить небольшое событие
const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    // Можно добавить дополнительные эффекты, если нужно
    console.log(`${btn.textContent} hovered`);
  });
});
