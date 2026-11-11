const display = document.getElementById("display");

let currentInput = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    display.value = currentInput;
}

function inputNumber(number) {
    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === "0"
            ? number
            : currentInput + number;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        currentInput = "0.";
        waitingForSecondOperand = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }
    updateDisplay();
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return b === 0 ? null : a / b;
        default:
            return b;
    }
}

function chooseOperator(nextOperator) {
    const inputValue = Number(currentInput);

    if (operator && !waitingForSecondOperand) {
        const result = calculate(
            firstOperand,
            inputValue,
            operator
        );

        if (result === null) {
            currentInput = "Cannot divide by zero";
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = true;
            updateDisplay();
            return;
        }

        currentInput = String(Number(result.toPrecision(12)));
        firstOperand = Number(currentInput);
        updateDisplay();
    } else {
        firstOperand = inputValue;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
}

function handleAction(action) {
    if (action === "clear") {
        currentInput = "0";
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
    }

    if (action === "delete") {
        if (waitingForSecondOperand) return;

        currentInput = currentInput.length > 1
            ? currentInput.slice(0, -1)
            : "0";
    }

    if (action === "calculate") {
        if (operator === null || waitingForSecondOperand) return;

        const secondOperand = Number(currentInput);
        const result = calculate(
            firstOperand,
            secondOperand,
            operator
        );

        if (result === null) {
            currentInput = "Cannot divide by zero";
        } else {
            currentInput = String(Number(result.toPrecision(12)));
        }

        firstOperand = null;
        operator = null;
        waitingForSecondOperand = true;
    }

    updateDisplay();
}

document.querySelector(".buttons").addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.value !== undefined) {
        const value = button.dataset.value;

        if (currentInput === "Cannot divide by zero") {
            currentInput = "0";
        }

        if (value >= "0" && value <= "9") {
            inputNumber(value);
        } else if (value === ".") {
            inputDecimal();
        } else if (value === "%") {
            currentInput = String(Number(currentInput) / 100);
            updateDisplay();
        } else {
            chooseOperator(value);
        }
    }

    if (button.dataset.action) {
        handleAction(button.dataset.action);
    }
});

updateDisplay();