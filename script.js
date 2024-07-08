const create2DArray = (size, initialValue = null) => {
    let array = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(initialValue);
      }
      array.push(row);
    }
    return array;
}

const indexToLocation = (index) => ({ y: Math.floor(index / 10), x: index % 10 });

class Ship {
    constructor(length, orientation = null) {
        this.length = length;
        this.orientation = orientation;
        this.hits = 0;
    }

    hit() {
        this.hits++;
    }

    isSunk() {
        return this.hits === this.length;
    }
}
  

class Gameboard {
    constructor() {
        this.hitsGrid = create2DArray(10);
        this.shipsGrid = create2DArray(10);
    }

    receiveAttack(y, x) {
        if (this.shipsGrid[y][x]) {
            this.shipsGrid[y][x].hit();
            this.hitsGrid[y][x] = 'hit';
            if (this.shipsGrid[y][x].isSunk()) {
                console.log('Hit and sunk')
                return "hit";
            } else {
                return "hit";
            }
        } else {
            this.hitsGrid[y][x] = 'miss';
            return "miss";
        }
    }
}

class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.isComputer = isComputer;
        this.gameboard = new Gameboard();
        this.ships = [
            new Ship(5), // Carrier
            new Ship(4), // Battleship
            new Ship(3), // Cruiser
            new Ship(3), // Submarine
            new Ship(2)  // Destroyer
        ];
    }

    makeMove(y, x) {
        return this.gameboard.receiveAttack(y, x);
    }

    allShipsSunk() {
        let shipsNotSunk = 0;
        this.ships.forEach(ship => ship.isSunk() ? true : shipsNotSunk++)
        if (shipsNotSunk !== 0){
            return false
        }
        return true
    }
}

const screen = document.querySelector('.screen')

const startComputerGame = () => {

    const updateBoard = () => {
        const playerCells = document.querySelectorAll('#playerBoard .cell');
        const opponentCells = document.querySelectorAll('#opponentBoard .cell');
        playerCells.forEach(cell => {
            const { y, x } = indexToLocation(parseInt(cell.dataset.index));
            if (player1.gameboard.hitsGrid[y][x] === 'hit') {
                cell.classList.add('hit'); 
            }
            if (player1.gameboard.hitsGrid[y][x] === 'miss') {
                cell.classList.add('miss'); 
            } 
        });
        opponentCells.forEach(cell => {
            const { y, x } = indexToLocation(parseInt(cell.dataset.index));
            if (player2.gameboard.hitsGrid[y][x] === 'hit') {
                cell.classList.add('hit'); 
            }
            if (player2.gameboard.hitsGrid[y][x] === 'miss') {
                cell.classList.add('miss'); 
            } 
        });
    }

    const getComputerMove = () => {
        const board = player1.gameboard.hitsGrid
        let emptySpots = [];

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null) { 
                    emptySpots.push({ y: i, x: j });
                }
            }
        }
        if (emptySpots.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptySpots.length);
            return emptySpots[randomIndex];
        } else {
            return null;
        }
    }

    const checkWin = () => {
        if (player2.allShipsSunk()){
            screen.innerHTML = 
            `<div class="wrapper">
                <h2>You won!</h2>
                <p>Congrats</p>
                <button onclick="location.reload()">Home</button>
            </div>`;
        }
        if (player1.allShipsSunk()){
            screen.innerHTML = 
            `<div class="wrapper">
                <h2>You lost!</h2>
                <p>Too bad</p>
                <button onclick="location.reload()">Home</button>
            </div>`;
        }
    }

    const makeComputerMove = () => {
        if (player1.makeMove(...Object.values(getComputerMove())) === 'hit'){
            checkWin()
            updateBoard()
            makeComputerMove()
        } else {
            checkWin()
            updateBoard()
        }
    }

    const makeMove = (index) => {
        const { y, x } = indexToLocation(index)
        if(player2.gameboard.hitsGrid[y][x] === null){
            if (player2.makeMove(y, x) === 'hit'){
                updateBoard()
                checkWin()
            } else if (player2.makeMove(y, x) === 'miss') {
                makeComputerMove()
            }
        }
    }

    screen.innerHTML = 
        `<div class="wrapper">
            <h2>You</h2>
            <div id="playerBoard" class="board"></div>
        </div>
        <div class="wrapper">
            <h2>Opponent</h2>
            <div id="opponentBoard" class="board"></div>
        </div>`;

    const playerBoard = screen.querySelector('#playerBoard')
    const opponentBoard = screen.querySelector('#opponentBoard')
    
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        const { y, x } = indexToLocation(i)
        if (player1.gameboard.shipsGrid[y][x] !== null) {
            cell.style.backgroundColor = '#00bfff'; 
        }
        playerBoard.appendChild(cell);
    }
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.classList.add('clickable');
        cell.dataset.index = i;
        cell.addEventListener('click', () => makeMove(i));
        opponentBoard.appendChild(cell);
    }
}

