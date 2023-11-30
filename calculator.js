let userEntries = [];
let runningTotals = [];
let currentInput = '';
let previousInput = '';
let operation = null;
let startNewEquation = false;

function onButtonClick(buttonValue, buttonClass) {
    console.log("Button clicked:", buttonValue, "Type of value:", typeof buttonValue);
  
    if (buttonClass.includes('percent-button')) {
        handlePercent();
    } else if (buttonValue === '.') {
        handleDecimalInput();
    } else if (isNumber(buttonValue)) {
        handleNumber(buttonValue);
    } else if (buttonValue === '=') {
        handleEquals();
    } else if (buttonValue === '±') {
        togglePosNeg();
    } else if (buttonValue === 'C') {
        clearCalculation();
    } else if (['+', '-', 'x', '/'].includes(buttonValue)) {
        handleOperator(buttonValue);
    }
  
    //updateDisplay();
  }
  
  function handleNumber(number) {
    console.log("handleNumber called with:", number);
    console.log("Current operation:", operation);
    console.log("Current input before handling:", currentInput);

    if (operation) {
        if (currentInput === '') {
            // Starting a new number after an operator
            currentInput = number;
            console.log("Starting new number after operator. Current input:", currentInput);
        } else {
            // Appending digits to the current number
            currentInput += number;
            console.log("Appending to current number. Current input:", currentInput);
        }
        
        // Perform calculation and check if an error is detected
        const calcResult = calculate();
        if (isHandlingError) {
            console.log("Error detected. Skipping history update.");
            return;  // Skip updating history and display if an error is detected
        }

        // Update the line with the operator and the current number
        console.log("Updating history with operation and current input.");
        updateLastHistory(operation + " " + currentInput, "= " + calcResult);
    } else {
        // Continuation of a number entry or a new calculation
        currentInput += number;
        console.log("Continuing number entry. Current input:", currentInput);
        updateLastHistory(currentInput, "= " + currentInput);
    }

    console.log("Updating display after handling number.");
    updateDisplay();
}




function handleDecimalInput() {
    if (isHandlingError) {
        console.log("Decimal action skipped due to error");
        return;  // Skip further actions if an error is detected
    }
  if (currentInput === '') {
      console.log('handleDecimal Reached - no input yet');
      // If no input yet, start with '0.'
      currentInput = '0.';
  } else if (!currentInput.includes('.')) {
      console.log('handleDecimal Reached - appending decimal');
      // If there's no decimal point yet, append it to currentInput
      currentInput += '.';
  }
  // Update the display after appending the decimal
  updateDisplay();
}

function handlePercent() {
    if (isHandlingError) {
        console.log("Percent action skipped due to error");
        return;  // Skip further actions if an error is detected
    }
    console.log('Percentage Eq');
    if (currentInput !== '') {
      // Direct percentage calculation (e.g., 50%)
      let directPercentage = parseFloat(currentInput) / 100;
      currentInput = directPercentage.toString();
      displayResult(currentInput);
      addToHistory(currentInput, "= " + directPercentage);
  }
  resetCalculation();
}

function resetCalculation() {
  previousInput = '';
  operation = null;
}

function handleOperator(op) {
    if (isHandlingError) {
        console.log("Operator action skipped due to error");
        return;  // Skip further actions if an error is detected
    }
    if (currentInput !== '' || previousInput !== '') {
        if (operation) {
            // If there's an existing operation, calculate the result first
            let result = calculate();
            previousInput = result.toString();
            updateLastHistory(previousInput, "= " + result); // Finalize the previous line
        } else {
            // First operator in a calculation
            previousInput = currentInput;
        }
        currentInput = '';
        operation = op;
        addToHistory(op, ""); // Start a new line with the operator
    }
    //updateDisplay();
}



function calculate() {
    console.log("Calculating result. Previous:", previousInput, "Current:", currentInput, "Operation:", operation);
    console.log("Calculate Error flag is : ", isHandlingError);
    if (isHandlingError) {
        console.log("Skipping calculation due to existing error");
        return; // Skip the calculation if an error is being handled.
    }  
    let result = 0;
    switch (operation) {
        case '+':
            result = parseFloat(previousInput) + parseFloat(currentInput);
            break;
        case '-':
            result = parseFloat(previousInput) - parseFloat(currentInput);
            break;
        case 'x':
            result = parseFloat(previousInput) * parseFloat(currentInput);
            break;
        case '/':
            if (parseFloat(currentInput) === 0) {
                addErrorToHistory("Cannot Divide by Zero", "");
                
                displayError("Div/0:Error");
                
            }
            result = parseFloat(previousInput) / parseFloat(currentInput);
            break;
        case '%':
            result = parseFloat(previousInput) * (parseFloat(currentInput) / 100);
            break;
        // Additional operations can be added here
    }
    return result;
}

