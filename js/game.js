var WALL = 'WALL';
var FLOOR = 'FLOOR';
var SYRING = 'SYRING';
var GAMER = 'GAMER';
var GLUE = 'GLUE';
var GLUED_GAMER = 'GLUED GAMER';
var SKULL = 'SKULL';
var GAMER_IMG = '<img src="img/gamer-purple.png" style="width:1.5em" />';
var SYRING_IMG = '💉';
var GLUE_IMG = '<img src="img/covid.png" style="width:1.5em" />';
var GLUED_GAMER_IMG = '<img src="img/gamer.png" style="width:1.5em" />';
var SKULL_IMG = '☠️';


var gBoard;
var gGamerPos;
var gSyringsInterval = null;
var gGluesInterval = null;
var gSkullInterval = null;
var gCollectedCounter = 0;
var gIsOnHold = false;

function initGame() {
    document.querySelector('.reset-btn').hidden = true;
    document.querySelector('.victory').hidden = true;
    document.querySelector('.dead').hidden = true;
    gIsOnHold = false;
    gGamerPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    renderCollectedCounter(gCollectedCounter);
    renderBoard(gBoard);
    addNewSyring();
    addGlues();
    addSkull();
}


function buildBoard() {
    // Create the Matrix
    // var board = createMat(10, 12)
    var board = new Array(10);
    for (var i = 0; i < board.length; i++) {
        board[i] = new Array(12);
    }

    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = {
                type: FLOOR,
                gameElement: null
            };

            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }
            // Adds passages in wall
            if (i === 0 && j === 5) cell.type = FLOOR;
            if (i === (board.length - 1) && j === 5) cell.type = FLOOR;
            if (i === 5 && j === 0) cell.type = FLOOR;
            if (i === 5 && j === (board[i].length - 1)) cell.type = FLOOR;

            // Add created cell to The game board
            board[i][j] = cell;
        }
    }

    // Place the gamer at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    // Place the Syrings (currently randomly chosen positions)
    board[3][8].gameElement = SYRING;
    board[7][4].gameElement = SYRING;
    board[1][2].gameElement = SYRING;
    board[6][6].gameElement = SYRING;

    return board;
}

// Adds a new GLUE to a random empty cell
function addGlues() {
    gGluesInterval = setInterval(function() {
        var randI = getRandomInt(0, gBoard.length);
        var randJ = getRandomInt(0, gBoard[0].length);
        var newGlueCell = gBoard[randI][randJ];
        if (newGlueCell.gameElement === null && newGlueCell.type === FLOOR) {
            newGlueCell.gameElement = GLUE;
            renderCell({ i: randI, j: randJ }, GLUE_IMG);

            setTimeout(function() {
                if (newGlueCell.gameElement === 'GLUE') {
                    newGlueCell.gameElement = null;
                    renderCell({ i: randI, j: randJ }, '');
                }
            }, 2000);
        }
    }, 500);
}

// Adds a new SKULL to a random empty cell
function addSkull() {

    gSkullInterval = setInterval(function() {
        var randI = getRandomInt(0, gBoard.length);
        var randJ = getRandomInt(0, gBoard[0].length);
        var newSkullCell = gBoard[randI][randJ];
        if (newSkullCell.gameElement === null && newSkullCell.type === FLOOR) {
            newSkullCell.gameElement = SKULL;
            renderCell({ i: randI, j: randJ }, '☠️');

            setTimeout(function() {
                if (newSkullCell.gameElement === 'SKULL') {
                    newSkullCell.gameElement = null;
                    renderCell({ i: randI, j: randJ }, '');
                }
            }, 3000);
        }
    }, 2000);
}
// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            cellClass += (currCell.type === WALL) ? ' wall' : ' floor';

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo('${i}','${j}')" >\n`;

            strHTML += (currCell.gameElement) ? (currCell.gameElement === GAMER) ? GAMER_IMG : SYRING_IMG : '';

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    // console.log('strHTML is:');
    // console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Handle passages moves
