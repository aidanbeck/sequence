
class Cell {
    constructor() {
        this.number = Math.floor( Math.random() * 9) + 1; // generate random integer between 1 and 9
        this.moveDirection = null;
        this.obstructed = false;
    }
}

class Grid {
    constructor(rows, columns) {
        this.grid = initializeGrid(rows, columns);

        // let obstacles = 2; // number of obstacles to generate
        // generateObstacles(obstacles);

        // this.start = randomCell();
        // this.end = randomCell();

        this.printCells();
    }

    initializeGrid(rows, columns) {
        let grid = [];
        for (let i = 0; i < columns; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                grid[i][j] = new Cell();
            }
        }
        return grid;
    }

    printCells() {

        for (let i = 0; i < this.grid.length; i++) {
            let rowString = "";
            for (let j = 0; j < this.grid[i].length; j++) {
                let number = this.grid[i][j].number;
                rowString += `${number}  `;
            }
            console.log(`${rowString}\n`);
        }
    }
}