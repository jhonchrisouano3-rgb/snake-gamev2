/* =====================================================
   ELEMENTS
===================================================== */

const board =
    document.getElementById("board");

const dice =
    document.getElementById("dice");

const frontNumber =
    document.getElementById("frontNumber");

const rollButton =
    document.getElementById("rollButton");

const restartButton =
    document.getElementById("restartButton");

const newGameButton =
    document.getElementById("newGameButton");

const playerCount =
    document.getElementById("playerCount");

const message =
    document.getElementById("message");

const turn =
    document.getElementById("turn");

const playersInfo =
    document.getElementById("playersInfo");

const currentDate =
    document.getElementById("currentDate");

const currentTime =
    document.getElementById("currentTime");


/* =====================================================
   PLAYER DATA
===================================================== */

const playerNames = [
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4"
];

const tokenClasses = [
    "player1-token",
    "player2-token",
    "player3-token",
    "player4-token"
];


/*
    RANDOM CHESS PIECES
*/

const chessPieces = [
    "♟",
    "♜",
    "♞",
    "♝",
    "♛",
    "♚"
];


let players = [];

let currentPlayer = 0;

let gameOver = false;

let isMoving = false;


/* =====================================================
   SNAKES
===================================================== */

const snakes = {

    17: 7,
    23: 5,
    29: 11,
    37: 16,
    42: 22,
    54: 34,
    58: 39,
    62: 19,
    65: 45,
    73: 52,
    84: 64,
    89: 48,
    92: 88,
    95: 75,
    98: 78

};


/* =====================================================
   LADDERS
===================================================== */

const ladders = {

    4: 25,
    9: 31,
    20: 38,
    28: 55,
    40: 59,
    51: 67,
    63: 81,
    71: 91,
    74: 88,
    82: 96

};


/* =====================================================
   RANDOM CHESS PIECE
===================================================== */

function getRandomChessPiece() {

    const randomIndex =
        Math.floor(
            Math.random() *
            chessPieces.length
        );

    return chessPieces[randomIndex];

}


/* =====================================================
   CREATE BOARD
===================================================== */

function createBoard() {

    board.innerHTML = "";

    for (
        let row = 0;
        row < 10;
        row++
    ) {

        const start =
            100 - row * 10;

        let numbers = [];

        for (
            let i = 0;
            i < 10;
            i++
        ) {

            numbers.push(
                start - i
            );

        }

        if (
            row % 2 === 1
        ) {

            numbers.reverse();

        }


        numbers.forEach(
            number => {

                const cell =
                    document.createElement("div");

                cell.className =
                    "cell";

                cell.dataset.number =
                    number;


                /* NUMBER */

                const numberElement =
                    document.createElement("span");

                numberElement.className =
                    "number";

                numberElement.textContent =
                    number;

                cell.appendChild(
                    numberElement
                );


                /* SNAKE */

                if (
                    snakes[number]
                ) {

                    cell.classList.add(
                        "snake"
                    );

                    const snake =
                        document.createElement("div");

                    snake.className =
                        "snake-icon";

                    snake.textContent =
                        "🐍";

                    cell.appendChild(
                        snake
                    );

                }


                /* LADDER */

                if (
                    ladders[number]
                ) {

                    cell.classList.add(
                        "ladder"
                    );

                    const ladder =
                        document.createElement("div");

                    ladder.className =
                        "ladder-icon";

                    ladder.textContent =
                        "🪜";

                    cell.appendChild(
                        ladder
                    );

                }


                board.appendChild(
                    cell
                );

            }
        );

    }

}


/* =====================================================
   GET CELL
===================================================== */

function getCell(position) {

    return document.querySelector(
        `.cell[data-number="${position}"]`
    );

}


/* =====================================================
   RESET DICE
===================================================== */

function resetDice() {

    dice.classList.remove(
        "rolling"
    );

    frontNumber.textContent =
        "1";

    dice.style.transform =
        "rotateX(-15deg) rotateY(-20deg) rotateZ(0deg)";

}


/* =====================================================
   CREATE PLAYERS
===================================================== */

