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
      this.positionMap = {};
      this.ships = []
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
    }

    placeShips(positions) {
        this.ships.forEach((ship, index) => {
            const pos = positions[index];
            ship.orientation = pos.orientation;
            this.gameboard.placeShip(pos.y, pos.x, ship);
        });
    }

    makeMove(x, y) {
        // For human players, x and y would come from user input
        // For AI, generate x and y based on some logic
        return this.gameboard.receiveAttack(y, x);
    }
}

const playComputerGame = () => {
    screen.innerHTML = 
        `<div class="wrapper">
            <h1>Place Your Ships</h1>
            <div id="placementBoard" class="board"></div>
            <div class="space-between">
                <button onclick="rotateShip()">Rotate</button>
                <div>
                    <button onclick="resetPlacement()">Reset</button>
                    <button onclick="resetPlacement()">Continue</button>
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
}

const screen = document.querySelector('.screen')

let currentShipSize = 5; 
let currentOrientation = 'horizontal';

const positions = [
    { y: 0, x: 0, orientation: "horizontal" }
];
const placementBoard = [];

const rotateShip = () => currentOrientation === 'horizontal' ? currentOrientation = 'vertical' : currentOrientation = 'horizontal'
const resetPlacement = () => {
    positions.splice(0, positions.length)
    placementBoard.splice(0, placementBoard.length)
    clearHover()
}


function placeShip(startIndex) {
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
    if (!validatePlacement(startIndex)) {
      updateHoverEffect(startIndex, false);
    } else {
      updateHoverEffect(startIndex, true);
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

playComputerGame();

module.exports = { Ship, Gameboard, Player }