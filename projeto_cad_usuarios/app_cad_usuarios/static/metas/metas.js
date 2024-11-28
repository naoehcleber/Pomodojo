
document.addEventListener('DOMContentLoaded', () => {
  const goalForm = document.getElementById('goalForm');
  const newGoalInput = document.getElementById('newGoal');
  const goalList = document.getElementById('goalList');

  let goals = JSON.parse(localStorage.getItem('dailyGoals')) || [];

  function saveGoals() {
      localStorage.setItem('dailyGoals', JSON.stringify(goals));
  }

  function saveGoalsToBackend(goal){
    fetch('/save-goal/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken() // Include the CSRF token
        },
        body: JSON.stringify(goal)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message); // Success message
        } else if (data.error) {
            console.error(data.error); // Error message
        }
    })
    .catch(error => console.error('Error:', error));
  }

  function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
    return cookieValue || '';
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
        const newGoal = { text: goalText, completed: false };
        addGoal(goalText); // Add it locally
        saveGoalsToBackend(newGoal); // Send it to the backend
        newGoalInput.value = ''; // Clear the input
    }
  });
  
  renderGoals(); // Renderiza as metas ao carregar a página
});

