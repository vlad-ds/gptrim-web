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

  // Get the selected stemmer value
  const stemmerSelectElement = document.getElementById("stemmer-select");
  const selectedStemmer = stemmerSelectElement.value;

  // Get the selected model value
  const modelSelectElement = document.getElementById("model"); // Add this line
  const selectedModel = modelSelectElement.value; // Add this line

  // Create a new FormData object and append the stemmer and model values
  const formData = new FormData(event.target);
  formData.append("stemmer", selectedStemmer);
  formData.append("model", selectedModel); // Add this line

  const response = await fetch("/api/transform", {
    method: "POST",
    body: formData,
  });

  const jsonResponse = await response.json();
  const transformedTextElement = document.getElementById("transformed-text");
  transformedTextElement.value = jsonResponse.text_trimmed;

  // Update the token count for the output text
  updateTokenCount(jsonResponse.token_count, "token-count-output");

  // Update the percentage difference between input and output token counts
  updateTokenCountDifference(inputTokenCount, jsonResponse.token_count);
}


  function updateStemmerDescription(selectedStemmer) {
    const stemmerDescriptionElement = document.getElementById("stemmer-description");
    let description = "";

    switch (selectedStemmer) {
        case "lancaster":
            description = "Lancaster: A more aggressive stemmer.";
            break;
        case "snowball":
            description = "Snowball: A general purpose stemmer.";
            break;
        default:
            description = "Select a stemmer to further compress text (might lose more information)";
    }

    stemmerDescriptionElement.textContent = description;
}

function updateTokenCount(tokenCount, tokenCountElementId) {
    const tokenCountElement = document.getElementById(tokenCountElementId);
    tokenCountElement.textContent = `Token Count: ${tokenCount}`;
}

function updateTokenCountDifference(inputTokenCount, outputTokenCount) {
    const percentage = inputTokenCount > 0 ? ((inputTokenCount - outputTokenCount) / inputTokenCount) * 100 : 0;
    const percentageElement = document.getElementById("token-count-difference");
    percentageElement.textContent = `Text was reduced by ${percentage.toFixed(2)}%!`;
}

  
  // Attach event listeners
  document.addEventListener("DOMContentLoaded", () => {
    const inputTextElement = document.getElementById("input-text");
    inputTextElement.addEventListener("input", (event) => updateCharCount(event.target.value, "char-count-input"));
  
    const transformForm = document.getElementById("transform-form");
    transformForm.addEventListener("submit", submitForm);

    const stemmerSelectElement = document.getElementById("stemmer-select");
    stemmerSelectElement.addEventListener("change", (event) => updateStemmerDescription(event.target.value));

    const copyButton = document.getElementById("copy-button");
    copyButton.addEventListener("click", copyToClipboard);

  });