function handlePassages(i, j) {
    if (i === -1) {
        gGamerPos.i = gBoard.length - 1;
        gGamerPos.j = j;
        gBoard[i + 1][j].gameElement = null;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        renderCell({ i: i + 1, j: j }, '');
        renderCell({ i: gGamerPos.i, j: gGamerPos.j }, GAMER_IMG);
        return true;
    } else if (i === gBoard.length) {
        gGamerPos.i = 0;
        gGamerPos.j = j;
        gBoard[i - 1][j].gameElement = null;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        renderCell({ i: i - 1, j: j }, '');
        renderCell({ i: gGamerPos.i, j: gGamerPos.j }, GAMER_IMG);
        return true;
    } else if (j === -1) {
        gGamerPos.j = gBoard[0].length - 1;
        gGamerPos.i = i;
        gBoard[i][j + 1].gameElement = null;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        renderCell({ i: i, j: j + 1 }, '');
        renderCell({ i: gGamerPos.i, j: gGamerPos.j }, GAMER_IMG);
        return true;
    } else if (j === gBoard[0].length) {
        gGamerPos.j = 0;
        gGamerPos.i = i;
        gBoard[i][j - 1].gameElement = null;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        renderCell({ i: i, j: j - 1 }, '');
        renderCell({ i: gGamerPos.i, j: gGamerPos.j }, GAMER_IMG);
        return true;
    } else return false;
}

// Move the player to a specific location
function moveTo(i, j) {
    if (gIsOnHold) return;

    var isPassage = handlePassages(i, j);
    if (isPassage) return;

    var targetCell = gBoard[i][j];
    if (targetCell.type === WALL) return;


    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

        if (targetCell.gameElement === SYRING) {
            new Audio('sounds/collect.mp3').play();
            gCollectedCounter++;
            renderCollectedCounter(gCollectedCounter);
        }


        // Game over if steps on skull
        if (targetCell.gameElement === SKULL) {
            gIsOnHold = true;
            clearInterval(gSyringsInterval);
            clearInterval(gGluesInterval);
            clearInterval(gSkullInterval);
            gCollectedCounter = 0;
            document.querySelector('.reset-btn').hidden = false;
            var dead = document.querySelector('.dead');
            dead.hidden = false;
        }

        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');


        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;

        // Hold player if steps on glue
        if (targetCell.gameElement === GLUE) {
            gBoard[gGamerPos.i][gGamerPos.j].gameElement = GLUED_GAMER;
            renderCell(gGamerPos, GLUED_GAMER_IMG);
            gIsOnHold = true;
            setTimeout(function() {
                gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
                renderCell(gGamerPos, GAMER_IMG);
                gIsOnHold = false;
            }, 1500);
            if (gCollectedCounter === 0) {
                gCollectedCounter === 0;
            } else {
                gCollectedCounter--;
                renderCollectedCounter(gCollectedCounter);
            }

            return;
        }

        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);
        handleGameEnd();

    } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// check if there are any Syrings left at the game board
function handleGameEnd() {
    // for (var i = 1; i < gBoard.length - 1; i++) {
    //     for (var j = 1; j < gBoard[0].length - 1; j++) {
    //         var cell = gBoard[i][j];
    //         if (cell.gameElement === 'SYRING') return;
    //     }
    // }
    if (gCollectedCounter === 20) {
        new Audio('sounds/win.mp3').play();
        clearInterval(gSyringsInterval);
        clearInterval(gGluesInterval);
        clearInterval(gSkullInterval);
        gIsOnHold = true;
        gCollectedCounter = 0;
        document.querySelector('.reset-btn').hidden = false;
        document.querySelector('.victory').hidden = false;
    }
}

// renders the new collected Syrings counter
function renderCollectedCounter(num) {
    var elCounter = document.querySelector('.collected');
    elCounter.innerText = num;
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Adds a new Syring to a random empty cell
function addNewSyring() {
    gSyringsInterval = setInterval(function() {
        var randI = getRandomInt(0, gBoard.length);
        var randJ = getRandomInt(0, gBoard[0].length);
        var newSyringCell = gBoard[randI][randJ];
        if (newSyringCell.gameElement === null && newSyringCell.type === FLOOR) {
            newSyringCell.gameElement = SYRING;
            renderCell({ i: randI, j: randJ }, SYRING_IMG);
        }
    }, 1000);
}

// Move the player by keyboard arrows
function handleKey(event) {
    if (gIsOnHold) return;

    var i = gGamerPos.i;
    var j = gGamerPos.j;

    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}