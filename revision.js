
///IGNORE THIS FILE!!!!

document.addEventListener('DOMContentLoaded', () => {
    // Get the game container element by its ID
    const gameContainer = document.getElementById('gameContainer');

    // Array containing pairs of card values. These will be the faces of the cards.
    const cardValues = ['KING', 'QUEEN', 'KNIGHT', 'QUEEN', 'JOKER', 'KNIGHT', 'JOKER', 'KING'];

    // An array to keep track of currently flipped cards (up to two at a time)
    let flippedCards = [];

    // Counter to keep track of how many matches have been found
    let matchesFound = 0;

    // Initialize score
    let score = 0;

    // Display score
    const scoreDisplay = document.createElement('div');
    scoreDisplay.textContent = `Score: ${score}`;
    document.body.insertBefore(scoreDisplay, gameContainer);

    // Add a restart button
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.style.display = 'none'; // Hide the restart button initially
    document.body.insertBefore(restartButton, gameContainer.nextSibling);
    restartButton.addEventListener('click', restartGame);

    // Timer display
    const timerDisplay = document.createElement('div');
    timerDisplay.textContent = 'Time remaining: 60 seconds';
    document.body.insertBefore(timerDisplay, gameContainer);

    let timer; // Holds the timer interval
    let timeRemaining = 60; // Time in seconds

    // Function to start the timer
    function startTimer() {
        timer = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                timerDisplay.textContent = `Time remaining: ${timeRemaining} seconds`;
            } else {
                clearInterval(timer);
                alert('Time is up! Try again.');
                restartGame();
            }
        }, 1000);
    }

    // Function to shuffle the cards
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to initialize or restart the game
    function initializeGame() {
        gameContainer.innerHTML = ''; // Clear the game container
        shuffle(cardValues); // Shuffle the cardValues array

        // Create and display each card
        cardValues.forEach(value => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = value;
            cardElement.addEventListener('click', () => {
                if (!cardElement.classList.contains('flipped')) {
                    flipCard(cardElement);
                }
            });
            gameContainer.appendChild(cardElement);
        });

        // Reset game state
        flippedCards = [];
        matchesFound = 0;
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        restartButton.style.display = 'block'; // Hide the restart button
        timeRemaining = 60; // Reset timer
        clearInterval(timer); // Clear existing timer if any
        startTimer(); // Start new timer
    }

    // Define the flipCard function to handle flipping a card
    function flipCard(card) {
        if (flippedCards.length < 2) {
            card.classList.add('flipped');
            card.textContent = card.dataset.value;
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                setTimeout(checkForMatch, 500);
            }
        }
    }

    // Define the checkForMatch function to compare two flipped cards
    function checkForMatch() {
        if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
            matchesFound += 2;
            score += 10; // Update score for a match
            scoreDisplay.textContent = `Score: ${score}`;
            flippedCards = [];
            if (matchesFound === cardValues.length) {
                clearInterval(timer); // Stop the timer
                alert(`Congratulations! You found all matches. Your score: ${score}`);
                restartButton.style.display = 'block'; // Show the restart button
            }
        } else {
            score -= 5; // Update score for a wrong match
            scoreDisplay.textContent = `Score: ${score}`;
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
                card.textContent = '';
            });
            flippedCards = [];
        }
    }

    // Function to restart the game
    function restartGame() {
        initializeGame(); // Re-initialize the game
    }

    // Start the game for the first time
    initializeGame();
});
