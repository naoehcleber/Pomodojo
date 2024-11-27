document.addEventListener('DOMContentLoaded', () => {
  const goalForm = document.getElementById('goalForm');
  const newGoalInput = document.getElementById('newGoal');
  const goalList = document.getElementById('goalList');

  let goals = JSON.parse(localStorage.getItem('dailyGoals')) || [];

  function saveGoals() {
      localStorage.setItem('dailyGoals', JSON.stringify(goals));
  }

  function renderGoals() {
      goalList.innerHTML = ''; // Limpa a lista de metas antes de renderizar novamente
      goals.forEach((goal, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
              <input type="checkbox" id="goal${index}" ${goal.completed ? 'checked' : ''}>
              <label for="goal${index}" class="${goal.completed ? 'completed' : ''}">${goal.text}</label>
              <button class="deleteBtn">Deletar</button>
          `;

          const checkbox = li.querySelector('input[type="checkbox"]');
          checkbox.addEventListener('change', () => toggleGoal(index));

          const deleteBtn = li.querySelector('.deleteBtn');
          deleteBtn.addEventListener('click', () => deleteGoal(index));

          goalList.appendChild(li);
      });
  }

  function addGoal(text) {
      goals.push({ text, completed: false });
      saveGoals();
      renderGoals();
  }

  function toggleGoal(index) {
      goals[index].completed = !goals[index].completed;
      saveGoals();
      renderGoals();
  }

  function deleteGoal(index) {
      goals.splice(index, 1);
      saveGoals();
      renderGoals();
  }

  goalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const goalText = newGoalInput.value.trim();
      if (goalText) {
          addGoal(goalText);
          newGoalInput.value = ''; // Limpa o campo de input após adicionar a meta
      }
  });

  renderGoals(); // Renderiza as metas ao carregar a página
});
