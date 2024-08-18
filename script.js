function getQuestion() {
    return document.getElementsByClassName("question-text-color")[0]?.innerText;
}

function getOptions() {
    return [].slice.call(document.getElementsByClassName("option")).map(i => i.innerText).sort();
}

function getTypedOptionInput() {
    return document.getElementsByClassName("typed-option-input")[0];
}

function getFloatingButton() {
    return document.getElementsByClassName("floatingButton")[0];
}

function autoOptionInput() {
    // simulate input text
    const inputField = getTypedOptionInput();
    inputField.value = "abcxyz";
    const event = new Event('input', { bubbles: true });
    inputField.dispatchEvent(event);

    setTimeout(() => {
        // simulate click button to submit answer
        const button = getFloatingButton();
        const clickEvent = new Event('click');
        button.dispatchEvent(clickEvent);
    }, 1000);
}

function autoOptions() {
    const firstOption = document.getElementById("optionText");
    firstOption.click();
}

function execute() {
    let question, options, answer;

    // Capture Network response
    (function () {
        // Save the original XMLHttpRequest open and send functions
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        // Override the open method to capture request details
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._method = method;
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        // Override the send method to capture response details
        XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener('load', function () {
                const question = JSON.parse(this.responseText)?.question;
                if (question) {
                    const textOptions = question?.structure?.options;

                    if (textOptions) {
                        answer = textOptions?.[0]?.text;
                    } else {
                        answer = options[question?.structure?.answer];
                    }
                    console.log("Answer: " + answer);
                }
            });
            return originalSend.apply(this, arguments);
        };
    })();

    setInterval(() => {
        const currentQuestion = getQuestion();
        if (!currentQuestion) {
            document.getElementsByClassName("selector")[0].click();
        }
        if (currentQuestion === question) return;

        question = currentQuestion;
        console.log("Question: " + question);

        const currentOptions = getOptions();
        if (currentOptions.length > 0) {
            options = currentOptions;
            autoOptions();
        } else {
            autoOptionInput();
        }
    }, 250);
}
