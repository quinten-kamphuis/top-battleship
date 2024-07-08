const placeholderMap = {
    "2,2": {
        "length": 5,
        "orientation": "horizontal",
        "hits": 0
    },
    "2,3": {
        "length": 5,
        "orientation": "horizontal",
        "hits": 0
    },
    "2,4": {
        "length": 5,
        "orientation": "horizontal",
        "hits": 0
    },
    "2,5": {
        "length": 5,
        "orientation": "horizontal",
        "hits": 0
    },
    "2,6": {
        "length": 5,
        "orientation": "horizontal",
        "hits": 0
    },
    "7,1": {
        "length": 4,
        "orientation": "horizontal",
        "hits": 0
    },
    "7,2": {
        "length": 4,
        "orientation": "horizontal",
        "hits": 0
    },
    "7,3": {
        "length": 4,
        "orientation": "horizontal",
        "hits": 0
    },
    "7,4": {
        "length": 4,
        "orientation": "horizontal",
        "hits": 0
    },
    "5,6": {
        "length": 3,
        "orientation": "horizontal",
        "hits": 0
    },
    "5,7": {
        "length": 3,
        "orientation": "horizontal",
        "hits": 0
    },
    "5,8": {
        "length": 3,
        "orientation": "horizontal",
        "hits": 0
    },
    "5,2": {
        "length": 3,
        "orientation": "horizontal",
        "hits": 0
    },
    "5,3": {
        "length": 3,
        "orientation": "horizontal",
        "hits": 0
    },
    "5,4": {
        "length": 3,
        "orientation": "horizontal",
        "hits": 0
    },
    "8,7": {
        "length": 2,
        "orientation": "horizontal",
        "hits": 0
    },
    "8,8": {
        "length": 2,
        "orientation": "horizontal",
        "hits": 0
    }
}

const placeholderShips = [
    {
        "length": 5,
        "orientation": "horizontal",
        "hits": 0
    },
    {
        "length": 4,
        "orientation": "horizontal",
        "hits": 0
    },
    {
        "length": 3,
        "orientation": "horizontal",
        "hits": 0
    },
    {
        "length": 3,
        "orientation": "horizontal",
        "hits": 0
    },
    {
        "length": 2,
        "orientation": "horizontal",
        "hits": 0
    }
]

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
        this.grid = create2DArray(10);
        this.positionMap = placeholderMap
        this.ships = placeholderShips
    }

    placeShip(y, x, ship) {
        const length = ship.length;
        const orientation = ship.orientation;
        if (this.isValidPlacement(y, x, length, orientation)) {
            for (let i = 0; i < ship.length; i++) {
                let posY = orientation === "vertical" ? y + i : y;
                let posX = orientation === "horizontal" ? x + i : x;
                this.positionMap[`${posY},${posX}`] = ship;
            }
            this.ships.push(ship)
        } else {
            this.positionMap = {}
            this.ships = []
            console.log('Invalid ship placement, ships did not place');
        }
    }

    isValidPlacement(y, x, length, orientation) {
        const directions = [-1, 0, 1];
        
        for (let i = 0; i < length; i++) {
            let currentX = orientation === "horizontal" ? x + i : x;
            let currentY = orientation === "vertical" ? y + i : y;

            if (currentY > 9 || currentX > 9) return false;
    
            for (let dy of directions) {
                for (let dx of directions) {
                    let checkY = currentY + dy;
                    let checkX = currentX + dx;
                    let key = `${checkY},${checkX}`;
                    if (this.positionMap[key]) {
                        return false;
                    }
                }
            }
        }    
        return true
    }

    receiveAttack(y, x) {
        const key = `${y},${x}`;
        if (this.positionMap[key]) {
            this.positionMap[key].hit();
            this.grid[y][x] = 'hit';
            if (this.positionMap[key].isSunk()) {
                return "Hit and sunk!";
            } else {
                return "Hit!";
            }
        } else {
            this.grid[y][x] = 'miss';
            return "Miss!";
        }
    }

    allSunk() {
        let shipsNotSunk = 0;
        Object.values(this.positionMap).forEach(ship => {
            if (!ship.isSunk()){
                shipsNotSunk++;
            }
        });
        if (shipsNotSunk) {
            return false
        }
        return true
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
        this.currentShipIndex = 0;
    }

    placeShips(positions) {
        this.gameboard.positionMap = {}
        this.gameboard.ships = []
        this.ships.forEach((ship, index) => {
            const pos = positions[index];
            ship.orientation = pos.orientation;
            this.gameboard.placeShip(pos.y, pos.x, ship);
        });
        if (this.gameboard.ships.length !== 0) return true
        if (this.gameboard.ships.length === 0) return false
    }

    makeMove(y, x) {
        // For human players, x and y would come from user input
        // For AI, generate x and y based on some logic
        return this.gameboard.receiveAttack(y, x);
    }
}