const startPlayerGame = () => {

    const updateBoard = () => {
        const opponent = playerToMove === player1 ? player2 : player1
        const playerCells = document.querySelectorAll('#playerBoard .cell');
        const opponentCells = document.querySelectorAll('#opponentBoard .cell');
        playerCells.forEach(cell => {
            const { y, x } = indexToLocation(parseInt(cell.dataset.index));
            if (playerToMove.gameboard.hitsGrid[y][x] === 'hit') {
                cell.classList.add('hit'); 
            }
            if (playerToMove.gameboard.hitsGrid[y][x] === 'miss') {
                cell.classList.add('miss'); 
            } 
        });
        opponentCells.forEach(cell => {
            const { y, x } = indexToLocation(parseInt(cell.dataset.index));
            if (opponent.gameboard.hitsGrid[y][x] === 'hit') {
                cell.classList.add('hit'); 
            }
            if (opponent.gameboard.hitsGrid[y][x] === 'miss') {
                cell.classList.add('miss'); 
            } 
        });
    }

    screen.innerHTML = 
        `<div class="wrapper">
            <h2>You</h2>
            <div id="playerBoard" class="board"></div>
        </div>
        <div class="wrapper">
            <h2>Opponent</h2>
            <div id="opponentBoard" class="board"></div>
        </div>`;

    const playerBoard = screen.querySelector('#playerBoard')
    const opponentBoard = screen.querySelector('#opponentBoard')
    
    let playerToMove = player1;

    const loadBoards = () => {
        playerBoard.innerHTML = ''
        opponentBoard.innerHTML = ''
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            const { y, x } = indexToLocation(i)
            if (playerToMove.gameboard.shipsGrid[y][x] !== null) {
                cell.style.backgroundColor = '#00bfff'; 
            }
            playerBoard.appendChild(cell);
        }
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add('clickable');
            cell.dataset.index = i;
            cell.addEventListener('click', () => makeMove(i, playerToMove === player1 ? player2 : player1));
            opponentBoard.appendChild(cell);
        }
    }

    loadBoards()

    const checkWin = () => {
        if (player2.allShipsSunk()){
            screen.innerHTML = 
            `<div class="wrapper">
                <h2>${player1.name} won!</h2>
                <p>Congrats</p>
                <button onclick="location.reload()">Home</button>
            </div>`;
        }
        if (player1.allShipsSunk()){
            screen.innerHTML = 
            `<div class="wrapper">
                <h2>${player2.name} won!</h2>
                <p>Congrats</p>
                <button onclick="location.reload()">Home</button>
            </div>`;
        }
    }

    const showOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
    
        const message = document.createElement('h1');
        message.textContent = 'Switch players'
    
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Done';
        closeButton.className = 'button';
        closeButton.onclick = function() {
            document.body.removeChild(overlay);
        };
    
        overlay.appendChild(message);
        overlay.appendChild(closeButton);
        document.body.appendChild(overlay);
    }

    const makeMove = (index, player) => {
        const { y, x } = indexToLocation(index)
        if(player.gameboard.hitsGrid[y][x] === null){
            if (player.makeMove(y, x) === 'hit'){
                loadBoards()
                updateBoard()
                checkWin()
            } else if (player.makeMove(y, x) === 'miss') {
                playerToMove = playerToMove === player1 ? player2 : player1
                showOverlay()
                loadBoards()
                updateBoard()
                checkWin()
            }
        }
        console.log('Player to move: ' + playerToMove.name)
    }
}

