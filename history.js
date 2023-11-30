let equationHistory = [];
let isHandlingError = false;

function addToHistory(equation, result) {
    console.log("Adding to history:", equation, result);
    // Create the history entry
    let historyEntry = equation + ' ' + result;

    // Add historyEntry to the equationHistory array
    equationHistory.push(historyEntry);

    // Update the history display
    updateHistoryDisplay();
}

/* function clearHistory() {
    equationHistory = [];
    updateHistoryDisplay();
}
*/
function updateHistoryDisplay() {
    console.log("UpdateHistory Display isHandlingError:", isHandlingError);
    console.log("Current Equation History", equationHistory);

    const historyElement = document.querySelector('.calc-tape');
    if (!historyElement) {
        console.error("History display element not found.");
        return;
    }

    if (isHandlingError) {
        // If an error is being handled, append only the error message.
        const lastHistoryEntry = equationHistory[equationHistory.length - 1];
        if (lastHistoryEntry && lastHistoryEntry.startsWith("Error:")) {
            historyElement.textContent += "\n" + lastHistoryEntry; // Append the error message
        }
    } else {
        // If no error, display the full history as usual.
        historyElement.textContent = equationHistory.join("\n");
    }
}



function updateLastHistory(equationPart, total) {
    if (equationHistory.length > 0) {
        equationHistory[equationHistory.length - 1] = equationPart + " " + total;
    } else {
        equationHistory.push(equationPart + " " + total);
    }
    updateHistoryDisplay();
}

function addErrorToHistory(errorMessage) {
    isHandlingError = true;
    console.log("Adding error to history:", errorMessage);
    let historyEntry = "Error: " + errorMessage + "\n---Press 'Clear' to continue---";
  
    // Check if the last history entry is an error message
    const lastHistoryEntry = equationHistory[equationHistory.length - 1];
    if (lastHistoryEntry.startsWith("Error:")) {
      // Replace the last error message with the updated one
      equationHistory[equationHistory.length - 1] = historyEntry;
    } else {
      // Add the error message as a new entry
      equationHistory.push(historyEntry);
    }
  
    // Check if the current input is empty
    if (!currentInput) {
      // Do not clear the calculation if the input is empty
    } else {
      updateHistoryDisplay();
      
      //clearCalculation();
    }
  }
  
  





