class OperatorQueue {
    constructor(operators = ['+', '*', '/']) {

        this.operators = operators;
        this.selectedIndex = 0;
    }

    getSelectedOperator() {
        return this.operators[this.selectedIndex];
    }

    selectNextOperator() {
        this.selectedIndex++;
        if (this.selectedIndex >= this.operators.length) {
            this.selectedIndex = 0;
        }
    }

    selectOperator(index) {
        this.selectedOperator = index;
    }

    operate(score, number) {

        let symbol = this.getSelectedOperator();

        switch (symbol) {
            case '+':
                return score + number;
            case '-':
                return score - number;
            case '*':
                return score * number;
            case '/':
                return score / number;
        }
    }
    
}

class Cell {
    constructor() {
        this.number = Math.floor( Math.random() * 9) + 1; // generate random integer between 1 and 9
        this.obstructed = false;
    }
}

class Grid {
    constructor(rows, columns, obstacleCount = Math.floor( Math.random() * 4)) {
        
        // Generation
        this.cells = this.initializeCells(rows, columns);
        this.spawnObstacles(obstacleCount); // may add an obstacleChance -> obstacleCount step.

        // Indexes
        this.startIndex = this.spawnStartIndex();
        this.endIndex = this.spawnEndIndex();

        // Visualization
        let table = this.generateTable();
        document.getElementById("grid").appendChild(table);
        // this.printCells();
    }

    initializeCells(rows, columns) {
        let cells = [];
        for (let i = 0; i < columns; i++) {
            cells[i] = [];
            for (let j = 0; j < rows; j++) {
                cells[i][j] = new Cell();
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

    isObstructed(row, column) {
        return this.cells[row][column].obstructed;
    }

    randomCellIndex() {
        return {
            row: Math.floor( Math.random() * this.cells.length),
            column: Math.floor( Math.random() * this.cells[0].length)
        }
    }

    generateTable() {

        let cells = this.cells;
        let tableElement = document.createElement("table");

        for (let i = 0; i < cells.length; i++) {

            let rowElement = document.createElement("tr");

            for (let j = 0; j < cells[i].length; j++) {

                let cellElement = document.createElement("td");
                cellElement.innerText = cells[i][j].number;

                // Obstructed Styling
                if (cells[i][j].obstructed) {
                    cellElement.classList.add("obstructed");
                }
                
                // Starting Square Styling
                if (i === this.startIndex.row && j === this.startIndex.column) {
                    cellElement.classList.add("start");
                }

                //Ending Square Styling
                if (i === this.endIndex.row && j === this.endIndex.column) {
                    cellElement.classList.add("end");
                }
                
                rowElement.appendChild(cellElement);

            }

            tableElement.appendChild(rowElement);
        }

        return tableElement;
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

class Move {
    constructor(row, column, operatorQueueIndex, score) {
        this.row = row;
        this.column = column;
        this.operatorQueueIndex = operatorQueueIndex;
        this.score = score;
    }
    // Ability to create a new move from a current move, new cell, and operation? MoveHistory would need to validate it against existing moves before or after.
}

class MoveHistory {
    constructor(grid, operatorQueue) {
        this.grid = grid;
        this.operatorQueue = operatorQueue;

        this.moves = []
        this.makeMove(grid.startIndex.row, grid.startIndex.column);
    }

    makeMove(row, column) {
        
        // validate move
        for (let move of this.moves) {
            if (move.row == row && move.column == column) {
                throw Error(`Move already exists at row: ${row}, column: ${column}!`);
            }
        }

        let currentMove;
        if (this.moves.length > 0) {
            currentMove= this.moves[this.moves.length - 1];
        } else { // This is the first move! Set the starting score to the number of the starting cell.
            currentMove = new Move(0, 0, 0, this.grid.cells[this.grid.startIndex.row][this.grid.startIndex.column].number);
        }
        
        const newCellNumber = this.grid.cells[row][column].number;
        const newScore = this.operatorQueue.operate(currentMove.score, newCellNumber);
        console.log(currentMove);
        const newOperatorIndex = this.operatorQueue.selectedIndex + 1;

        let newMove = new Move(row, column, newOperatorIndex, newScore);
        this.moves.push(newMove)
    }
}

// Default Grid Generation
let GAME_GRID = new Grid(4, 6, 2);
let GAME_OPERATORS = new OperatorQueue();
let GAME_MOVES = new MoveHistory(GAME_GRID, GAME_OPERATORS);