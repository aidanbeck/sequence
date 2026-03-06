class Operators {
    constructor(operators = ['+', '*', '/'], startingScore = 0) {

        this.operators = operators;

        this.selectedOperatorIndex = 0;
        this.selectedOperator = this.operators[this.selectedOperatorIndex];

        this.score = startingScore;
        this.scoreHistory = [];
    }

    operate(score, cell, symbol) {
        switch (this.symbol) {
            case '+':
                return score + cell.number;
            case '-':
                return score - cell.number;
            case '*':
                return score * cell.number;
            case '/':
                return score / cell.number;
        }
    }
    
}

class Cell {
    constructor() {
        this.number = Math.floor( Math.random() * 9) + 1; // generate random integer between 1 and 9
        this.moveDirection = null;
        this.obstructed = false;
    }
}

class Grid {
    constructor(rows, columns, obstacleCount = Math.floor( Math.random() * 4)) {
        this.grid = this.initializeGrid(rows, columns);
        this.spawnObstacles(obstacleCount); // may add an obstacleChance -> obstacleCount step.
        this.startIndex = this.spawnStartIndex();
        this.endIndex = this.spawnEndIndex();

        this.selectedIndex = {
            row: this.startIndex.row,
            column: this.startIndex.column
        }

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
            do {
                cellIndex = this.randomCellIndex();
            } while (this.isObstructed(cellIndex.row, cellIndex.column));

            this.grid[cellIndex.row][cellIndex.column].obstructed = true;
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

        let endIndex;
        let startEndDistance;
        do {
            endIndex = this.randomCellIndex();

            startEndDistance = Math.sqrt( 
                Math.pow(
                    endIndex.row - this.startIndex.row, 2) + Math.pow(endIndex.column - this.startIndex.column,
                    2
                )
            );

        } while (this.isObstructed(endIndex.row, endIndex.column) || startEndDistance < MAX_DISTANCE);
    
        return endIndex;
    }

    isObstructed(row, column) {
        return this.grid[row][column].obstructed;
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

                // should be switch case
                if (this.grid[i][j].obstructed) {
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