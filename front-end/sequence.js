class OperatorQueue {
    constructor(operators = ['+', '*', '/'], startingScore = 0) {

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
        this.cells = this.initializeGrid(rows, columns);
        this.spawnObstacles(obstacleCount); // may add an obstacleChance -> obstacleCount step.

        // Indexes
        this.startIndex = this.spawnStartIndex();
        this.endIndex = this.spawnEndIndex();
        this.selectedIndex = {
            row: this.startIndex.row,
            column: this.startIndex.column
        }

        // Visualization
        let gridDiv = document.getElementById("grid");
        gridDiv.appendChild(this.generateTable());
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

new Grid(4, 6, 2);