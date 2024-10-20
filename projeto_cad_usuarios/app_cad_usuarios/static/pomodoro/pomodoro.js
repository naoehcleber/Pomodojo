document.addEventListener("DOMContentLoaded", () => {
    let timer; // Para armazenar o timer
    let isRunning = false; // Para saber se o timer está em execução
    let timeLeft = 0; // Tempo restante em segundos
    const hoursInput = document.getElementById("hours");
    const minutesInput = document.getElementById("minutes");
    const secondsInput = document.getElementById("seconds");
    const timerDisplay = document.getElementById("timer-display");
    const startStopButton = document.getElementById("start-stop");
    const resetButton = document.getElementById("reset");
    const setTimeButton = document.getElementById("set-time");
    const darkModeButton = document.getElementById("toggle-dark-mode");

    // Função para atualizar o display do timer
    function updateDisplay() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Função que inicia o timer
    function startTimer() {
        if (isRunning) return; // Se já estiver em execução, não faz nada
        isRunning = true;
        startStopButton.textContent = "Stop"; // Muda o texto do botão para "Stop"
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                startStopButton.textContent = "Start"; // Reseta o botão para "Start"
                alert("Tempo esgotado!"); // Adiciona um alerta quando o tempo acabar
            }
        }, 1000);
    }

    // Função que para o timer
    function stopTimer() {
        clearInterval(timer);
        isRunning = false;
        startStopButton.textContent = "Start"; // Reseta o botão para "Start"
    }

    // Função que reseta o timer
    function resetTimer() {
        stopTimer(); // Para o timer
        timeLeft = 0; // Reseta o tempo para 0
        updateDisplay(); // Atualiza o display
    }

    // Define o tempo com o botão "OK"
    setTimeButton.addEventListener("click", () => {
        // Calcula o tempo total em segundos
        timeLeft = (parseInt(hoursInput.value) || 0) * 3600 + (parseInt(minutesInput.value) || 0) * 60 + (parseInt(secondsInput.value) || 0);
        updateDisplay(); // Atualiza o display
    });

    // Adiciona os eventos de clique
    startStopButton.addEventListener("click", () => {
        if (isRunning) {
            stopTimer();
        } else {
            startTimer(); // Inicia o timer
        }
    });

    resetButton.addEventListener("click", () => {
        resetTimer(); // Reseta o cronômetro
    });

    // Inicializa o display
    updateDisplay(); // Exibe o tempo padrão ao carregar

    // Função para alternar entre modo claro e escuro
    function toggleDarkMode() {
        const body = document.body;
        const darkModeEnabled = body.classList.toggle('dark-mode');
        darkModeButton.textContent = darkModeEnabled ? "Modo Claro" : "Modo Escuro";

        // Salva a preferência do modo no localStorage
        localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
    }

    // Verifica se o usuário tem uma preferência salva no localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeButton.textContent = "Modo Claro";
    } else {
        darkModeButton.textContent = "Modo Escuro";
    }

    // Adiciona evento de clique ao botão de modo escuro
    darkModeButton.addEventListener('click', toggleDarkMode);
});
