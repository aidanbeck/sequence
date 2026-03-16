export default class SequenceUI {
    constructor(operatorQueue, grid, moves) {

        this.operatorQueue = operatorQueue;
        this.grid = grid;
        this.moves = moves;

        this.operatorQueueElement = new OperatorQueueElementBuilder(operatorQueue);
        this.gridElement = new GridElementBuilder(grid);
        this.scoreElement = new ScoreElementBuilder(moves);

        this.renderState();
    }

    appendToIds(operatorQueueElementId, gridElementId, scoreElementId) {
        document.getElementById(operatorQueueElementId).appendChild(this.operatorQueueElement);
        document.getElementById(gridElementId).appendChild(this.gridElement);
        document.getElementById(scoreElementId).appendChild(this.scoreElement);
    }

    renderState() {
        OperatorQueueElementBuilder.updateOperatorsElement(this.operatorQueueElement, this.moves);
        GridElementBuilder.updateCellElements(this.gridElement, this.moves);
        ScoreElementBuilder.updateScoreElement(this.scoreElement, this.moves);
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

    static updateOperatorsElement(operatorQueueElement, moves) {
        
        let operatorIndex = moves.getLatestMove().operatorIndex;
        let selectedOperator = operatorQueueElement.querySelector(".selectedOperator");
        selectedOperator != null && selectedOperator.classList.remove("selectedOperator"); // There should only be one selected operator, so removing just one is fine.

        operatorQueueElement.querySelectorAll(".operator")[operatorIndex].classList.add("selectedOperator");
    }
}

class GridElementBuilder {
    constructor(grid) {

        let tableElement = this.buildTable(grid);
        return tableElement;
    }

    buildTable(grid) {

        let tableElement = document.createElement("table");
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

                cellElement.addEventListener('pointerenter', GridElementBuilder.selectCell);
                rowElement.appendChild(cellElement);

            }

            tableElement.appendChild(rowElement);
        }

        return tableElement;
    }

    static selectCell(event) {

        const target = event.target;
                
        let moves = GAME_MOVES; // TODO recieve this as class input
        let grid = GAME_MOVES.grid;

        const row = Number(this.id.split("|")[0]);
        const column = Number(this.id.split("|")[1]);

        moves.makeMove(row, column);

        const moveAlreadyExists = moves.findMove(row, column) != null;
        const moveResultsInWin = (row == grid.endIndex.row) && (column == grid.endIndex.column); // moves should have a function for detecting this, so we don't need to access grid, so updates only need to interface with moves

        moveAlreadyExists && moves.revertToMove(row, column);
        moveResultsInWin && alert(`Completed with a score of ${moves.getLatestMove().score}!`); // TODO add winning UI with Submit & Keep Trying options.
        // TODO: if move is the latest move, revert move to the previous move (so you can click to toggle the recent move)
        // TODO (bug): if move is the origin move, it does not reset


        let tableElement = this.parentNode.parentNode;
        // this.updateCellElements(tableElement); // how does this input the correct element?
        // TODO update score UI
        // TODO update operator UI
        // !!! maybe this whole section should be extracted into an external "update ui" method
    }

    static updateCellElements(tableElement, moves) {
        this.removeCellElementStyling(tableElement);
        this.addCellElementStyling(tableElement, moves);
    }

    static removeCellElementStyling(tableElement) {
        const cellElements = tableElement.querySelectorAll("td");
        for (let element of cellElements) {
            element.classList.remove("moved");
            element.classList.remove("latestMove");
        }
    }

    static addCellElementStyling(tableElement, moves) {
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
        }
    }
    
}

class ScoreElementBuilder {
    constructor(moves) {

        let scoreElement = document.createElement("div");
        return scoreElement;
    }

    static updateScoreElement(scoreElement, moves) {
        let score = moves.getLatestMove().score;
        scoreElement.innerText = `SCORE: ${score}`;
    }
}