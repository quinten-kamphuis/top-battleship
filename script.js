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

module.exports = { Ship, Gameboard, Player }