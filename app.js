const equationTxt = document.getElementById("equation");
const display = document.getElementById("display");

const clearBtn = document.getElementById("clear");
const sumBtn = document.getElementById("sum");
const decimalBtn = document.getElementById("decimal");
const backSpaceBtn = document.getElementById("backspace");
const minusBtn = document.getElementById("minus");

const digitBtns = document.querySelectorAll("#digit");
const operatorBtns = document.querySelectorAll(".operator");

let equation = [];
let hasOperator = false;
let equationIsFilled = false;
let result = 0;
const operators = ["+", "−", "×", "÷"];

digitBtns.forEach((digit) => {
  digit.addEventListener("click", () => {
    removeLeadingZero();
    addDigit(digit.value);
  });
});
operatorBtns.forEach((operator) => {
  operator.addEventListener("click", () => {
    addOperator(operator.value);
  });
});

sumBtn.addEventListener("click", () => {
  operate();
});

decimalBtn.addEventListener("click", () => {
  addDecimal();
});

backSpaceBtn.addEventListener("click", () => {
  clearDigit();
});

clearBtn.addEventListener("click", () => {
  clearAll();
});

minusBtn.addEventListener("click", () => {
  addMinus();
});

function addMinus() {
  let opIndex = findOperator();
  let minusIndex = findMinus();

  if (equation[0] !== "-" && opIndex === -1) {
    equation.unshift("-");
    display.innerText = equation.join("");
  } else if (opIndex !== -1 && equation[opIndex + 1] !== "-") {
    equation.splice(opIndex + 1, 0, "-");
    display.innerText = equation.slice(opIndex + 1).join("");
  } else {
    equation.splice(minusIndex, 1);
    opIndex !== -1
      ? (display.innerText = equation.slice(opIndex + 1).join(""))
      : (display.innerText = equation.join(""));
  }
}

function clearAll() {
  equationTxt.innerText = "";
  display.innerText = "";
  equation = [];
  hasOperator = false;
  equationIsFilled = false;
  result = 0;
}

function clearDigit() {
  let opIndex = findOperator();

  if (equation.length !== 0) {
    if (opIndex !== -1 && equation[equation.length - 1] !== equation[opIndex]) {
      equation.pop();
      display.innerText = equation.slice(opIndex + 1).join("");
    } else if (opIndex === -1) {
      equation.pop();
      display.innerText = equation.join("");
    }
  }
}

function addDecimal() {
  let opIndex = findOperator();

  if (!display.innerText.includes(".") || equation[opIndex + 1] === undefined) {
    equation.push(".");
    display.innerText = equation.slice(opIndex + 1).join("");
  }
}

function operate() {
  let calculation = 0;
  let operator = "";
  let num1 = 0;
  let num2 = 0;
  let opIndex = findOperator();

  if (equation.length !== 0 && opIndex !== -1) {
    operator = equation[opIndex];
    num1 = equation.slice(0, opIndex).join("");
    num2 =
      equation.slice(opIndex + 1).join("") === ""
        ? num1
        : equation.slice(opIndex + 1).join("");

    calculation = calculate(operator, parseFloat(num1), parseFloat(num2));
    result = calculation % 1 !== 0 ? calculation.toFixed(3) : calculation;
    equation = result.toString().split("");
    equationTxt.innerText += `${num2} =`;
    display.innerText = result;
    hasOperator = false;
    equationIsFilled = false;
  }
}
function removeLeadingZero() {
  equation = equation.filter((element, index) => {
    if (!hasOperator && index === 0 && element === "0" && equation[1] !== ".") {
      return false;
    }
    if (
      operators.includes(equation[index - 1]) &&
      element === "0" &&
      equation[index + 1] !== "."
    ) {
      return false;
    }
    return true;
  });
}

function addDigit(digit) {
  let opIndex = findOperator();

  if (display.innerText.length > 10) return;

  equation.push(digit);

  if (opIndex !== -1) {
    display.innerText = equation.slice(opIndex + 1).join("");
    equationIsFilled = true;
  } else {
    display.innerText = equation.join("");
  }
}

function addOperator(operator) {
  let operatorIndex = findOperator();

  if (equation.length !== 0) {
    if (!hasOperator) {
      equation.push(operator);
      hasOperator = true;
    } else if (equationIsFilled) {
      operate();
      equation.push(operator);
      hasOperator = true;
    } else {
      equation[operatorIndex] = operator;
    }
    equationTxt.innerText = equation.join("");
  }
}

function findOperator() {
  let operatorIndex = equation.findIndex((element) => {
    return operators.includes(element);
  });
  return operatorIndex;
}

function findMinus() {
  let opIndex = findOperator();

  let minusIndex = equation.findIndex((element) => {
    return element === "-" && equation.indexOf(element) !== opIndex;
  });
  return minusIndex;
}

function calculate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "−":
      return subtract(a, b);
    case "×":
      return multiply(a, b);
    case "÷":
      return divide(a, b);
    default:
      return NaN;
  }
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return b === 0 ? "Cannot divide by zero" : a === 0 ? 0 : a / b;
}
