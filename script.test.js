const { Ship, Gameboard, Player } = require('./script.js')

describe("Ship", () => {
    let ship;
    
    beforeEach(() => {
      ship = new Ship(3);
    });
  
    test("Hits are recorded", () => {
      ship.hit();
      expect(ship.hits).toBe(1);
    });
  
    test("Is sunk when hits equal length", () => {
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });
  
    test("Is not sunk when hits are less than length", () => {
      ship.hit();
      expect(ship.isSunk()).toBe(false);
    });
});

describe("Gameboard", () => {  
    const board = new Gameboard();
    const ship1 = new Ship(4, "horizontal");
    const ship2 = new Ship(4, "vertical");

    board.placeShip(2, 3, ship1);
    board.placeShip(4, 9, ship2);

    test("Try to place ships next to or on other ships", () => {
        expect(board.isValidPlacement(2, 6, 4, 'horizontal')).toBe(false);
        expect(board.isValidPlacement(1, 2, 4, 'horizontal')).toBe(false);
        expect(board.isValidPlacement(3, 7, 4, 'horizontal')).toBe(false);
    });

    test("Try to place ships that will clip off the board", () => {
        expect(board.isValidPlacement(9, 8, 4, 'horizontal')).toBe(false);
        expect(board.isValidPlacement(8, 0, 4, 'vertical')).toBe(false);
    });

    test("Has gameboard 2d array", () => {
        expect(board.grid).toEqual([
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null]
        ]);
    });
  
    test("Receives a hit while no ship there (miss)", () => {
        board.receiveAttack(5, 6);
        expect(board.grid).toEqual([
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, 'miss', null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null]
        ]);
    });

    test("Receives a hit on ships horizontal tail (hit)", () => {
        board.receiveAttack(2, 5);
        expect(board.grid).toEqual([
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, 'hit', null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, 'miss', null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null]
        ]);
    });

    test("Receives a hit on ships vertical tail (hit)", () => {
        board.receiveAttack(6, 9);
        expect(board.grid).toEqual([
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, 'hit', null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, 'miss', null, null, null],
            [null, null, null, null, null, null, null, null, null, 'hit'],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null]
        ]);
    });

    test("Reports all ships sunk", () => {
        //First sink ship 1
        ship1.hit();
        ship1.hit();
        ship1.hit();
        ship1.hit();
        expect(board.allSunk()).toBe(false);
        //Then ship 2 and they are all suck
        ship2.hit();
        ship2.hit();
        ship2.hit();
        ship2.hit();
        expect(board.allSunk()).toBe(false);
    });

    test("Check if gameboard didn't expand", () => {
        expect(board.grid.flat().length).toBe(100);
    });
});

describe("Player", () => {
    let player;

    const positions = [
        { y: 0, x: 0, orientation: "horizontal" }, // Carrier
        { y: 2, x: 2, orientation: "vertical" },   // Battleship
        { y: 3, x: 4, orientation: "horizontal" }, // Cruiser
        { y: 7, x: 5, orientation: "vertical" },   // Submarine
        { y: 4, x: 8, orientation: "horizontal" }  // Destroyer
    ];

    beforeEach(() => {
        player = new Player("Joe", false);
        player.placeShips(positions);
    });

    test("Player should have a name", () => {
        expect(player.name).toBe("Joe");
    });

    test("Player gameboard should be initialized with 5 ships", () => {
        expect(player.gameboard.ships.length).toBe(5);  
    });

    test("Player should make a move and receive a hit or miss", () => {
        const result = player.makeMove(0, 0);
        expect(result).toBe("Hit!");
    });

    test("Player should be able to sink a ship", () => {
        player.makeMove(8, 4);
        player.makeMove(8, 5);
        expect(player.gameboard.allSunk()).toBe(false);
        const result = player.gameboard.receiveAttack(4, 9); 
        expect(result).toBe("Hit and sunk!");
    });
});