export default class SequenceUI {
    constructor(operatorQueue, grid, moveHistory) {

        this.operatorQueue = operatorQueue;
        this.grid = grid;
        this.moveHistory = moveHistory;

        this.operatorQueueElement = new OperatorQueueElementBuilder(operatorQueue);
        this.gridElement = new GridElementBuilder(grid, this);
        this.scoreElement = new ScoreElementBuilder(moveHistory);

        this.renderState();
    }

    appendToIds(operatorQueueElementId, gridElementId, scoreElementId) {
        document.getElementById(operatorQueueElementId).appendChild(this.operatorQueueElement);
        document.getElementById(gridElementId).appendChild(this.gridElement);
        document.getElementById(scoreElementId).appendChild(this.scoreElement);
    }

    renderState() {
        OperatorQueueElementBuilder.updateOperatorsElement(this.operatorQueueElement, this.moveHistory);
        GridElementBuilder.updateCellElements(this.gridElement, this.moveHistory);
        ScoreElementBuilder.updateScoreElement(this.scoreElement, this.moveHistory);
    }
}

class OperatorQueueElementBuilder {
    constructor(operatorQueue) {

        let operatorQueueElement = this.buildDiv(operatorQueue.operators);
        return operatorQueueElement;
    }

    buildDiv(operators) {
        let operatorQueueElement = document.createElement("div");

        for (let operatorSymbol of operators) {
            let operatorElement = document.createElement("span");
            operatorElement.classList.add("operator", operatorSymbol);
            operatorElement.innerText = operatorSymbol;
            operatorQueueElement.appendChild(operatorElement);
        }

        return operatorQueueElement;
    }

    static updateOperatorsElement(operatorQueueElement, moveHistory) {
        
        let operatorIndex = moveHistory.getLatestMove().operatorIndex;
        let selectedOperator = operatorQueueElement.querySelector(".selectedOperator");
        selectedOperator != null && selectedOperator.classList.remove("selectedOperator"); // There should only be one selected operator, so removing just one is fine.

        operatorQueueElement.querySelectorAll(".operator")[operatorIndex].classList.add("selectedOperator");
    }
}

class GridElementBuilder {
    constructor(grid, ui) {

        let tableElement = this.buildTable(grid, ui);
        return tableElement;
    }

    buildTable(grid, ui) {

        let tableElement = document.createElement("table");
        tableElement.ui = ui; // allows cellElements to reference ui reference upon selection.

        let cells = grid.cells;
        for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {

            let rowElement = document.createElement("tr");
            let row = cells[rowIndex];

            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {

                let cellElement = document.createElement("td");
                let cell = row[columnIndex];

                let isObstructed = grid.isObstructed(rowIndex, columnIndex);
                let isStart = (rowIndex == grid.startIndex.row) && (columnIndex == grid.startIndex.column);
                let isEnd = (rowIndex == grid.endIndex.row) && (columnIndex == grid.endIndex.column);

                isObstructed && cellElement.classList.add("obstructed");
                isStart && cellElement.classList.add("start");
                isEnd && cellElement.classList.add("end");

                cellElement.innerText = cell.number;
                cellElement.id = `${rowIndex}|${columnIndex}`;

                cellElement.addEventListener('pointerenter', this.selectCell);
                rowElement.appendChild(cellElement);

            }

            tableElement.appendChild(rowElement);
        }

        return tableElement;
    }

    selectCell() {
        
        let cellElement = this; // cellElement is passed this function, so "this" will be the cellElement.
        let ui = cellElement.parentNode.parentNode.ui; // grid table element contains a reference to ui object
        
        let moveHistory = ui.moveHistory;
        let grid = ui.grid;

        const row = Number(cellElement.id.split("|")[0]);
        const column = Number(cellElement.id.split("|")[1]);

        moveHistory.makeMove(row, column);

        // moveHistory.MoveIsPreexisting(row, column) && moveHistory.revertToMove(row, column);
        moveHistory.MoveIsPrevious(row, column) && moveHistory.revertToMove(row, column); // duplicate of above?
        moveHistory.MoveIsStartIndex(row, column) && moveHistory.revertToMove(row, column); // duplicate of above?

        moveHistory.MoveIsEndIndex(row, column) && alert(`Completed with a score of ${moveHistory.getLatestMove().score}!`); // TODO add winning UI with Submit & Keep Trying options.
        
        ui.renderState();
    }

    static updateCellElements(tableElement, moveHistory) {
        this.removeCellElementStyling(tableElement);
        this.addCellElementStyling(tableElement, moveHistory);
    }

    static removeCellElementStyling(tableElement) {
        const cellElements = tableElement.querySelectorAll("td");
        for (let element of cellElements) {
            element.classList.remove("moved");
            element.classList.remove("latestMove");
            element.classList.remove("previousMove");
        }
    }

    static addCellElementStyling(tableElement, moveHistory) {
        const moves = moveHistory.moves;
        for (let i = 0; i < moves.length; i++) {
            let move = moves[i];

            /*
                I can't use getElementById on tableElement, because it is not the document.
                I also cannot use querySelector(#r|c), as query selectors cannot include | or start with a number.
                I also cannot change the cell id format, as rows and indexes are extracted from the id string.
                Eventually, I should change how the string is extracted, or store cell index data elsewhere.
                For now, I will search through the td elements and compare ids, but this is not a permanent solution.
            */
            let element;
            let tds = tableElement.querySelectorAll("td");
            for (let td of tds) {
                if (td.id == `${move.row}|${move.column}`) {
                    element = td;
                }
            }

            element.classList.add("moved");

            if (i == moves.length - 1) {
                element.classList.add("latestMove");
            }
            if (i == moves.length - 2) {
                element.classList.add("previousMove");
            }
        }
    }
    
}

class ScoreElementBuilder {
    constructor(moveHistory) {

        let scoreElement = document.createElement("div");
        return scoreElement;
    }

    static updateScoreElement(scoreElement, moveHistory) {
        let score = moveHistory.getLatestMove().score;
        scoreElement.innerText = `SCORE: ${score}`;
    }
}