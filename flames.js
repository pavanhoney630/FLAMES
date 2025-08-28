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

                playFlames(remaining.length);
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

    // 🔥 FLAMES elimination
    function playFlames(count) {
        const flames = ["F", "L", "A", "M", "E", "S"];
        let index = 0;

        while (flames.length > 1) {
            index = (index + count - 1) % flames.length;
            flames.splice(index, 1);
        }

        const resultLetter = flames[0];
        highlightResult(resultLetter);
    }

    // ✅ Highlight result with correct emoji
    function highlightResult(letter) {
        resultSpans.forEach(span => {
            span.classList.remove("highlight");
            const baseLetter = span.dataset.letter || span.textContent[0];
            span.dataset.letter = baseLetter;
            span.textContent = baseLetter;

            if (baseLetter.toUpperCase() === letter.toUpperCase()) {
                span.classList.add("highlight");
                span.textContent += getEmoji(baseLetter); // use baseLetter here
            }
        });

        sound.play();

        const randomQuote = displayQuote(letter);
        saveResultToDB(letter, randomQuote);
    }

    // ✅ Random quotes
    function displayQuote(letter) {
        const quotes = {
            "F": ["A friend is someone who knows all about you and still loves you."],
            "L": ["Love is composed of a single soul inhabiting two bodies."],
            "A": ["Attraction starts with the eyes, but grows with the heart."],
            "M": ["A successful marriage requires falling in love many times, always with the same person."],
            "E": ["Enemies bring out the best in you, but they also bring out the worst in you."],
            "S": ["Siblings: children of the same parents, each of whom is perfectly normal until they get together."]
        };
        const options = quotes[letter] || [];
        const randomQuote = options[Math.floor(Math.random() * options.length)] || "";
        quoteContainer.textContent = randomQuote;
        return randomQuote;
    }

    // ✅ Emoji mapping
    function getEmoji(letter) {
        switch (letter.toUpperCase()) {
            case "F": return " 😊";
            case "L": return " ❤️";
            case "A": return " 💘";
            case "M": return " 💍";
            case "E": return " 😡";
            case "S": return " 👯";
            default: return "";
        }
    }

    // ✅ Save result to backend & display
    function saveResultToDB(letter, quote) {
        const maleName = maleInput.value;
        const femaleName = femaleInput.value;
        const resultMap = { F: "Friend", L: "Lovers", A: "Attraction", M: "Marriage", E: "Enemy", S: "Siblings" };
        const result = resultMap[letter.toUpperCase()] || "Unknown";

        fetch("https://flames-backend-q251.onrender.com/api/flames", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ maleName, femaleName, result, quote })
        })
            .then(res => res.json())
            .then(data => {
                console.log("✅ Saved:", data);
                if (data.entry) {
                    resultContainer.innerHTML = `<h2>Result: ${data.entry.result} ${getEmoji(letter)}</h2>`;
                    quoteContainer.innerHTML = `<p>"${data.entry.quote}"</p>`;
                }
            })
            .catch(err => console.error("❌ Error saving:", err));
    }
});
