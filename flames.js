document.addEventListener('DOMContentLoaded', function() {
    const maleInput = document.querySelector('.Male');
    const femaleInput = document.querySelector('.Female');
    const matchInput = document.querySelector('.Match');
    const resultSpans = document.querySelectorAll('.letter');
    const startButton = document.querySelector('.btn');
    const eliminateSound = document.getElementById('eliminate-sound');
    const resultSound = document.getElementById('result-sound');
    const quoteContainer = document.createElement('div');
    quoteContainer.classList.add('quote');
    document.body.appendChild(quoteContainer);

    startButton.addEventListener('click', calculateMatch);

    function calculateMatch() {
        const maleName = maleInput.value.toLowerCase().replace(/\s/g, '');
        const femaleName = femaleInput.value.toLowerCase().replace(/\s/g, '');

        let combinedNames = maleName + femaleName;
        let uniqueChars = combinedNames.split('').filter(char => {
            return !(maleName.includes(char) && femaleName.includes(char));
        });

        matchInput.value = uniqueChars.join(', ');

        const count = uniqueChars.length;
        playFlames(count);
    }

    function playFlames(count) {
        const flames = ['F', 'L', 'A', 'M', 'E', 'S'];
        let index = 0;
        
        function eliminateLetter() {
            if (flames.length > 1) {
                index = (index + count - 1) % flames.length;
                
                resultSpans.forEach(span => {
                    if (span.textContent[0].toLowerCase() === flames[index].toLowerCase()) {
                        span.classList.add('eliminating');
                        eliminateSound.play();
                        setTimeout(() => {
                            span.classList.remove('eliminating');
                            flames.splice(index, 1);
                            eliminateLetter();
                        }, 1000);
                    }
                });
            } else {
                const resultLetter = flames[0];
                resultSound.play();
                highlightResult(resultLetter);
            }
        }

        eliminateLetter();
    }

    function highlightResult(letter) {
        resultSpans.forEach(span => {
            span.classList.remove('highlight');
            span.textContent = span.textContent[0]; // Remove any previous emoji
            if (span.textContent.toLowerCase() === letter.toLowerCase()) {
                span.classList.add('highlight');
                span.textContent += getEmoji(letter);
            }
        });
        displayQuote(letter);
    }

    function displayQuote(letter) {
        const quotes = {
            'F': "A friend is someone who knows all about you and still loves you.",
            'L': "Love is composed of a single soul inhabiting two bodies.",
            'A': "Attraction is not an option.",
            'M': "Marriage is the golden ring in a chain whose beginning is a glance and whose ending is Eternity.",
            'E': "Enemies bring out the best in you, but they also bring out the worst in you.",
            'S': "Siblings: children of the same parents, each of whom is perfectly normal until they get together."
        };

        quoteContainer.textContent = quotes[letter] || "";
        
    }

    function getEmoji(letter) {
        switch (letter) {
            case 'F': return ' 😊'; // Friend
            case 'L': return ' ❤️'; // Lovers
            case 'A': return ' 💘'; // Attraction
            case 'M': return ' 💍'; // Marriage
            case 'E': return ' 😡'; // Enemy
            case 'S': return ' 👯'; // Siblings
            default: return '';
        }
    }
});
