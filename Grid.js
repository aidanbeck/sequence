import Randomizer from './Randomizer.js';

class Cell {
    constructor() {
        this.obstructed = false;
    }
    randomize(random) {
        this.number = Math.floor( random() * 9) + 1; // generate random integer between 1 and 9
    }
    flip() {
        this.number = -this.number;
    }
    makeBig() {
        this.number += 11;
    }
    zero() {
        this.number = 0;
    }

}

export default class Grid {
    constructor(rows, columns, obstacleCount = Math.floor( this.random() * 4), seed = 0) {

        // RNG
        const dailyRandomizer = new Randomizer( seed );
        this.seed = seed; // for ui to read, might remove
        this.random = dailyRandomizer.getNumber;

        // Generation
        this.cells = this.initializeCells(rows, columns);
        this.spawnObstacles(obstacleCount); // may add an obstacleChance -> obstacleCount step.
        this.blockObstructedCells();

        // Indexes
        this.startIndex = this.spawnStartIndex();
        this.endIndex = this.spawnEndIndex();
        // set startIndex to 0
        this.cells[this.startIndex.row][this.startIndex.column].number = 0;

        // Rare Alterations
        let spawnZero = this.getRandomPercentage() < 15;
        let spawnBigNumber = this.getRandomPercentage() < 15;
        let spawnNegatives = this.getRandomPercentage() < 15;
        
        // !!! the logic is sound, but negative and double digit numbers don't display properly
        // spawnZero && this.getRandomCell().zero();
        spawnBigNumber && this.getRandomCell().makeBig();
        spawnNegatives && this.getRandomCell().flip();
        spawnNegatives && this.getRandomCell().flip();
    }

    getRandomPercentage() {
        return Math.floor( this.random() * 101 );
    }

    initializeCells(rows, columns) {
        let cells = [];
        for (let i = 0; i < columns; i++) {
            cells[i] = [];
            for (let j = 0; j < rows; j++) {
                const cell = new Cell();
                cell.randomize(this.random);
                cells[i][j] = cell;
            }
        }
        return cells;
    }

    spawnObstacles(obstacleCount) {
        for (let i = 0; i < obstacleCount; i++) {
            let cell;
            do {
                cell = this.getRandomCell();
            } while (cell.obstructed);

            cell.obstructed = true;
        }
    }

    spawnStartIndex() {

        let startIndex;
        do {
            startIndex = this.getRandomIndex();
        } while (this.isObstructed(startIndex.row, startIndex.column));

        return startIndex;
    }

    spawnEndIndex() {

        const MAX_DISTANCE = 2;

        let startIndex = this.startIndex;
        let endIndex;
        let startEndDistance;
        do {
            endIndex = this.getRandomIndex();

            startEndDistance = Math.sqrt( 
                Math.pow(
                    endIndex.row - startIndex.row, 2) + Math.pow(endIndex.column - startIndex.column,
                    2
                )
            );

        } while (this.isObstructed(endIndex.row, endIndex.column) || startEndDistance < MAX_DISTANCE);
    
        return endIndex;
    }

    getRandomIndex() {
        return {
            row: Math.floor( this.random() * this.cells.length),
            column: Math.floor( this.random() * this.cells[0].length)
        }
    }

    getCell(row, column) {
        return this.cells[row][column];
    }

    getRandomCell() {
        const randomIndex = this.getRandomIndex();
        return this.getCell(randomIndex.row, randomIndex.column)
    }

    isObstructed(row, column) {
        return this.getCell(row, column).obstructed;
    }

    isSpaceFree(row, column) {

        // Out of Bounds
        if (row < 0 || column < 0 || row >= this.cells.length || column >= this.cells[0].length) {
            return false;
        }

        // Obstructed
        return !this.isObstructed(row, column);
    }

    countAdjacentFreeSpaces(row, column) {

        let freeSpacesCount = 0;

        this.isSpaceFree(row - 1, column) && freeSpacesCount++;
        this.isSpaceFree(row + 1, column) && freeSpacesCount++;
        this.isSpaceFree(row, column - 1) && freeSpacesCount++;
        this.isSpaceFree(row, column + 1) && freeSpacesCount++;

        return freeSpacesCount;
    }

    blockObstructedCells() {

        for (let row = 0; row < this.cells.length; row++) {
            for (let column = 0; column < this.cells[0].length; column++) {
                const adjacentFreeSpacesCount = this.countAdjacentFreeSpaces(row, column);
                if (adjacentFreeSpacesCount < 2) {
                    this.getCell(row, column).obstructed = true;
                }
            }
        }

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