function createPlayers() {

    const count =
        parseInt(
            playerCount.value
        );

    players = [];


    for (
        let i = 0;
        i < count;
        i++
    ) {

        players.push({

            name:
                playerNames[i],

            position:
                1,

            tokenClass:
                tokenClasses[i],

            /* RANDOM CHESS SHAPE */

            chessPiece:
                getRandomChessPiece()

        });

    }


    currentPlayer = 0;

    gameOver = false;

    isMoving = false;

    rollButton.disabled =
        false;

    resetDice();

    message.textContent =
        "Roll the D8 to start!";

    turn.textContent =
        "Player 1's Turn";

    updateTokens();

}


/* =====================================================
   UPDATE TOKENS
===================================================== */

function updateTokens() {

    document
        .querySelectorAll(
            ".token-container"
        )
        .forEach(
            token =>
                token.remove()
        );


    players.forEach(
        player => {

            const cell =
                getCell(
                    player.position
                );

            if (!cell) {
                return;
            }


            const container =
                document.createElement("div");

            container.className =
                "token-container";


            const token =
                document.createElement("div");

            token.className =
                `token ${player.tokenClass}`;


            /*
                RANDOM CHESS PIECE
                ♟ ♜ ♞ ♝ ♛ ♚
            */

            token.textContent =
                player.chessPiece;


            /*
                Used for 3D shadow
            */

            token.setAttribute(
                "data-piece",
                player.chessPiece
            );


            container.appendChild(
                token
            );


            cell.appendChild(
                container
            );

        }
    );


    updatePlayersInfo();

}


/* =====================================================
   PLAYER INFORMATION
===================================================== */

function updatePlayersInfo() {

    playersInfo.innerHTML = "";


    players.forEach(
        (player, index) => {

            const box =
                document.createElement("div");

            box.className =
                `player-info player${index + 1}`;


            box.innerHTML = `

                <span class="player-icon">
                    ${player.chessPiece}
                </span>

                <span class="player-name">
                    ${player.name}
                </span>

                <span class="position-label">
                    POS.
                </span>

                <span class="position-number">
                    ${player.position}
                </span>

            `;


            playersInfo.appendChild(
                box
            );

        }
    );

}


/* =====================================================
   ROLL D8
===================================================== */

function rollDice() {

    if (
        gameOver ||
        isMoving
    ) {
        return;
    }


    isMoving = true;

    rollButton.disabled =
        true;


    const player =
        players[currentPlayer];


    /*
        D8
        1 - 8
    */

    const roll =
        Math.floor(
            Math.random() * 8
        ) + 1;


    dice.classList.remove(
        "rolling"
    );


    /*
        Force browser
        to restart animation
    */

    void dice.offsetWidth;


    dice.classList.add(
        "rolling"
    );


    message.textContent =
        `${player.name} is rolling the D8...`;


    setTimeout(
        () => {

            dice.classList.remove(
                "rolling"
            );


            dice.style.transform =
                "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";


            /*
                IMPORTANT:
                Keep number visible
            */

            frontNumber.textContent =
                roll;

            frontNumber.style.visibility =
                "visible";

            frontNumber.style.opacity =
                "1";

            frontNumber.style.display =
                "block";


            message.textContent =
                `${player.name} rolled ${roll}!`;


            movePlayer(
                player,
                roll
            );

        },
        1400
    );

}


/* =====================================================
   MOVE PLAYER
===================================================== */

function movePlayer(
    player,
    steps
) {

    const target =
        player.position + steps;


    if (
        target > 100
    ) {

        message.textContent =
            `${player.name} needs an exact roll to reach 100.`;

        setTimeout(
            nextTurn,
            1000
        );

        return;

    }


    let step = 0;


    function moveOneStep() {

        step++;

        player.position++;


        updateTokens();


        const cell =
            getCell(
                player.position
            );


        if (cell) {

            const token =
                cell.querySelector(
                    ".token"
                );


            if (token) {

                token.classList.add(
                    "token-moving"
                );


                setTimeout(
                    () => {

                        token.classList.remove(
                            "token-moving"
                        );

                    },
                    300
                );

            }

        }


        message.textContent =
            `${player.name} moved to ${player.position}.`;


        if (
            step < steps
        ) {

            setTimeout(
                moveOneStep,
                250
            );

        }
        else {

            setTimeout(
                checkSnakeOrLadder,
                500
            );

        }

    }


    moveOneStep();

}


