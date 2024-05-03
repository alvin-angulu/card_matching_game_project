// Listen for the document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
     // Retrieve elements from the DOM and assign them to variables
    const gameContainer = document.getElementById('gameContainer');
    const userDisplay = document.getElementById('userDisplay');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const timerDisplay = document.getElementById('timerDisplay');  // Timer display
     // Array representing different card values in the game
    const cardValues = ['KING', 'QUEEN', 'KNIGHT', 'QUEEN', 'JOKER', 'KNIGHT', 'JOKER', 'KING','BISHOP', 'PAWN', 'PAWN', 'BISHOP'];
    let flippedCards = [];
    let matchesFound = 0;
    let currentUser = null; // Object to store the current user's information
    let gameTimer; // Variable to store the interval ID for the game timer
    let secondsElapsed = 0; 
   
    // Add a restart button
    const startButton = document.getElementById('startButton');
   startButton.addEventListener('click', createUser);

  
 // Function to start the game timer
    function startTimer() {
        stopTimer();  // Ensure any existing timer is stopped before starting a new one
        gameTimer = setInterval(() => {
            secondsElapsed++;
            displayTime();
        }, 1000); // Set interval to 1 second
    }

    function stopTimer() {
        clearInterval(gameTimer); // Clear the interval using the stored timer ID
    }

     // Function to update the timer display
    function displayTime() {
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        // Update the timerDisplay text to show the time in mm:ss format
        timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Function to reset the game timer
    function resetTimer() {
        stopTimer();
        secondsElapsed = 0;
        displayTime();
    }

//create new user before game kicks off
    function createUser() {
        const username = document.getElementById('usernameInput').value.toUpperCase();
        fetch('http://localhost:3000/users', {
              // Send a POST request to the server to create a new user with the entered username and initial score of 0
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, score: 0 })
        })
        .then(response => response.json())
        .then(data => {
            // Ensure the ID is treated as an integer
           // data.Userid = parseInt(data.Userid, 10);
            currentUser = data;
            userDisplay.textContent = `Player: ${currentUser.username}`; // Display the current user's name
            scoreDisplay.textContent = `Score: ${currentUser.score}`; // Display the current user's score
            initializeGame(); // Start the game once the user is created

        })
        .catch(error => console.error('Error:', error));
    }


//logic to fetch highest score
    function fetchHighScore() {
        fetch('http://localhost:3000/users') // Send a GET request to retrieve user data
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.json();
            })
            .then(users => {
                if (users.length > 0) {
                // use the inbuilt reduce callback function to sift through the user object and find the one with the highest score
                    const highestScoreUser = users.reduce((max, user) => max.score > user.score ? max : user);
                    displayHighScore(highestScoreUser);
                }else {
                    console.log("No users found or scores are zero.");
                }
            })
            .catch(error => console.error('Error fetching high scores:', error));
    }
    
    //logic to display highest score
    function displayHighScore(user) {
        const highScoreDisplay = document.getElementById('highScoreDisplay');
        highScoreDisplay.textContent = `Highest Score: ${user.score} by ${user.username}`;
    }
    

    //logic to update score
    function updateScore(newScore) {
        if (!currentUser) return;
        currentUser.score = newScore;
         // Send a PATCH request to update the user's score on the server
        fetch(`http://localhost:3000/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ score: newScore })
        })
        .then(response => response.json())
        .then(data => {
            scoreDisplay.textContent = `Score: ${data.score}`; // Update the score display with the new score
        })
        .catch(error => console.error('Error:', error)); // Log any errors to the console
    }

     // Function to initialize and start a new game
    function initializeGame() {
        gameContainer.innerHTML = ''; // Clear the game container
        fetchHighScore(); // Fetch the highest score to display
        shuffle(cardValues);
       
        cardValues.forEach(value => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = value;
            
            cardElement.addEventListener('click', () => {
                if (!cardElement.classList.contains('flipped')) {
                    startTimer();
                    flipCard(cardElement);
                   
                }
            });
            gameContainer.appendChild(cardElement);
        });
        matchesFound = 0;
        resetTimer(); // Reset timer at the start of the game
        if (currentUser) {
            updateScore(0); // Reset score at the start of the game
        }
    }



     // Define the flipCard function to handle flipping a card
    function flipCard(card) {
        if (flippedCards.length < 2) {
            card.classList.add('flipped');
            card.textContent = card.dataset.value;
            card.style.background = '#f0f0f0';
            card.style.dsplay = 'flex';
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
            let newScore = currentUser.score + 10; // Increase score for a match
            updateScore(newScore);
            flippedCards = [];
            if (matchesFound === cardValues.length) {
                stopTimer();
                alert(`Congratulations! You found all matches. Your score: ${newScore}`);
            }
        } else {
            let newScore = currentUser.score - 5; // Decrease score for a wrong match
            updateScore(newScore);
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
                card.style.backgroundImage = "url('./back.jpg')";
                card.textContent = '';
            });
            flippedCards = [];
        }
    }

     // Function to shuffle the elements in an array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

   
});
