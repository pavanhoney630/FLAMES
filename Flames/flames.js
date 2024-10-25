document.addEventListener('DOMContentLoaded', function() {
    const maleInput = document.querySelector('.Male');
    const femaleInput = document.querySelector('.Female');
    const matchInput = document.querySelector('.Match');
    const resultSpans = document.querySelectorAll('.letter');
    const startButton = document.querySelector('.btn');

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
                console.log("Removing letter: ", flames[index]); // Debug log

                resultSpans.forEach(span => {
                    if (span.textContent[0].toLowerCase() === flames[index].toLowerCase()) {
                        span.classList.add('eliminating');
                        setTimeout(() => {
                            span.classList.remove('eliminating');
                            flames.splice(index, 1);
                            console.log("Remaining letters: ", flames); // Debug log
                            eliminateLetter();
                        }, 1000);
                    }
                });
            } else {
                const resultLetter = flames[0];
                console.log("Result letter: ", resultLetter); // Debug log
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