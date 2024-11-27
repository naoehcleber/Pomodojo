document.addEventListener('DOMContentLoaded', function () {
  const activeDays = [1, 5, 10, 15, 20, 25];  // Exemplo de dias ativos
  const activities = {
      1: ['Concluiu 5 sessões de foco'],
      5: ['Finalizou tarefa: "Relatório Final"'],
      10: ['Começou novo projeto: "Estudo de Caso"'],
      // Adicione mais atividades por data aqui
  };
  const currentDate = new Date();

  const createCalendar = (year, month) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const days = [];

      // Nome do mês
      days.push(
          `<div class="monthName">${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</div>`
      );

      // Dias da semana
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      dayNames.forEach((name, index) => {
          days.push(
              `<div class="dayName">${name}</div>`
          );
      });

      // Adiciona células vazias para os dias antes do primeiro dia do mês
      for (let i = 0; i < firstDay.getDay(); i++) {
          days.push('<div></div>');
      }

      // Dias do mês
      for (let day = 1; day <= daysInMonth; day++) {
          const isActive = activeDays.includes(day);
          const activityText = activities[day] ? activities[day].join('<br>') : '';
          days.push(
              `<div class="day ${isActive ? 'active' : ''}" data-day="${day}" title="${activityText}">
                  ${day}
              </div>`
          );
      }

      return days.join('');
  };

  document.getElementById('calendar').innerHTML = createCalendar(currentDate.getFullYear(), currentDate.getMonth());

  // Adicionar evento de clique no dia
  document.querySelectorAll('.day').forEach(dayElement => {
      dayElement.addEventListener('click', function () {
          const day = this.getAttribute('data-day');
          const activitiesForDay = activities[day] || [];
          const activityList = activitiesForDay.length ? activitiesForDay.join('<br>') : 'Nenhuma atividade registrada';
          alert(`Atividades para o dia ${day}:\n${activityList}`);
      });
  });
});
