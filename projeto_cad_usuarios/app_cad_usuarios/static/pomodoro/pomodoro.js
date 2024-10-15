document.addEventListener("DOMContentLoaded", () => {
    let timer; // Para armazenar o timer
    let isRunning = false; // Para saber se o timer está em execução
    let totalTime = 25 * 60; // 25 minutos em segundos
    let timeLeft = totalTime; // Tempo restante

    const minutesDisplay = document.getElementById("minutes");
    const secondsDisplay = document.getElementById("seconds");
    const startStopButton = document.getElementById("start-stop");
    const resetButton = document.getElementById("reset");

    // Função para atualizar o display do timer
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
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
        stopTimer();
        timeLeft = totalTime; // Reseta o tempo restante para 25 minutos
        updateDisplay(); // Atualiza o display
    }

    // Adiciona os eventos de clique
    startStopButton.addEventListener("click", () => {
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    resetButton.addEventListener("click", resetTimer);

    // Inicializa o display
    updateDisplay();
});