let player1;
let player2;
let gameType;

let currentPlayer;
let currentShip = 0; 
let currentShipSize;
let currentOrientation = 'horizontal';

const placementGrid = create2DArray(10);

const setPlacement = () => {
    currentPlayer.gameboard.shipsGrid = placementGrid.map(row => [...row]);
    setTimeout(() => playGame(), 10)
}

const playGame = () => {
    if (gameType === 'computer'){
        playComputerGame()
    } else if (gameType === 'player'){
        playPlayerGame()
    } else {
        console.error('Invalid game type')
    }
}

const rotateShip = () => currentOrientation === 'horizontal' ? currentOrientation = 'vertical' : currentOrientation = 'horizontal'
const resetPlacement = () => {
    placementGrid.forEach((row, rowIndex) => {row.forEach((element, colIndex) => {placementGrid[rowIndex][colIndex] = null});});
    currentShip = 0; 
    updateShipSize()
    clearHover()
}

const loadPlacement = () => {

    setTimeout(() => updateShipSize(), 10)

    screen.innerHTML = 
        `<div class="wrapper">
            <h1>${currentPlayer.name}, Place Your Ships</h1>
            <div id="placementBoard" class="board"></div>
            <div class="space-between">
                <button onclick="rotateShip()" class="rotate-ship">Rotate</button>
                <div>
                    <button onclick="randomPlacement()">Random</button>
                    <button onclick="resetPlacement()">Reset</button>
                    <button onclick="setPlacement()" class="finish-placement disabled">Continue</button>
                </div>
            </div>
        </div>`;

    const board = screen.querySelector('#placementBoard')
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('mouseenter', () => hoverShip(i));
        cell.addEventListener('mouseleave', () => clearHover());
        cell.addEventListener('click', () => placeShip(i));
        board.appendChild(cell);
    }
    resetPlacement();
}

const updateShipSize = () => {
    currentShipSize = currentPlayer.ships[currentShip] ? currentPlayer.ships[currentShip].length : 0
    if (currentShip >= 5) {
        document.querySelector(".finish-placement").classList.remove('disabled')
        document.querySelector(".rotate-ship").classList.add('disabled')
    } else {
        document.querySelector(".finish-placement").classList.add('disabled')
        document.querySelector(".rotate-ship").classList.remove('disabled')
    }
}

const playComputerGame = () => {
    gameType = 'computer'
    if (!player1 || !player2) {
        player1 = new Player("Player 1")
        player2 = new Player("Computer")
    }
    if (player1.gameboard.shipsGrid.flat().reduce((acc, val) => acc + (val === null ? 1 : 0), 0) !== 83){
        currentPlayer = player1
        loadPlacement()
    } else if (player2.gameboard.shipsGrid.flat().reduce((acc, val) => acc + (val === null ? 1 : 0), 0) !== 83) {
        currentPlayer = player2
        loadPlacement()
        randomPlacement()
        setPlacement()
    } else if (player1.gameboard.shipsGrid.flat().reduce((acc, val) => acc + (val === null ? 1 : 0), 0) === 83 &&
                player2.gameboard.shipsGrid.flat().reduce((acc, val) => acc + (val === null ? 1 : 0), 0) === 83) {
        startComputerGame()
    }
}

