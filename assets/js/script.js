const typingText = document.querySelector(".typing-text p"),
  inpField = document.querySelector(".wrapper .input-field"),
  tryAgainBtn = document.querySelector(".content button");
const tryAgainBtnModal = document.getElementById("modal-try");
const closeModalBtn = document.getElementById("modal-close");
(timeTag = document.querySelector(".time span b")),
  (mistakeTag = document.querySelector(".mistake span")),
  (wpmTag = document.querySelector(".wpm span")),
  (cpmTag = document.querySelector(".cpm span"));
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const timeSelector = document.getElementById("time-options");

const body = document.body;
let timer,
  maxTime = 30,
  timeLeft = maxTime,
  charIndex = (mistakes = isTyping = 0);
function loadParagraph() {
  const ranIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = "";
  paragraphs[ranIndex].split("").forEach((char) => {
    let span = `<span>${char}</span>`;
    typingText.innerHTML += span;
  });
  typingText.querySelectorAll("span")[0].classList.add("active");
  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
}
function initTyping() {
  let characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex];
  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }
    if (typedChar == null) {
      if (charIndex > 0) {
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          mistakes--;
        }
        characters[charIndex].classList.remove("correct", "incorrect");
      }
    } else {
      if (characters[charIndex].innerText == typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
    }
    characters.forEach((span) => span.classList.remove("active"));
    characters[charIndex].classList.add("active");
    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    );
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    wpmTag.innerText = wpm;
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;
  } else {
    clearInterval(timer);
    inpField.value = "";
    showResultsModal();
  }
}
function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    );
    wpmTag.innerText = wpm;
  } else {
    clearInterval(timer);
    showResultsModal();
  }
}
function resetGame() {
  loadParagraph();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  inpField.value = "";
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  mistakeTag.innerText = 0;
  cpmTag.innerText = 0;
  hideResultsModal();
}
function showResultsModal() {
  const modal = document.getElementById("modal");
  const modalWpm = document.getElementById("modal-wpm");
  const modalCpm = document.getElementById("modal-cpm");
  const modalContainer = document.querySelector(".modal-container");
  // Остальной код функции...
  modalContainer.style.display = "flex"; // Показываем модальное окно
  const wpm = Math.round(
    ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
  );
  const cpm = charIndex - mistakes;

  modalWpm.innerText = wpm;
  modalCpm.innerText = cpm;

  modal.style.display = "flex";
}

function hideResultsModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  const modalContainer = document.querySelector(".modal-container");
  modalContainer.style.display = "none";
}

themeToggle.addEventListener("change", function () {
  if (this.checked) {
    // Если переключатель включен, включаем темную тему
    body.classList.add("dark-theme");
    themeLabel.textContent = "Dark";
    themeLabel.style.color = "#e2b714";
  } else {
    // В противном случае включаем светлую тему
    body.classList.remove("dark-theme");
    themeLabel.textContent = "Light";
    themeLabel.style.color = "#fff";
  }
});
// Добавляем обработчик события для выбора времени
timeSelector.addEventListener("change", function () {
  // Получаем выбранное значение времени
  const selectedTime = parseInt(this.value);

  // Устанавливаем выбранное время в переменную maxTime
  maxTime = selectedTime;

  // Обновляем отображение оставшегося времени на странице
  timeTag.innerText = maxTime;

  // Сбрасываем игру
  resetGame();
});

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
tryAgainBtnModal.addEventListener("click", function () {
  hideResultsModal(); // Сначала скроем модальное окно
  resetGame(); // Затем сбросим игру
});
closeModalBtn.addEventListener("click", hideResultsModal);
