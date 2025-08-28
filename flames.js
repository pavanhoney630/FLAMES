function highlightResult(letter) {
    resultSpans.forEach(span => {
        span.classList.remove('highlight');
        span.textContent = span.textContent[0];
        if (span.textContent.toLowerCase() === letter.toLowerCase()) {
            span.classList.add('highlight');
            span.textContent += getEmoji(letter);
        }
    });

    console.log("Male input:", document.querySelector('.Male'));
console.log("Female input:", document.querySelector('.Female'));
console.log("Start button:", document.querySelector('.btn'));
    // ✅ Get random quote
    const randomQuote = displayQuote(letter);

    // ✅ Save to database & also show backend response
    saveResultToDB(letter, randomQuote);
}

function displayQuote(letter) {
    const quotes = {
        'F': [
            "A friend is someone who knows all about you and still loves you.",
            "Good friends are like stars. You don’t always see them, but you know they’re always there.",
            "Friendship is the only cement that will ever hold the world together."
        ],
        'L': [
            "Love is composed of a single soul inhabiting two bodies.",
            "To love and be loved is to feel the sun from both sides.",
            "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope."
        ],
        'A': [
            "Attraction is not an option.",
            "You are what I need in my life.",
            "Attraction starts with the eyes, but grows with the heart."
        ],
        'M': [
            "Marriage is the golden ring in a chain whose beginning is a glance and whose ending is Eternity.",
            "A successful marriage requires falling in love many times, always with the same person.",
            "Marriage is not just spiritual communion, it is also remembering to take out the trash."
        ],
        'E': [
            "Enemies bring out the best in you, but they also bring out the worst in you.",
            "An enemy generally says and believes what he wishes.",
            "Never explain — your friends do not need it, and your enemies will not believe it anyway."
        ],
        'S': [
            "Siblings: children of the same parents, each of whom is perfectly normal until they get together.",
            "Brothers and sisters are as close as hands and feet.",
            "Having lots of siblings is like having built-in best friends."
        ]
    };

    const options = quotes[letter] || [];
    const randomQuote = options.length > 0 ? options[Math.floor(Math.random() * options.length)] : "";

    quoteContainer.textContent = randomQuote;
    return randomQuote; // ✅ return so we can save in DB
}

function saveResultToDB(letter, quote) {
    const maleName = document.querySelector('.Male').value;
    const femaleName = document.querySelector('.Female').value;
    const resultMap = { F: "Friend", L: "Lovers", A: "Attraction", M: "Marriage", E: "Enemy", S: "Siblings" };
    const result = resultMap[letter] || "Unknown";

    console.log("Male input:", document.querySelector('.Male'));
console.log("Female input:", document.querySelector('.Female'));
console.log("Start button:", document.querySelector('.btn'));

    fetch("https://flames-backend-q251.onrender.com/api/flames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maleName, femaleName, result, quote })
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ Saved:", data);

        // ✅ Update UI from backend response too
        if (data.entry) {
            quoteContainer.textContent = data.entry.quote;
        }
    })
    .catch(err => console.error("❌ Error saving:", err));
}
