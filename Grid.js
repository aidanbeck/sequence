import Randomizer from './Randomizer.js';

class Cell {
    constructor(number) {
        this.number = number;
        this.obstructed = false;
    }
}

export default class Grid {
    constructor(rows, columns, obstacleCount = Math.floor( this.random() * 4), seed = 0) {

        // RNG
        const dailyRandomizer = new Randomizer( seed );
        this.random = dailyRandomizer.getNumber;

        // Generation
        this.cells = this.initializeCells(rows, columns);
        this.spawnObstacles(obstacleCount); // may add an obstacleChance -> obstacleCount step.

        // Indexes
        this.startIndex = this.spawnStartIndex();
        this.endIndex = this.spawnEndIndex();


    }

    initializeCells(rows, columns) {
        let cells = [];
        for (let i = 0; i < columns; i++) {
            cells[i] = [];
            for (let j = 0; j < rows; j++) {
                let randomNumber = Math.floor( this.random() * 9) + 1; // generate random integer between 1 and 9
                cells[i][j] = new Cell(randomNumber);
            }
        }
        return cells;
    }

    spawnObstacles(obstacleCount) {
        for (let i = 0; i < obstacleCount; i++) {
            let cellIndex;
            do {
                cellIndex = this.randomCellIndex();
            } while (this.isObstructed(cellIndex.row, cellIndex.column));

            this.cells[cellIndex.row][cellIndex.column].obstructed = true;
        }
    }

    spawnStartIndex() {

        let startIndex;
        do {
            startIndex = this.randomCellIndex();
        } while (this.isObstructed(startIndex.row, startIndex.column));

        return startIndex;
    }

    spawnEndIndex() {

        const MAX_DISTANCE = 2;

        let startIndex = this.startIndex;
        let endIndex;
        let startEndDistance;
        do {
            endIndex = this.randomCellIndex();

            startEndDistance = Math.sqrt( 
                Math.pow(
                    endIndex.row - startIndex.row, 2) + Math.pow(endIndex.column - startIndex.column,
                    2
                )
            );

        } while (this.isObstructed(endIndex.row, endIndex.column) || startEndDistance < MAX_DISTANCE);
    
        return endIndex;
    }

    randomCellIndex() {
        return {
            row: Math.floor( this.random() * this.cells.length),
            column: Math.floor( this.random() * this.cells[0].length)
        }
    }

    getCell(row, column) {
        return this.cells[row][column];
    }

    isObstructed(row, column) {
        return this.getCell(row, column).obstructed;
    }

    printCells() {

        let cells = this.cells;

        for (let i = 0; i < cells.length; i++) {
            let rowString = "";
            for (let j = 0; j < cells[i].length; j++) {
                let number = cells[i][j].number;

                // should be switch case
                if (cells[i][j].obstructed) {
                    number = "X";
                }
                if (i === this.startIndex.row && j === this.startIndex.column) {
                    number = ".";
                }
                if (i === this.endIndex.row && j === this.endIndex.column) {
                    number = "?";
                }

                rowString += `${number}  `;
            }
            console.log(`${rowString}\n`);
        }
    }
}