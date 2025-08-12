document.addEventListener('DOMContentLoaded', () => {
  initBackgroundAnimation();
  document.querySelector('.start-button')?.addEventListener('click', switchToTrackerScreen);
  initTaskTracker();
});

// Функция для переключения экрана
function switchToTrackerScreen(e) {
  if (e) e.preventDefault();
  
  const mainScreen = document.getElementById('main-screen');
  const trackerScreen = document.getElementById('tracker-screen');
  
  mainScreen.style.opacity = '0';
  mainScreen.style.transform = 'translateY(-20px)';
  
  setTimeout(() => {
    mainScreen.style.display = 'none';
    trackerScreen.style.display = 'block';
    
    setTimeout(() => {
      trackerScreen.style.opacity = '1';
      trackerScreen.style.transform = 'translateY(0)';
    }, 50);
  }, 500);
}

// Работа трекера задач
function initTaskTracker() {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const tasksCount = document.getElementById('tasks-count');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';
  
  // Загрузка задач
  renderTasks();
  
  // Добавление задачи через кнопку "+" или нажатие клавиши Enter
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  // Фильтрация задач
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
  
  // Очистка завершенных задач
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);
  
  // Функция для добавления задач
  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({
        id: Date.now(),
        text,
        completed: false
      });
      saveTasks();
      taskInput.value = '';
      renderTasks();
    }
  }
  
  // Функция для загрузки задач
  function renderTasks() {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });
    
    if (filteredTasks.length === 0) {
      const emptyMsg = document.createElement('li');
      emptyMsg.textContent = 'Нет задач';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.color = '#2c3e50';
      emptyMsg.style.padding = '20px';
      taskList.appendChild(emptyMsg);
    } else {
      filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
          <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
          <button class="delete-task" data-id="${task.id}">×</button>
        `;
        taskList.appendChild(taskItem);
      });
    }
    
    // Обновление счетчика задач и надписи рядом с ним
    const activeCount = tasks.filter(t => !t.completed).length;
    tasksCount.textContent = `${activeCount} ${getTaskWords(activeCount)}`;

    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', toggleTaskStatus);
    });
    
    document.querySelectorAll('.delete-task').forEach(btn => {
      btn.addEventListener('click', deleteTask);
    });
  }
  
  function toggleTaskStatus(e) {
    const taskId = parseInt(e.target.dataset.id);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = e.target.checked;
      saveTasks();
      renderTasks();
    }
  }
  
  function deleteTask(e) {
    const taskId = parseInt(e.target.dataset.id);
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
  }
  
  function clearCompletedTasks() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  }
  
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Функция для 
  function getTaskWords(count) {
    const lastDigit = count % 10;

    if (lastDigit === 1) return 'активная задача';
    if (lastDigit >= 2 && lastDigit <= 4) return 'активных задачи';
    return 'активных задач';
  }
}

// Анимация фона
function initBackgroundAnimation() {
  setTimeout(() => {
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
  }, 1800);
}