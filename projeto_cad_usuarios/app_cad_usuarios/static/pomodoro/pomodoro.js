// pomodoro.js

let timerInterval;
let isRunning = false;
let minutes = 25;
let seconds = 0;

const startStopButton = document.getElementById("start-stop");
const resetButton = document.getElementById("reset");
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

function updateDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startStopButton.textContent = "Pause";
        timerInterval = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    startStopButton.textContent = "Start";
                    alert("Pomodoro complete!");
                    resetTimer();
                } else {
                    minutes -= 1;
                    seconds = 59;
                }
            } else {
                seconds -= 1;
            }
            updateDisplay();
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        startStopButton.textContent = "Start";
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    minutes = 25;
    seconds = 0;
    startStopButton.textContent = "Start";
    updateDisplay();
}

startStopButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);

// Inicializa a exibição com 25:00
updateDisplay();