const playPlayerGame = () => {
    gameType = 'player'
    if (!player1 || !player2) {
        player1 = new Player("Player 1")
        player2 = new Player("Player 2")
    }
    if (player1.gameboard.shipsGrid.flat().reduce((acc, val) => acc + (val === null ? 1 : 0), 0) !== 83){
        currentPlayer = player1
        loadPlacement()
    } else if (player2.gameboard.shipsGrid.flat().reduce((acc, val) => acc + (val === null ? 1 : 0), 0) !== 83) {
        currentPlayer = player2
        loadPlacement()
    } else if (player1.gameboard.shipsGrid.flat().reduce((acc, val) => acc + (val === null ? 1 : 0), 0) === 83 &&
                player2.gameboard.shipsGrid.flat().reduce((acc, val) => acc + (val === null ? 1 : 0), 0) === 83) {
        startPlayerGame()
    }
}

function placeShip(startIndex) {
    if (validatePlacement(startIndex)) {
      for (let i = 0; i < currentShipSize; i++) {
        const index = currentOrientation === 'horizontal' ? startIndex + i : startIndex + 10 * i;
        const { y, x } = indexToLocation(index)
        if (index < 100 && currentShip < 5) {
            placementGrid[y][x] = currentPlayer.ships[currentShip]; 
            document.querySelectorAll('.cell')[index].style.backgroundColor = '#00bfff'; 
        }
      }
      currentShip++
      updateShipSize()
    } else {
      console.log("Invalid placement. Try again.");
    }
}

const randomPlacement = () => {
    if (currentShip >= 5) resetPlacement()
    let attempts = 0;
    while (currentShip < 5 && attempts < 100){
        attempts++
        currentOrientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        let index = Math.floor(Math.random() * 100);
        placeShip(index);
    }
    console.log('Finished random in: ' + attempts + ' attempts')
}

function validatePlacement(startIndex) {
    for (let i = 0; i < currentShipSize; i++) {
        const index = currentOrientation === 'horizontal' ? startIndex + i : startIndex + 10 * i;
        if (index < 0 || index >= 100) return false;

        if (currentOrientation === 'horizontal' && Math.floor(startIndex / 10) !== Math.floor(index / 10)) {
            return false; 
        }

        if (currentOrientation === 'vertical' && (index >= 100 || Math.floor(index / 10) !== Math.floor(startIndex / 10) + i)) {
            return false;
        }

        if (!isValidPlacement(index)) {
            return false;
        }
    }
    return true;
}

function isValidPlacement(index) {
    const adjacentIndices = [
        index, index - 1, index + 1,
        index - 9, index - 10, index - 11,
        index + 9, index + 10, index + 11
    ];

    for (let adjIndex of adjacentIndices) {
        const { y, x } = indexToLocation(adjIndex)
        if (adjIndex < 0 || adjIndex >= 100) continue; 
        if (Math.abs(adjIndex % 10 - index % 10) > 1) continue; 
        if (placementGrid[y][x] !== null) return false; 
    }
    return true;
}

function hoverShip(startIndex) {
    clearHover();
    if (currentShip < 5) {
        if (!validatePlacement(startIndex)) {
            updateHoverEffect(startIndex, false);
        } else {
            updateHoverEffect(startIndex, true);
        }
    }
}

function updateHoverEffect(startIndex, isValid) {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < currentShipSize; i++) {
      const index = currentOrientation === 'horizontal' ? 
      Math.floor((startIndex + i) / 10) === Math.floor(startIndex / 10) ? startIndex + i : startIndex
      : startIndex + 10 * i;
      if (index < 100) {
        cells[index].style.backgroundColor = isValid ? '#add8e6' : '#ff6347';
      }
    }
}
  
function clearHover() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      const { y, x } = indexToLocation(parseInt(cell.dataset.index));
      if (placementGrid[y][x] === null) {
        cell.style.backgroundColor = null; 
      } else {
        cell.style.backgroundColor = '#00bfff'; 
      }
    });
}

module.exports = { Ship, Gameboard, Player }