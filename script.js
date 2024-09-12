document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const inputSequence = document.getElementById('input-sequence');
    let currentInput = '';  
    let fullExpression = '';  
    let operator = null;  
    let memory = null;  // Memory storage, set to null initially
    let resultDisplayed = false;
     // Track if result is currently displayed

    function updateDisplay(value) {
        display.textContent = value;
    }

    function updateInputSequence(value) {
        inputSequence.textContent = value;
    }

    function showError(message) {
        updateDisplay(message);
        resultDisplayed = true; 
        // Set flag to true to prevent further inputs without clearing
    }

    // Function to handle number buttons
    
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => {
            if (resultDisplayed) {
                // If a new calculation starts after displaying the result or error,

                // reset only if clear button was not pressed
                currentInput = '';
                fullExpression = '';
                resultDisplayed = false;
            }
            if (currentInput === '0' && button.textContent === '0') return;
             // Prevent leading zeros
            currentInput += button.textContent;
            fullExpression += button.textContent;
            updateInputSequence(fullExpression);
            updateDisplay(currentInput);
        });
    });

    // Function to handle operator buttons

    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => {
            if (resultDisplayed) {
                // Reset currentInput and fullExpression if a result was displayed
                // and an operator is pressed, but keep memory intact
                resultDisplayed = false;
            }

            if (currentInput === '' && memory === null) {
                showError('Syntax Error'); 
                // Show error if operator is pressed first
                return;
            }

            if (currentInput === '' && memory !== null) {
                showError('Syntax Error'); 
                // Show error if operator is pressed consecutively
                return;
            }

            if (currentInput !== '') {
                if (memory === null) {
                    memory = parseFloat(currentInput);
                     // Set initial memory to the first number input
                } else {
                    calculateResult(false); 
                    // Calculate result dynamically
                }
                currentInput = ''; 
                // Reset current input for new number
            }

            operator = button.textContent;
            fullExpression += ' ' + operator + ' ';
            updateInputSequence(fullExpression);
            resultDisplayed = false;
             // Reset result displayed flag after operator press
        });
    });

    // Function to calculate and display the result

    function calculateResult(showResult = true) {
        if (operator === null || currentInput === '') return;

        let currentNumber = parseFloat(currentInput);
        let result;

        switch (operator) {
            case '+':
                result = memory + currentNumber;
                break;
            case '-':
                result = memory - currentNumber;
                break;
            case 'x':
                result = memory * currentNumber;
                break;
            case '/':
                if (currentNumber === 0) {
                    showError('Error');
                     // Division by zero error
                    return;
                }
                result = memory / currentNumber;
                break;
            case '%':
                result = memory % currentNumber;
                break;
            default:
                return;
        }

        memory = result;
         // Store the result in memory for chaining operations

        if (showResult) {
            updateDisplay(result); 
            // Show the result dynamically
            resultDisplayed = true; 
            // Set flag that a result has been displayed
        }

        currentInput = ''; // Reset input for next operation
        operator = null; // Clear the operator after calculation
    }

    // Function to handle the clear button

    document.querySelector('.clear').addEventListener('click', () => {
        currentInput = '';
        fullExpression = '';
        memory = null;
         // Reset memory to null
        operator = null;
        resultDisplayed = false;
        updateDisplay('0');
        updateInputSequence('0');
    });

    // Function to handle the equal button

    document.querySelector('.equal').addEventListener('click', () => {
        if (currentInput !== '') {
            calculateResult(true); 
            // Show the final result on equal press
            // Do not change `fullExpression` to keep the input sequence unchanged
        }
         else if (memory !== null && operator === null) {
            // Do nothing, as there's no new input, but a memory exists
        }
         else {
            showError('Syntax Error'); 
            // Show error if equal is pressed without a number
        }
    });

    // Function to handle the memory button

    document.querySelector('.memory').addEventListener('click', () => {
        if (currentInput !== '') {
            memory = parseFloat(currentInput);
            currentInput = '';
        } else if (memory !== null) {
            updateDisplay(memory);
        } else {
            showError('Memory Error'); 
            // Show error if no number in memory
        }
        fullExpression += 'M';
         // Display "M" to indicate memory storage
        updateInputSequence(fullExpression);
    });
});
