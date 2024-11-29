document.addEventListener("DOMContentLoaded", async () => {
    let timer;
    let isRunning = false;
    let timeLeft = 0;
    let inactivityCount = 0;  // Contador de mensagens INATIVO
    const inactivityLimit = 10;  // 10 mensagens INATIVO
    const hoursInput = document.getElementById("hours");
    const minutesInput = document.getElementById("minutes");
    const secondsInput = document.getElementById("seconds");
    const timerDisplay = document.getElementById("timer-display");
    const startStopButton = document.getElementById("start-stop");
    const resetButton = document.getElementById("reset");
    const setTimeButton = document.getElementById("set-time");
    const darkModeButton = document.getElementById("toggle-dark-mode");
    const musicSelect = document.getElementById("music");
    const connectButton = document.getElementById("connect-button");

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioBuffers = {};
    let sourceNode = null;
    let port;

    async function getUserLvl() {
        try {
            const response = await fetch('/get-user-level/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
            });

            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }

            const data = await response.json();
            if (data.level != null) {
                return data.level; // Retorna o nível do usuário
            } else {
                console.error('Erro ao obter nível do usuário:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Erro na função getUserLvl:', error);
            return null;
        }
    }

    async function incrementUserCiclos() {
        try {
            const response = await fetch('/increment-ciclos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
            });

            if (!response.ok) {
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json().then((json) => Promise.reject(json));
                }
            }

            const data = await response.json();
            if (data.ciclos !== undefined) {
                console.log('Ciclos incrementados:', data.ciclos);
                return data.ciclos;
            } else {
                console.error('Erro ao incrementar ciclos:', data.error);
            }
        } catch (error) {
            console.error('Erro na função incrementUserCiclos:', error);
        }
    }

    function loadAudio(url) {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(data => audioContext.decodeAudioData(data))
            .catch(error => console.error('Erro ao carregar áudio:', error));
    }

    function preloadAllAudios() {
        for (let key in audioPaths) {
            loadAudio(audioPaths[key]).then(buffer => {
                audioBuffers[key] = buffer;
            });
        }
    }

    function playAudio(audioKey) {
        if (!audioBuffers[audioKey]) return;

        sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffers[audioKey];
        sourceNode.connect(audioContext.destination);
        sourceNode.start(0);
    }

    function updateDisplay() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        startStopButton.textContent = "Stop";
        playSelectedMusic();
        sendCommandToArduino("START");

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                startStopButton.textContent = "Start";
                alert("Tempo esgotado!");
                getUserLvl().then(userLevel => {
                    console.log('User Level:', userLevel);
                    if (userLevel !== null) {
                        incrementUserCiclos().then(newCiclos => {
                            console.log('Novo valor de ciclos:', newCiclos);
                        });
                    }
                });
                stopAudio();
                sendCommandToArduino("STOP");
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        isRunning = false;
        startStopButton.textContent = "Start";
        stopAudio();
        sendCommandToArduino("STOP");
    }

    function stopAudio() {
        if (sourceNode) {
            sourceNode.stop();
            sourceNode.disconnect();
            sourceNode = null;
        }
    }

    function resetTimer() {
        stopTimer();
        timeLeft = 0;
        updateDisplay();
    }

    setTimeButton.addEventListener("click", () => {
        timeLeft = (parseInt(hoursInput.value) || 0) * 3600 +
            (parseInt(minutesInput.value) || 0) * 60 +
            (parseInt(secondsInput.value) || 0);
        updateDisplay();
    });

    startStopButton.addEventListener("click", () => {
        if (isRunning) {
            stopTimer();
        } else {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            startTimer();
        }
    });

    resetButton.addEventListener("click", resetTimer);

    updateDisplay();

    function toggleDarkMode() {
        const body = document.body;
        const footer = document.querySelector("footer");
        const darkModeEnabled = body.classList.toggle('dark-mode');
        footer.classList.toggle('dark-mode', darkModeEnabled);

        darkModeButton.textContent = darkModeEnabled ? "Modo Claro" : "Modo Escuro";
        localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
    }

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeButton.textContent = "Modo Claro";
    } else {
        darkModeButton.textContent = "Modo Escuro";
    }

    darkModeButton.addEventListener('click', toggleDarkMode);

    function playSelectedMusic() {
        const selectedMusic = musicSelect.value;
        if (selectedMusic === "none") return;

        playAudio(selectedMusic);
    }

    async function connectToArduino() {
        if ('serial' in navigator) {
            try {
                port = await navigator.serial.requestPort();
                await port.open({ baudRate: 9600 });
                console.log("Conectado ao Arduino!");
                receiveFromArduino();
            } catch (error) {
                console.error("Erro ao conectar ao Arduino:", error);
            }
        } else {
            console.error("Web Serial não suportado.");
        }
    }

    async function sendCommandToArduino(command) {
        if (port && port.writable) {
            const writer = port.writable.getWriter();
            const commandBuffer = new TextEncoder().encode(command + '\n');
            await writer.write(commandBuffer);
            writer.releaseLock();
        } else {
            console.error("Porta não está conectada ou não é gravável.");
        }
    }

    async function receiveFromArduino() {
        if (port && port.readable) {
            const reader = port.readable.getReader();
            let messageBuffer = '';
    
            try {
                while (port.readable.locked) { // Verifica se a porta ainda está aberta
                    const { value, done } = await reader.read();
                    if (done) {
                        console.log("Leitura da porta encerrada.");
                        break;
                    }
    
                    // Adiciona dados ao buffer e processa mensagens completas
                    messageBuffer += new TextDecoder().decode(value, { stream: true });
    
                    let newlineIndex;
                    while ((newlineIndex = messageBuffer.indexOf('\n')) >= 0) {
                        const completeMessage = messageBuffer.slice(0, newlineIndex).trim();
                        messageBuffer = messageBuffer.slice(newlineIndex + 1);
    
                        console.log("Mensagem completa recebida:", completeMessage);
    
                        if (completeMessage === "INATIVO") {
                            console.log("Mensagem 'INATIVO' recebida. Parando o cronômetro...");
                            stopTimer();
                        }
    
                        // Salva dados recebidos
                        await fetch('/save-arduino-data/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': getCSRFToken(),
                            },
                            body: JSON.stringify({ data: completeMessage }),
                        }).catch(error => console.error('Erro ao salvar dados do Arduino:', error));
                    }
                }
            } catch (error) {
                console.error("Erro na leitura da porta:", error);
                // Reinicia o Arduino em caso de erro de leitura
                if (port) {
                    await port.close();
                    console.log("Porta fechada após erro.");
                }
            } finally {
                reader.releaseLock();
            }
        } else {
            console.error("Porta não está conectada ou não é legível.");
        }
    }
    

    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken'))
            ?.split('=')[1];
        return cookieValue || '';
    }

    connectButton.addEventListener("click", connectToArduino);
    preloadAllAudios();
});
