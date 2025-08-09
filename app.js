document.addEventListener('DOMContentLoaded', () => {
  // Палитра цветов для квадратов
  const colors = [
    'rgba(77, 77, 77, 0.18)',
    'rgba(146, 146, 146, 0.14)',
    'rgba(175, 175, 175, 0.14)',
    'rgba(224, 224, 224, 0.14)',
    'rgba(44, 44, 44, 0.15)',
    'rgba(88, 88, 88, 0.13)'
  ];

  // Cетка, где квадраты генерируются
  const cols = 12;
  const rows = 2;
  // Контейнер для квадратов
  const shapesContainer = document.querySelector('.shapes');

  // Размеры и позиции уже размещённых квадратов хранятся в этом массиве
  const placedSquares = [];

  // Функция для генерации случайных чисел в диапазоне [a, b)
  function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
  }

  // Проверка пересечения двух квадратов
  function isOverlap(a, b) {
    return !(
      a.right < b.left ||
      a.left > b.right ||
      a.bottom < b.top ||
      a.top > b.bottom
    );
  }

  // Генерация квадратов без пересечений
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Счётчик попыток размещения
      let tries = 0;
      // Максиамльное количество размещений
      let maxTries = 30;
      // Флаг размещения
      let placed = false;

      // Размещение квадрата без пересечений
      while (!placed && tries < maxTries) {
        tries++;
        // Случайный цвет из палитры
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = randomBetween(2.1, 4.2);

        // Горизонтальное позиционирование
        const leftPercent = (c + 0.5) * (100 / cols);
        const leftPx = window.innerWidth * leftPercent / 100 - size * 8;

        // Вертикальное позиционирование
        const verticalSpread = randomBetween(0, 20);
        const topPx = window.innerHeight + verticalSpread;

        // Границы нового квадрата
        const newSquare = {
          left: leftPx,
          top: topPx,
          right: leftPx + size * 16,
          bottom: topPx + size * 16
        };

        // Проверяем пересечение с уже размещёнными квадратами
        let overlap = placedSquares.some(sq => isOverlap(sq, newSquare));
        if (!overlap) {
          // Создаём квадрат
          const shape = document.createElement('div');
          shape.classList.add('shape', 'square');
          shape.style.left = `${leftPercent}%`;
          shape.style.top = `calc(100vh + ${verticalSpread}px)`;
          shape.style.opacity = randomBetween(0.18, 0.35).toFixed(2);
          shape.style.filter = `blur(${randomBetween(0.5, 1.1).toFixed(1)}px)`;
          shape.style.background = color;
          shape.style.borderRadius = '0.5em';
          shape.style.width = `${size}em`;
          shape.style.height = `${size}em`;
          const duration = randomBetween(8, 16).toFixed(1);
          const delay = randomBetween(0, 8).toFixed(1);
          shape.style.animation = `rise ${duration}s linear infinite`;
          shape.style.animationDelay = `${delay}s`;

          // Добавление квадрата в контейнер и сохранение его данных
          shapesContainer.appendChild(shape);
          placedSquares.push(newSquare);
          placed = true;
        }
      }
      // Пропускаем, если невозможно без пересечений
    }
  }
});