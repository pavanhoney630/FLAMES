document.addEventListener("DOMContentLoaded", function () {
    const maleInput = document.querySelector(".Male");
    const femaleInput = document.querySelector(".Female");
    const resultSpans = document.querySelectorAll(".letter");
    const startButton = document.querySelector(".btn");

    // 🎯 Create containers dynamically
    const cancelContainer = document.createElement("div");
    cancelContainer.classList.add("cancel-process");
    document.body.appendChild(cancelContainer);

    const uniqueContainer = document.createElement("div");
    uniqueContainer.classList.add("unique-letters");
    document.body.appendChild(uniqueContainer);

    const resultContainer = document.createElement("div");
    resultContainer.classList.add("final-result");
    document.body.appendChild(resultContainer);

    const quoteContainer = document.createElement("div");
    quoteContainer.classList.add("quote");
    document.body.appendChild(quoteContainer);

    // 🎯 Sound
    const sound = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3");

    // ✅ Start button click handler
    startButton.addEventListener("click", function () {
        const maleName = maleInput.value.trim().toLowerCase().replace(/\s/g, "");
        const femaleName = femaleInput.value.trim().toLowerCase().replace(/\s/g, "");

        if (!maleName || !femaleName) {
            alert("Please enter both names");
            return;
        }

        // Reset UI
        cancelContainer.innerHTML = `<h3>Cancelling Process:</h3><p></p>`;
        uniqueContainer.innerHTML = "";
        resultContainer.innerHTML = "";
        quoteContainer.innerHTML = "";

        cancelCommonLettersAnimated(maleName, femaleName);
    });

    // 🔥 Cancel common letters with animation + sound
    function cancelCommonLettersAnimated(male, female) {
        let maleArr = male.split("");
        let femaleArr = female.split("");
        let cancelSteps = cancelContainer.querySelector("p");
        let i = 0;

        function step() {
            if (i >= maleArr.length) {
                const remaining = [...maleArr.filter(c => c !== ""), ...femaleArr.filter(c => c !== "")];
                const uniqueLetters = remaining.join(", ");
                uniqueContainer.innerHTML = `<h3>Remaining Unique Letters:</h3><p>${uniqueLetters}</p>`;

                // ✅ Send remaining count to backend for final FLAMES result
                saveResultToDB(remaining.length);
                return;
            }

            const char = maleArr[i];
            const index = femaleArr.indexOf(char);

            if (char && index !== -1) {
                // Animate strike-through + sound
                const span = document.createElement("span");
                span.textContent = char;
                span.style.textDecoration = "line-through";
                span.style.color = "red";
                span.style.marginRight = "5px";
                span.style.transition = "all 0.3s ease";
                cancelSteps.appendChild(span);
                sound.play();

                maleArr[i] = "";
                femaleArr[index] = "";
            }

            i++;
            setTimeout(step, 500);
        }

        step();
    }

    // ✅ Save result to backend & display (use backend result for both text & emoji)
    function saveResultToDB(count) {
        const maleName = maleInput.value;
        const femaleName = femaleInput.value;
        const quote = ""; // optional placeholder, backend can generate

        fetch("https://flames-backend-q251.onrender.com/api/flames", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ maleName, femaleName, count, quote })
        })
        .then(res => res.json())
        .then(data => {
            if (data.entry) {
                const resultStr = data.entry.result; // backend result string
                const emojiMap = {
                    "Friend": "😊",
                    "Lovers": "❤️",
                    "Attraction": "💘",
                    "Marriage": "💍",
                    "Enemy": "😡",
                    "Siblings": "👯"
                };
                const emoji = emojiMap[resultStr] || "";

                // Highlight result letters based on backend result
                resultSpans.forEach(span => {
                    span.classList.remove("highlight");
                    span.textContent = span.dataset.letter || span.textContent[0];

                    if (span.textContent.toUpperCase() === resultStr[0].toUpperCase()) {
                        span.classList.add("highlight");
                        span.textContent += emoji;
                    }
                });

                // Display final result + quote
                resultContainer.innerHTML = `<h2>Result: ${resultStr} ${emoji}</h2>`;
                quoteContainer.innerHTML = `<p>"${data.entry.quote}"</p>`;
            }
        })
        .catch(err => console.error("❌ Error saving:", err));
    }
});
