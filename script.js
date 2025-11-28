const display = document.getElementById("display");
const buttons = document.querySelectorAll(".keys button");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

let currentInput = ""; // current expression
let history = [];      // array of "expression = result"

// -----------------------------
// Button clicks
// -----------------------------
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;
    const operator = btn.dataset.operator;

    if (value !== undefined) {
      handleNumber(value);
    } else if (operator !== undefined) {
      handleOperator(operator);
    } else if (action === "clear") {
      clearDisplay();
    } else if (action === "delete") {
      deleteLast();
    } else if (action === "equals") {
      calculate();
    }
  });
});

// -----------------------------
// Display handling
// -----------------------------
function updateDisplay() {
  display.value = currentInput || "0";
}

// -----------------------------
// Input handling
// -----------------------------
function handleNumber(num) {
  // avoid multiple dots in the same number part
  if (num === ".") {
    const parts = currentInput.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes(".")) return;
  }

  currentInput += num;
  updateDisplay();
}

function handleOperator(op) {
  if (currentInput === "") return;

  const lastChar = currentInput[currentInput.length - 1];
  // Replace last operator with new one instead of adding
  if ("+-*/".includes(lastChar)) {
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  updateDisplay();
}

function clearDisplay() {
  currentInput = "";
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// -----------------------------
// Calculation + History
// -----------------------------
function calculate() {
  if (currentInput === "") return;

  try {
    const expression = currentInput;
    const result = eval(expression);

    // Add to history
    const entry = `${expression} = ${result}`;
    history.unshift(entry); // newest at top
    renderHistory();

    // Show result
    currentInput = result.toString();
    updateDisplay();
  } catch (error) {
    currentInput = "";
    display.value = "Error";
  }
}

function renderHistory() {
  historyList.innerHTML = "";

  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

// Clear history button
clearHistoryBtn.addEventListener("click", () => {
  history = [];
  renderHistory();
});

// -----------------------------
// Keyboard support
// -----------------------------
document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Numbers 0–9
  if (key >= "0" && key <= "9") {
    handleNumber(key);
    return;
  }

  // Decimal point
  if (key === ".") {
    handleNumber(".");
    return;
  }

  // Operators
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    handleOperator(key);
    return;
  }

  // Enter or = -> calculate
  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  // Backspace -> delete last
  if (key === "Backspace") {
    deleteLast();
    return;
  }

  // Escape -> clear all
  if (key === "Escape") {
    clearDisplay();
    return;
  }
});

// Initialize display
updateDisplay();
renderHistory();
