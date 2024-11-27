var date = new Date();
var dia = date.getDay();

const tarefas = ["Estudar 10 minutos", "Ter uma taxa de foco de 60%", "Completar um ciclo"];
const tarefaAleatoria = tarefas[Math.floor(Math.random()*Array.length)];

console.log(tarefaAleatoria)

document.getElementById('Atividade').innerText = tarefaAleatoria
