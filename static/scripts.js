// Update the character count of the input text
function updateCharCount(text, charCountElementId) {
    const charCount = text.length;
    const charCountElement = document.getElementById(charCountElementId);
    charCountElement.textContent = `Character Count: ${charCount}`;
  }

// Calculate and update the percentage difference between input and output character counts
function updateCharCountDifference(inputCharCount, outputCharCount) {
    const percentage = inputCharCount > 0 ? ((inputCharCount - outputCharCount) / inputCharCount) * 100 : 0;
    const percentageElement = document.getElementById("char-count-difference");
    percentageElement.textContent = `Text was reduced by ${percentage.toFixed(2)}%!`;
  }

  function copyToClipboard() {
    const transformedTextElement = document.getElementById("transformed-text");
    transformedTextElement.select();
    transformedTextElement.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
  }
  
  // Get the input text and send it to the Flask API
  async function submitForm(event) {
    event.preventDefault();
    const inputTextElement = document.getElementById("input-text");
    const inputText = inputTextElement.value;
  
    const response = await fetch("/api/transform", {
      method: "POST",
      body: new FormData(event.target),
    });
  
    const jsonResponse = await response.json();
    const transformedTextElement = document.getElementById("transformed-text");
    transformedTextElement.value = jsonResponse.text_trimmed;
  
    // Update the character count for the output text
    updateCharCount(transformedTextElement.value, "char-count-output");

    // Update the percentage difference between input and output character counts
    updateCharCountDifference(inputText.length, transformedTextElement.value.length);
  }
  
  // Attach event listeners
  document.addEventListener("DOMContentLoaded", () => {
    const inputTextElement = document.getElementById("input-text");
    inputTextElement.addEventListener("input", (event) => updateCharCount(event.target.value, "char-count-input"));
  
    const transformForm = document.getElementById("transform-form");
    transformForm.addEventListener("submit", submitForm);


  });

  document.addEventListener("DOMContentLoaded", () => {
    // Existing event listeners here...
  
    const copyButton = document.getElementById("copy-button");
    copyButton.addEventListener("click", copyToClipboard);
  })
  