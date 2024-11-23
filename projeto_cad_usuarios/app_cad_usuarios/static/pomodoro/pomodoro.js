document.addEventListener("DOMContentLoaded", () => {
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
    preloadAllAudios();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioBuffers = {};
    let sourceNode = null;
    let port;
    let isSendingData = false;
  
    // Função para carregar o áudio
    async function loadAudio(url) {
        try {
            const response = await fetch(url);
            const data = await response.arrayBuffer();
            return await audioContext.decodeAudioData(data);
        } catch (error) {
            console.error("Erro ao carregar áudio:", error);
        }
    }
  
    // Pré-carregar áudios
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
  
      console.log("Cronômetro iniciado."); // Log para debug
  
      timer = setInterval(() => {
          if (timeLeft > 0) {
              timeLeft--;
              updateDisplay();
          } else {
              stopTimer();
              alert("Tempo esgotado!");
          }
      }, 1000);
  }
  
  
  function stopTimer() {
    if (timer) {
        console.log("Parando cronômetro: limpando intervalo...");
        clearInterval(timer);
        timer = null;
    } else {
        console.log("Cronômetro já estava parado.");
    }
    isRunning = false;
    startStopButton.textContent = "Start";
    stopAudio();
    sendCommandToArduino("STOP");
    console.log("Cronômetro parado com sucesso.");
  
    // Exibe a mensagem quando o cronômetro é parado
    alert("Cronômetro parado.");
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
          console.log("Tentativa de iniciar cronômetro, mas ele já está rodando.");
          stopTimer();
      } else {
          console.log("Iniciando cronômetro pelo botão.");
          startTimer();
      }
  });
  
  
    resetButton.addEventListener("click", resetTimer);
  
    updateDisplay();
  
    function toggleDarkMode() {
        const body = document.body;
        const darkModeEnabled = body.classList.toggle('dark-mode');
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
    let isWriting = false;
  
    async function sendCommandToArduino(command) {
      if (port && port.writable) {
          const writer = port.writable.getWriter(); // Obtém um writer para enviar comandos
          try {
              const commandBuffer = new TextEncoder().encode(command + '\n');
              await writer.write(commandBuffer);
              console.log(`Comando enviado ao Arduino: ${command}`);
          } catch (error) {
              console.error("Erro ao enviar comando para o Arduino:", error);
          } finally {
              writer.releaseLock(); // Libera o writer, mesmo em caso de erro
          }
      } else {
          console.error("Porta não está conectada ou não é gravável.");
      }
  }
  
  async function receiveFromArduino() {
      if (port && port.readable) {
          const reader = port.readable.getReader();
          let buffer = ""; // Buffer para mensagens
          let alertDisplayed = false; // Controla se o alerta já foi exibido
  
          try {
              while (true) {
                  const { value, done } = await reader.read();
                  if (done) break;
  
                  buffer += new TextDecoder().decode(value);
                  let lines = buffer.split("\n"); // Divide em linhas completas
                  buffer = lines.pop(); // Última linha pode ser incompleta
  
                  for (let line of lines) {
                      line = line.trim();
                      console.log("Mensagem do Arduino:", line);
  
                      if (line === "INATIVO" && !alertDisplayed) {
                          console.log("Mensagem recebida do Arduino: INATIVO. Parando o cronômetro.");
  
                          // Para o cronômetro e envia STOP para o Arduino
                          stopTimer();
                          await sendCommandToArduino("STOP");
  
                          // Exibe o alerta
                          alertDisplayed = true; // Controla para não repetir o alerta
                          alert("Inatividade detectada! O cronômetro foi parado.");
  
                          alertDisplayed = false; // Permite novos alertas no futuro
                      }
                  }
              }
          } catch (error) {
              console.error("Erro ao ler do Arduino:", error);
          } finally {
              reader.releaseLock(); // Libera o reader quando terminar
              console.log("Reiniciando leitura do Arduino...");
              receiveFromArduino(); // Reinicia a leitura
          }
      }
  }
  
  
    connectButton.addEventListener("click", connectToArduino);
  });