function handleEquals() {
    if (isHandlingError) {
        console.log("Equals action skipped due to error");
        return;  // Skip further actions if an error is detected
    }
    if (previousInput !== '' && operation && currentInput !== '') {
        let result = calculate();
        // Update the history to show the full operation
        updateLastHistory(previousInput + " " + operation + " " + currentInput, "= " + result);
        // Add a new line for the final result
        addToHistory("=", result);
        currentInput = result.toString();
        previousInput = '';
        operation = null;
    } else if (previousInput !== '' && operation) {
        // Handle case where equals is pressed without a new currentInput
        let displayedResult = currentInput === '' ? previousInput : calculate().toString();
        updateLastHistory(previousInput + " " + operation, "= " + displayedResult);
        // Add a new line for the final result
        addToHistory("=", displayedResult);
        previousInput = '';
        currentInput = displayedResult;
        operation = null;
    }
    updateDisplay();
}




function displayResult(result) {
    console.log("Displaying result:", result);
    currentInput = result.toString(); // Update currentInput with the result
    updateDisplay(); // Update the display with the new currentInput
} 


function updateDisplay() {
    console.log("Updating display with current input:", currentInput);
    const displayElement = document.querySelector('.calc-display');
    if (displayElement) {
        displayElement.textContent = currentInput === '' ? '0' : currentInput;

        // Check if the last history entry is the clear message
        if (equationHistory.length > 0 && currentInput === '' && equationHistory[equationHistory.length - 1].includes("-------Clear-------")) {
            // Append a newline to the tape if it's not already there
            if (!equationHistory[equationHistory.length - 1].endsWith("\n")) {
                equationHistory[equationHistory.length - 1] += "\n";
                updateHistoryDisplay();
            }
        }
    } else {
        console.error("Display element '.calc-display' not found.");
    }
}



function displayError(message) {
    console.log("displayError reached: ", message);
    console.log("Error flag is : ", isHandlingError);
    const displayElement = document.querySelector('.calc-display');
    if (displayElement) {
        console.log("Should print error to display");
        displayElement.textContent = message;
    } else {
        console.error("Display element '.calc-display' not found.");
    }
}


function isNumber(value) {
    return !isNaN(value) || value === '.';
}

function isOperator(value) {
    return ['/', '+', '-', 'x', '%'].includes(value);
}

function clearCalculation() {
    console.log("Clearing calculation");

    // Reset the calculation variables
    currentInput = '';
    previousInput = '';
    operation = null;

    // Reset the error handling flag
    isHandlingError = false;

    // Add the clear message to the history but don't clear previous entries
    equationHistory.push("------clear------\n");
    equationHistory.push("");
    updateHistoryDisplay();
    

    // Reset user entries and running totals if necessary
    userEntries = [];
    runningTotals = [];

    // Update the display, typically to show an empty state or zero
    updateDisplay();
}


function togglePosNeg() {
    if (isHandlingError) {
        console.log("Pos/Neg action skipped due to error");
        return;  // Skip further actions if an error is detected
    }
    console.log("Toggle Pos/Neg");
    if (currentInput !== '') {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay(); // Update the display with the new currentInput
    }
}

const frame = document.querySelector('.frame');
frame.addEventListener('click', function(event) {
    if (event.target.classList.contains('calc-button')) {
        onButtonClick(event.target.textContent.trim(), event.target.className);
    }
});


// Dark Mode Toggle
const themeSwitchCheckbox = document.getElementById('theme-switch-checkbox');
const themeTextElement = document.querySelector('.theme-label');

themeSwitchCheckbox.addEventListener('change', function(event) {
    console.log("Toggling dark mode");
    if (event.target.checked) {
        themeTextElement.textContent = 'Dark Theme';
        document.body.classList.add('dark-mode');
    } else {
        themeTextElement.textContent = 'Light Theme';
        document.body.classList.remove('dark-mode');
    }
});