/* =====================================================
   SNAKE / LADDER
===================================================== */

function checkSnakeOrLadder() {

    const player =
        players[currentPlayer];


    /* LADDER */

    if (
        ladders[player.position]
    ) {

        const start =
            player.position;

        const destination =
            ladders[start];


        message.textContent =
            `🪜 ${player.name} landed on a ladder!`;


        setTimeout(
            () => {

                player.position =
                    destination;

                updateTokens();

                message.textContent =
                    `🪜 Ladder! ${start} → ${destination}`;

                setTimeout(
                    checkWinner,
                    700
                );

            },
            700
        );


        return;

    }


    /* SNAKE */

    if (
        snakes[player.position]
    ) {

        const start =
            player.position;

        const destination =
            snakes[start];


        message.textContent =
            `🐍 ${player.name} stepped on a snake!`;


        setTimeout(
            () => {

                animateSnakeMovement(
                    player,
                    start,
                    destination
                );

            },
            400
        );


        return;

    }


    checkWinner();

}


/* =====================================================
   SNAKE ANIMATION
===================================================== */

function animateSnakeMovement(
    player,
    start,
    destination
) {

    const direction =
        destination > start
            ? 1
            : -1;


    const total =
        Math.abs(
            destination - start
        );


    let current =
        start;

    let count =
        0;


    const timer =
        setInterval(
            () => {

                count++;

                current +=
                    direction;

                player.position =
                    current;

                updateTokens();


                message.textContent =
                    `🐍 ${player.name} is sliding... ${current}`;


                if (
                    count >= total
                ) {

                    clearInterval(
                        timer
                    );


                    player.position =
                        destination;

                    updateTokens();


                    message.textContent =
                        `🐍 Snake! ${start} → ${destination}`;


                    setTimeout(
                        checkWinner,
                        700
                    );

                }

            },
            100
        );

}


/* =====================================================
   WINNER
===================================================== */

function checkWinner() {

    const player =
        players[currentPlayer];


    if (
        player.position === 100
    ) {

        gameOver = true;

        isMoving = false;

        message.textContent =
            `🎉 ${player.name} WINS!`;

        turn.textContent =
            `${player.name} Wins!`;

        rollButton.disabled =
            true;


        const cell =
            getCell(100);


        if (cell) {

            const token =
                cell.querySelector(
                    ".token"
                );


            if (token) {

                token.classList.add(
                    "winner"
                );

            }

        }


        return;

    }


    nextTurn();

}


/* =====================================================
   NEXT TURN
===================================================== */

function nextTurn() {

    setTimeout(
        () => {

            currentPlayer++;


            if (
                currentPlayer >=
                players.length
            ) {

                currentPlayer = 0;

            }


            const player =
                players[currentPlayer];


            turn.textContent =
                `${player.name}'s Turn`;


            message.textContent =
                `${player.name}, roll the D8!`;


            isMoving = false;

            rollButton.disabled =
                false;

        },
        600
    );

}


/* =====================================================
   DATE & TIME
===================================================== */

function updateDateTime() {

    const now =
        new Date();


    currentDate.textContent =
        now.toLocaleDateString(
            "en-PH",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    currentTime.textContent =
        now.toLocaleTimeString(
            "en-PH",
            {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );

}


/* =====================================================
   EVENTS
===================================================== */

rollButton.addEventListener(
    "click",
    rollDice
);


restartButton.addEventListener(
    "click",
    createPlayers
);


newGameButton.addEventListener(
    "click",
    createPlayers
);


playerCount.addEventListener(
    "change",
    createPlayers
);


/* =====================================================
   START GAME
===================================================== */

createBoard();

createPlayers();

updateDateTime();

setInterval(
    updateDateTime,
    1000
);