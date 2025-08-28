document.addEventListener("DOMContentLoaded", function () {
    const maleInput = document.querySelector(".Male");
    const femaleInput = document.querySelector(".Female");
    const resultSpans = document.querySelectorAll(".letter");
    const startButton = document.querySelector(".btn");

    // 🎯 Quote container
    window.quoteContainer = document.createElement("div");
    quoteContainer.classList.add("quote");
    document.body.appendChild(quoteContainer);

    // 🎯 Sound
    const sound = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3"); // replace with your own mp3 if needed

    // ✅ Start button click handler
    startButton.addEventListener("click", function () {
        const maleName = maleInput.value.trim().toLowerCase().replace(/\s/g, "");
        const femaleName = femaleInput.value.trim().toLowerCase().replace(/\s/g, "");

        if (!maleName || !femaleName) {
            alert("Please enter both names");
            return;
        }

        // 🔥 Cancel out common letters
        const cancelledResult = cancelCommonLetters(maleName, femaleName);
        const count = cancelledResult.remaining.length;

        // Show cancelled process in console (or UI if you want)
        console.log("✂ Cancelled:", cancelledResult.cancelled);
        console.log("✨ Remaining letters:", cancelledResult.remaining.join(""));

        playFlames(count);
    });

    // 🔥 Function to cancel common letters visually
    function cancelCommonLetters(male, female) {
        let maleArr = male.split("");
        let femaleArr = female.split("");
        let cancelled = [];

        for (let i = 0; i < maleArr.length; i++) {
            const char = maleArr[i];
            const index = femaleArr.indexOf(char);
            if (index !== -1) {
                cancelled.push(char);
                maleArr[i] = ""; // remove from male
                femaleArr[index] = ""; // remove from female
            }
        }

        return {
            cancelled,
            remaining: [...maleArr.filter(c => c !== ""), ...femaleArr.filter(c => c !== "")]
        };
    }

    // 🔥 Elimination process
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

    // ✅ Highlight result and play sound
    function highlightResult(letter) {
        resultSpans.forEach(span => {
            span.classList.remove("highlight");
            span.textContent = span.textContent[0]; 
            if (span.textContent.toLowerCase() === letter.toLowerCase()) {
                span.classList.add("highlight");
                span.textContent += getEmoji(letter);
            }
        });

        // 🔊 Play sound when result is highlighted
        sound.play();

        // ✅ Get random quote
        const randomQuote = displayQuote(letter);

        // ✅ Save result to backend
        saveResultToDB(letter, randomQuote);
    }

    // ✅ Random quotes
    function displayQuote(letter) {
        const quotes = {
            "F": [
                "A friend is someone who knows all about you and still loves you.",
                "Good friends are like stars. You don’t always see them, but you know they’re always there.",
                "Friendship is the only cement that will ever hold the world together."
            ],
            "L": [
                "Love is composed of a single soul inhabiting two bodies.",
                "To love and be loved is to feel the sun from both sides.",
                "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope."
            ],
            "A": [
                "Attraction is not an option.",
                "You are what I need in my life.",
                "Attraction starts with the eyes, but grows with the heart."
            ],
            "M": [
                "Marriage is the golden ring in a chain whose beginning is a glance and whose ending is Eternity.",
                "A successful marriage requires falling in love many times, always with the same person.",
                "Marriage is not just spiritual communion, it is also remembering to take out the trash."
            ],
            "E": [
                "Enemies bring out the best in you, but they also bring out the worst in you.",
                "An enemy generally says and believes what he wishes.",
                "Never explain — your friends do not need it, and your enemies will not believe it anyway."
            ],
            "S": [
                "Siblings: children of the same parents, each of whom is perfectly normal until they get together.",
                "Brothers and sisters are as close as hands and feet.",
                "Having lots of siblings is like having built-in best friends."
            ]
        };

        const options = quotes[letter] || [];
        const randomQuote = options.length > 0 ? options[Math.floor(Math.random() * options.length)] : "";

        quoteContainer.textContent = randomQuote;
        return randomQuote;
    }

    // ✅ Emoji mapping
    function getEmoji(letter) {
        switch (letter) {
            case "F": return " 😊"; 
            case "L": return " ❤️"; 
            case "A": return " 💘"; 
            case "M": return " 💍"; 
            case "E": return " 😡"; 
            case "S": return " 👯"; 
            default: return "";
        }
    }

    // ✅ Save result to backend
    function saveResultToDB(letter, quote) {
        const maleName = maleInput.value;
        const femaleName = femaleInput.value;
        const resultMap = { F: "Friend", L: "Lovers", A: "Attraction", M: "Marriage", E: "Enemy", S: "Siblings" };
        const result = resultMap[letter] || "Unknown";

        fetch("https://flames-backend-q251.onrender.com/api/flames", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ maleName, femaleName, result, quote })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ Saved:", data);

            if (data.entry) {
                quoteContainer.textContent = data.entry.quote;
            }
        })
        .catch(err => console.error("❌ Error saving:", err));
    }
});
