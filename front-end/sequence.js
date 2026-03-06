
class Cell {
    constructor() {
        this.number = Math.floor( Math.random() * 9) + 1; // generate random integer between 1 and 9
        this.moveDirection = null;
        this.obstructed = false;
    }
}

class Grid {
    constructor(rows, columns, obstacleCount) {
        this.grid = this.initializeGrid(rows, columns);
        this.spawnObstacles(obstacleCount); // may add an obstacleChance -> obstacleCount step.

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

    spawnObstacles(obstacleCount) {
        for (let i = 0; i < obstacleCount; i++) {
            let cellIndex;
            let isObstructed;
            do {
                cellIndex = this.randomCellIndex();
                isObstructed = this.grid[cellIndex.row][cellIndex.column].obstructed;
            } while (isObstructed);
            
            this.grid[cellIndex.row][cellIndex.column].obstructed = true;
        }
    }

    randomCellIndex() {
        return {
            row: Math.floor( Math.random() * this.grid.length),
            column: Math.floor( Math.random() * this.grid[0].length)
        }
    }

    printCells() {

        for (let i = 0; i < this.grid.length; i++) {
            let rowString = "";
            for (let j = 0; j < this.grid[i].length; j++) {
                let number = this.grid[i][j].number;
                if (this.grid[i][j].obstructed) {
                    number = "X";
                }
                rowString += `${number}  `;
            }
            console.log(`${rowString}\n`);
        }
    }
}