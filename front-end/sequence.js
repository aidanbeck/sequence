class OperatorQueue {
    constructor(operators = ['+', '*', '/']) {

        this.operators = operators;
    }

    getOperator(operatorIndex) {
        return this.operators[operatorIndex];
    }

    getNextIndex(operatorIndex) {
        operatorIndex++;
        if (operatorIndex >= this.operators.length) {
            operatorIndex = 0;
        }
        return operatorIndex;
    }

    operate(score, number, operatorIndex) {

        let symbol = this.getOperator(operatorIndex);

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

    randomCellIndex() {
        return {
            row: Math.floor( Math.random() * this.cells.length),
            column: Math.floor( Math.random() * this.cells[0].length)
        }
    }

    getCell(row, column) {
        return this.cells[row][column];
    }

    isObstructed(row, column) {
        return this.getCell(row, column).obstructed;
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
    constructor(row, column, operatorIndex, score) {
        this.row = row;
        this.column = column;
        this.operatorIndex = operatorIndex;
        this.score = score;
    }
}

class MoveHistory {

    constructor(grid, operatorQueue) {
        this.grid = grid;
        this.operatorQueue = operatorQueue;

        this.moves = []
        this.makeInitialMove();
    }

    makeMove(row, column) {

        if (!this.validateMove(row, column)) { return; }

        const currentMove = this.getLatestMove();
        const newCellNumber = this.grid.getCell(row, column).number;

        const newScore = this.operatorQueue.operate(currentMove.score, newCellNumber, currentMove.operatorIndex);
        const newOperatorIndex = this.operatorQueue.getNextIndex(currentMove.operatorIndex);

        let newMove = new Move(row, column, newOperatorIndex, newScore);
        this.moves.push(newMove)
        this.printMove(newMove);
    }

    validateMove(row, column) {

        // Check that move does not already exist at this index.
        for (let move of this.moves) {
            if (move.row == row && move.column == column) {
                throw Error(`Move already exists at row: ${row}, column: ${column}!`);
            }
        }

        // Check that move is in bounds
        // Check that move is adjacent to the latest move
        // Check that move is not obstructed

        return true;
    }

    getLatestMove() {

        if (this.moves.length < 1) {
            throw Error("Cannot return latest Move as there are none.");
        }

        return this.moves[this.moves.length - 1];
    }

    makeInitialMove() {
        let startIndex = this.grid.startIndex;
        let startCell = this.grid.getCell(startIndex.row, startIndex.column);
        let startScore = startCell.number;
        let initialMove = new Move(startIndex.row, startIndex.column, 0, startScore);

        this.moves.push(initialMove);
    }

    printMove(move) {
        console.log(`Moved to (${move.row},${move.column}) \n Score: ${move.score} \n Operator: ${this.operatorQueue.operators[move.operatorIndex]}`);
    }

    revertToMove(row, column) {

        const moves = this.moves;
        let move;

        for (let i = 0; i < moves.length - 1; i++) {
            move = moves[i];
            if (row == move.row && column == move.column) {
                moves.splice(i + 1); // delete all moves after this one
            }
        }

        return move;
        // Throw error if no moves match
        // Could make a "findMove" helper function to find moves by row, column
    }

}

// Default Grid Generation
let GAME_GRID = new Grid(4, 6, 2);
let GAME_OPERATORS = new OperatorQueue();
let GAME_MOVES = new MoveHistory(GAME_GRID, GAME_OPERATORS);