document.addEventListener('DOMContentLoaded', () => {
    const questionsData = [
        {
            title: "MORE OFTEN THAN NOT I:",
            options: {
                A: "Get energized talking to new people",
                B: "Get restless when my routine doesn't change often enough",
                C: "Feel responsible to follow the rules",
                D: "Get satisfaction from personally helping someone in need"
            }
        },
        {
            title: "I AM BOTHERED BY:",
            options: {
                A: "People that cut corners",
                B: "People that see obstacles instead of opportunities",
                C: "People that aren’t honest with themselves",
                D: "People that don't want to talk"
            }
        },
        {
            title: "I WANT TO BE FREE TO:",
            options: {
                A: "Help others grow in Christ",
                B: "Engage in conversations about faith",
                C: "Do what I know is right",
                D: "Accomplish what I can envision"
            }
        },
        {
            title: "I AM:",
            options: {
                A: "Very persuasive in conversations",
                B: "Unflinchingly loyal",
                C: "Comfortable with uncertainty",
                D: "Invested in the people around me"
            }
        },
        {
            title: "MY PASSION IS:",
            options: {
                A: "Understanding the Bible",
                B: "Preaching the Gospel",
                C: "Holy living",
                D: "Missions"
            }
        },
        {
            title: "I FEEL THE MOST COMFORTABLE:",
            options: {
                A: "When there are established procedures",
                B: "When there is freedom to fail",
                C: "Talking about Jesus",
                D: "Giving biblical counsel"
            }
        },
        {
            title: "THE QUALITY I ADMIRE MOST IN MYSELF IS:",
            options: {
                A: "Boldness in conversations",
                B: "Strength of conviction",
                C: "Compassion for others",
                D: "An entrepreneurial spirit"
            }
        },
        {
            title: "I WANT TO BE REMEMBERED AS SOMEONE WHO:",
            options: {
                A: "Was on the cutting edge, pushing the envelope",
                B: "Caused people to be more like Jesus",
                C: "Saved souls for the kingdom",
                D: "Protected the community from apathy and corruption"
            }
        },
        {
            title: "I AM GOOD AT SEEING:",
            options: {
                A: "The reality that most others ignore or are ignorant of",
                B: "What is possible",
                C: "The issues that others are struggling with",
                D: "Everyday divine appointments"
            }
        },
        {
            title: "I GET EXCITED ABOUT:",
            options: {
                A: "Seeing breakthroughs in believer’s lives",
                B: "God’s standards being kept",
                C: "Doing something or going somewhere new for God",
                D: "People coming to know Jesus as their savior"
            }
        }
    ];

    const questionnaireContainer = document.getElementById('questionnaire-container');
    const calculateButton = document.getElementById('calculate-button');
    const resultsContainer = document.getElementById('results-container');
    const totalASpan = document.getElementById('total-a');
    const totalBSpan = document.getElementById('total-b');
    const totalCSpan = document.getElementById('total-c');
    const totalDSpan = document.getElementById('total-d');
    const errorMessageDiv = document.getElementById('error-message');

    function renderQuestions() {
        questionsData.forEach((question, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.classList.add('question-block');
            questionBlock.setAttribute('data-question-index', index);

            const questionTitle = document.createElement('h3');
            questionTitle.classList.add('question-title');
            questionTitle.textContent = `${index + 1}. ${question.title}`;
            questionBlock.appendChild(questionTitle);

            ['A', 'B', 'C', 'D'].forEach(optionKey => {
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('option');

                const optionLabel = document.createElement('span');
                optionLabel.classList.add('option-label');
                optionLabel.textContent = optionKey;
                optionDiv.appendChild(optionLabel);

                const optionText = document.createElement('span');
                optionText.classList.add('option-text');
                optionText.textContent = question.options[optionKey];
                optionDiv.appendChild(optionText);

                const optionInputDiv = document.createElement('div');
                optionInputDiv.classList.add('option-input');
                const select = document.createElement('select');
                select.setAttribute('data-option-key', optionKey);
                select.setAttribute('data-question-index', index);

                // Add default placeholder option
                const defaultOption = document.createElement('option');
                defaultOption.value = "";
                defaultOption.textContent = "Rank";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);

                // Add number options 1-4
                for (let i = 1; i <= 4; i++) {
                    const numOption = document.createElement('option');
                    numOption.value = i.toString();
                    numOption.textContent = i.toString();
                    select.appendChild(numOption);
                }

                select.addEventListener('change', handleDropdownChange);
                optionInputDiv.appendChild(select);
                optionDiv.appendChild(optionInputDiv);

                questionBlock.appendChild(optionDiv);
            });
            questionnaireContainer.appendChild(questionBlock);
        });
    }

    function displayError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('error-hidden');
        resultsContainer.classList.add('results-hidden');
    }

    function clearError() {
        errorMessageDiv.textContent = '';
        errorMessageDiv.classList.add('error-hidden');
    }

    function handleDropdownChange(event) {
        const changedSelect = event.target;
        const qIndex = changedSelect.dataset.questionIndex;
        const allSelectsInQuestion = document.querySelectorAll(`select[data-question-index="${qIndex}"]`);

        // Gather all currently selected values in this question group (excluding the placeholder)
        const selectedValuesInQuestion = new Set();
        allSelectsInQuestion.forEach(s => {
            if (s.value !== "") {
                selectedValuesInQuestion.add(s.value);
            }
        });

        // Update options for all selects in this question group
        allSelectsInQuestion.forEach(s => {
            for (let i = 0; i < s.options.length; i++) {
                const option = s.options[i];
                if (option.value === "") { // Skip the placeholder option
                    continue;
                }
                // Disable if this option's value is selected in *another* dropdown for this question
                if (selectedValuesInQuestion.has(option.value) && s.value !== option.value) {
                    option.disabled = true;
                } else {
                    option.disabled = false;
                }
            }
        });
    }

    function calculateTotals() {
        clearError();
        let allValid = true;
        const totals = { A: 0, B: 0, C: 0, D: 0 };
        const formInputs = [];

        questionsData.forEach((question, qIndex) => {
            const inputsForQuestion = [];
            const valuesInQuestion = new Set();
            let questionCompleteAndValid = true;

            ['A', 'B', 'C', 'D'].forEach(optionKey => {
                const selectElement = document.querySelector(`select[data-question-index="${qIndex}"][data-option-key="${optionKey}"]`);
                if (selectElement) {
                    if (selectElement.value === "") { // Check if placeholder "Rank" is selected
                        allValid = false;
                        questionCompleteAndValid = false;
                    } else {
                        const value = parseInt(selectElement.value, 10);
                        // This check also covers NaN from parseInt if something unexpected happens
                        if (isNaN(value) || value < 1 || value > 4) {
                            allValid = false;
                            questionCompleteAndValid = false;
                        } else {
                            inputsForQuestion.push({ key: optionKey, value: value });
                            valuesInQuestion.add(value);
                        }
                    }
                } else {
                    allValid = false; // Should not happen if rendered correctly
                    questionCompleteAndValid = false;
                }
            });

            if (!questionCompleteAndValid && allValid) { // Check if this specific question has an issue
                // allValid might still be true if this is the first error encountered
                displayError(`Please select a valid rank (1-4) for all options in question ${qIndex + 1}.`);
                allValid = false; // Ensure outer allValid is also false
                return; // Stop processing this question, outer loop will continue to find more errors if any
            }

            // This check is vital for ensuring unique ranks are used.
            // It should only be checked if the question was otherwise complete (all dropdowns filled).
            if (questionCompleteAndValid && valuesInQuestion.size !== 4) {
                displayError(`For question ${qIndex + 1}, please use each rank (1, 2, 3, 4) exactly once.`);
                allValid = false;
                return; // Stop processing this question
            }
            // If questionCompleteAndValid is false, an error is already set,
            // and we don't want to overwrite it with the "use each rank once" message yet.
            if (!questionCompleteAndValid) {
                 // If the error message wasn't set by the inner loop (e.g. selectElement.value === "")
                 // and displayError hasn't been called yet for this question.
                if (errorMessageDiv.classList.contains('error-hidden') || !errorMessageDiv.textContent.includes(`question ${qIndex + 1}`)) {
                    displayError(`Please select a valid rank (1-4) for all options in question ${qIndex + 1}.`);
                }
                allValid = false;
                return;
            }
            formInputs.push(inputsForQuestion);
        });


        if (!allValid) {
            // Error messages are now more specific and set within the loop.
            // If loop completed and allValid is false, an error message should already be displayed.
            // Fallback generic message if somehow no specific error was set.
            if (errorMessageDiv.classList.contains('error-hidden')) {
                displayError("Please ensure all questions are answered correctly using unique ranks (1-4) per question.");
            }
            return;
        }

        formInputs.forEach(questionInputs => {
            questionInputs.forEach(input => {
                totals[input.key] += input.value;
            });
        });

        totalASpan.textContent = totals.A;
        totalBSpan.textContent = totals.B;
        totalCSpan.textContent = totals.C;
        totalDSpan.textContent = totals.D;
        resultsContainer.classList.remove('results-hidden');
    }

    renderQuestions();
    calculateButton.addEventListener('click', calculateTotals);
});