const screen = document.querySelector('.screen')

const startGame = () => {
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
        cell.addEventListener('click', () => placeShip(i));
        if (placementBoard[index] !== 'ship') {
            cell.style.backgroundColor = null; 
        }
        playerBoard.appendChild(cell);
    }
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.classList.add('clickable');
        cell.dataset.index = i;
        cell.addEventListener('click', () => placeShip(i));
        opponentBoard.appendChild(cell);
    }
}

let player1;
let player2;

const playComputerGame = () => {
    if (!player1 || !player2) {
        player1 = new Player("Player 1")
        player2 = new Player("Computer")
    }
    if (player1.gameboard.ships.length !== 5){
        currentPlayer = player1
        loadPlacement()
    } else if (player2.gameboard.ships.length !== 5) {
        currentPlayer = player2
        loadPlacement()
    } else if (player1.gameboard.ships.length === 5 && player2.gameboard.ships.length === 5) {
        startGame()
    }
}

playComputerGame()

const loadPlacement = () => {

    setTimeout(() => updateShipSize(), 0)

    screen.innerHTML = 
        `<div class="wrapper">
            <h1>${currentPlayer.name}, Place Your Ships</h1>
            <div id="placementBoard" class="board"></div>
            <div class="space-between">
                <button onclick="rotateShip()">Rotate</button>
                <div>
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

const setPlacement = () => {
    if (currentPlayer.placeShips(positions)) {
        console.log('Ships placed')
        playComputerGame()
    } else {
        console.warn('Something went wrong, ships did not place')
    }
}

let currentShipSize = 5; 
let currentOrientation = 'horizontal';
let currentPlayer;

const positions = [];
const placementBoard = [];

const updateShipSize = () => {
    document.querySelector(".finish-placement").classList.add('disabled')
    if (positions.length < 4) {
        currentShipSize = 5 - positions.length
    } else if (positions.length === 4){
        currentShipSize = 2
    } else if (positions.length === 5){
        currentShipSize = 0
        document.querySelector(".finish-placement").classList.remove('disabled')
    }
}

const rotateShip = () => currentOrientation === 'horizontal' ? currentOrientation = 'vertical' : currentOrientation = 'horizontal'
const resetPlacement = () => {
    positions.splice(0, positions.length)
    placementBoard.splice(0, placementBoard.length)
    updateShipSize()
    clearHover()
}

function placeShip(startIndex) {
    if (positions.length > 4) return
    if (validatePlacement(startIndex)) {
      let shipDetails = { orientation: currentOrientation }; 
      for (let i = 0; i < currentShipSize; i++) {
        const index = currentOrientation === 'horizontal' ? startIndex + i : startIndex + 10 * i;
        if (index < 100) {
            placementBoard[index] = 'ship'; 
            document.querySelectorAll('.cell')[index].style.backgroundColor = '#00bfff'; 
            if (i === 0) { 
                shipDetails.y = Math.floor(index / 10);
                shipDetails.x = index % 10;
            }
        }
      }
      positions.push(shipDetails); 
      updateShipSize(5 - positions.length)
    } else {
      console.log("Invalid placement. Try again.");
    }
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
        if (adjIndex < 0 || adjIndex >= 100) continue; 
        if (Math.abs(adjIndex % 10 - index % 10) > 1) continue; 
        if (placementBoard[adjIndex] === 'ship') return false; 
    }
    return true;
}

function hoverShip(startIndex) {
    clearHover();
    if (positions.length < 5) {
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
      const index = parseInt(cell.dataset.index);
      if (placementBoard[index] !== 'ship') {
        cell.style.backgroundColor = null; 
      } else {
        cell.style.backgroundColor = '#00bfff'; 
      }
    });
}

module.exports = { Ship, Gameboard, Player }