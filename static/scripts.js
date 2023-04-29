function applySaveTokensRecipe() {
  $("#remove-stopwords").prop("checked", true).change();
  $("#remove-punctuation").prop("checked", true).change();
  $("#remove-spaces").prop("checked", false).change();
  $("#stemmer-select").val("");
}

function applySaveCharactersRecipe() {
  $("#remove-stopwords").prop("checked", true).change();
  $("#remove-spaces").prop("checked", true).change();
  $("#stemmer-select").val("snowball");
}

// Update the character count of the input text
function updateCharCount(text, charCountElementId) {
    const charCount = text.length;
    const charCountElement = document.getElementById(charCountElementId);
    charCountElement.textContent = `${charCount}`;
  }

// Calculate and update the percentage difference between input and output character counts
  function updateTokenCount(tokens, tokenCountElementId) {
    const tokenCountElement = document.getElementById(tokenCountElementId);
    tokenCountElement.textContent = `${tokens}`;
}

  function copyToClipboard() {
    const transformedTextElement = document.getElementById("transformed-text");
    transformedTextElement.select();
    transformedTextElement.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
  }

  async function submitForm(event) {
    event.preventDefault();
    const inputTextElement = document.getElementById("input-text");
    const inputText = inputTextElement.value;

    // Get the selected stemmer value
    const stemmerSelectElement = document.getElementById("stemmer-select");
    const selectedStemmer = stemmerSelectElement.value;

    // Get the values of the remove_spaces and remove_stopwords checkboxes
    const removeSpacesCheckbox = document.getElementById("remove-spaces");
    const removeSpaces = removeSpacesCheckbox.checked;
    const removeStopwordsCheckbox = document.getElementById("remove-stopwords");
    const removeStopwords = removeStopwordsCheckbox.checked;
    const removePunctuationCheckbox = document.getElementById("remove-punctuation");
    const removePunctuation = removePunctuationCheckbox.checked;

    // Create a new FormData object and append the stemmer value
    const formData = new FormData(event.target);
    formData.append("stemmer", selectedStemmer);
    formData.append("remove_spaces", removeSpaces);
    formData.append("remove_stopwords", removeStopwords);
    formData.append("remove_punctuation", removePunctuation);

    const response = await fetch("/api/transform", {
        method: "POST",
        body: formData,
    });

    const jsonResponse = await response.json();
    const transformedTextElement = document.getElementById("transformed-text");
    transformedTextElement.value = jsonResponse.text_trimmed;

    // Update the token count for the input and output text
    updateTokenCount(jsonResponse.input_token_count, "token-count-input");
    updateTokenCount(jsonResponse.output_token_count, "token-count-output");

    // Update the character count for the output text
    updateCharCount(transformedTextElement.value, "char-count-output");

    updateSavedPercentage(jsonResponse.input_token_count, jsonResponse.output_token_count, "token-saved-percentage");
    updateSavedPercentage(inputText.length, transformedTextElement.value.length, "char-saved-percentage");
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

function updateSavedPercentage(beforeCount, afterCount, savedPercentageElementId) {
    const percentage = beforeCount > 0 ? ((beforeCount - afterCount) / beforeCount) * 100 : 0;
    const savedPercentageElement = document.getElementById(savedPercentageElementId);
    savedPercentageElement.textContent = `${percentage.toFixed(2)}%`;
}

  // Attach event listeners
  document.addEventListener("DOMContentLoaded", () => {
    const inputTextElement = document.getElementById("input-text");
    inputTextElement.addEventListener("input", (event) => updateCharCount(event.target.value, "char-count-input"));
    inputTextElement.addEventListener("input", async (event) => {updateCharCount(event.target.value, "char-count-input");

    const response = await fetch('/api/transform', {
        method: 'POST',
        body: JSON.stringify({ text: event.target.value }),
        headers: { 'Content-Type': 'application/json' },
    });

    const jsonResponse = await response.json();
    updateTokenCount(jsonResponse.input_token_count, "token-count-input");
});

    const transformForm = document.getElementById("transform-form");
    transformForm.addEventListener("submit", submitForm);

    const stemmerSelectElement = document.getElementById("stemmer-select");
    stemmerSelectElement.addEventListener("change", (event) => updateStemmerDescription(event.target.value));

    const copyButton = document.getElementById("copy-button");
    copyButton.addEventListener("click", copyToClipboard);

     // Add event listeners for "save-tokens-recipe" and "save-characters-recipe" buttons
    const saveTokensRecipeButton = document.getElementById("save-tokens-recipe");
    saveTokensRecipeButton.addEventListener("click", applySaveTokensRecipe);

    const saveCharactersRecipeButton = document.getElementById("save-characters-recipe");
    saveCharactersRecipeButton.addEventListener("click", applySaveCharactersRecipe);


  });
