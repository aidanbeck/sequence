export default class SequenceUI {
    constructor(operatorQueue, grid, moveHistory) {

        this.mouseDown = false;

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

        document.getElementById("title").innerHTML = `SEQUENCE ${this.grid.seed}`;
    }

    renderState() {
        OperatorQueueElementBuilder.updateOperatorsElement(this.operatorQueueElement, this.moveHistory);
        GridElementBuilder.updateCellElements(this.gridElement, this.moveHistory);
        ScoreElementBuilder.updateScoreElement(this.scoreElement, this.moveHistory);
    }

    getShareString(moves, cells, score, date, place, playerCount) {

        let resultString = "notebeck.com/sequence\n\n";

        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[i].length; j++) {
                let cell = cells[i][j];
                if (cell.obstructed) { resultString += "⬛"; continue; }
                if ( moves.MoveIsEndIndex(i, j) ) { resultString += "🟩"; continue; }
                // if ( moves.MoveIsStartIndex(i, j) ) { resultString += "S"; continue; }
                if ( moves.MoveIsPreexisting(i, j) ) { resultString += "🟦"; continue; }
                resultString += "⬜";
            }

            if (i == 0) { resultString += ` ${date.toLocaleDateString()}`; }
            if (i == 2) { resultString += ` ${place.toLocaleString('en-us')}nd place`; } // needs nd, th, st, etc
            if (i == 3) { resultString += ` ${playerCount.toLocaleString('en-us')}`; }
            if (i == 5) { resultString += ` ${score.toLocaleString('en-us')}🥇`; }
            resultString += "\n";

        }

        return resultString;
    }

}

class OperatorQueueElementBuilder {
    constructor(operatorQueue) {

        let operatorQueueElement = this.buildDiv(operatorQueue.operators);
        operatorQueueElement.classList.add("operators");
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

        tableElement.addEventListener("mousedown", this.mouseDown);
        tableElement.addEventListener("mouseup", this.mouseUp);

        tableElement.addEventListener("touchstart", this.mouseDown);
        tableElement.addEventListener("touchend", this.mouseUp); 
        tableElement.addEventListener("touchmove", this.touchMove);

        return tableElement;
    }

    touchMove(e) {
        /*
            Touch events on mobile target the element that was initially touched, NOT the element beneath the touch coordinates, which is what mouse/pointer events do.
            This function converts touch events into pointer events by extracting their coordinates & re-dispatching them at the cell in that location.
        */
        let touch = e.touches[0];
        let targetCell = document.elementFromPoint(touch.clientX, touch.clientY);
        targetCell.dispatchEvent( new PointerEvent("pointerenter") );
    }

    mouseDown() {
        this.ui.mouseDown = true; // mouseDown is called by grid element, so "this" is the grid itself
    }

    mouseUp() {
        this.ui.mouseDown = false; // mouseDown is called by grid element, so "this" is the grid itself
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
                cellElement.addEventListener('click', this.selectCell);

                rowElement.appendChild(cellElement);

            }

            tableElement.appendChild(rowElement);
        }

        return tableElement;
    }

    selectCell(event) {
        
        let cellElement = this; // cellElement is passed this function, so "this" will be the cellElement.
        let ui = cellElement.parentNode.parentNode.ui; // grid table element contains a reference to ui object
        
        if (!ui.mouseDown && event.type != "click") { return; }

        let moveHistory = ui.moveHistory;
        let grid = ui.grid;

        const row = Number(cellElement.id.split("|")[0]);
        const column = Number(cellElement.id.split("|")[1]);

        let latestMove = moveHistory.getLatestMove();
        if (latestMove.row == row && latestMove.column == column) { return; }

        moveHistory.makeMove(row, column);

        // moveHistory.MoveIsPreexisting(row, column) && moveHistory.revertToMove(row, column);
        moveHistory.MoveIsPrevious(row, column) && moveHistory.revertToMove(row, column); // duplicate of above?
        moveHistory.MoveIsStartIndex(row, column) && moveHistory.revertToMove(row, column); // duplicate of above?

        // moveHistory.MoveIsEndIndex(row, column) && alert(`Completed with a score of ${moveHistory.getLatestMove().score}!`); // TODO add winning UI with Submit & Keep Trying options.}
        
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

            if (element.textContent.length > 1) {
                element.textContent = element.textContent[1];
            }
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

            // Add operator symbol
            if (i > 0) {


                let lastOperatorIndex = moves[i - 1].operatorIndex; // get operator index of the previous move in the history
                let operatorSymbol = moveHistory.operatorQueue.getOperator(lastOperatorIndex);
                
                let cellNumber = moveHistory.grid.getCell(move.row, move.column).number;
                element.textContent = `${operatorSymbol}${cellNumber}  `;
            }
            

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
        let latestMove = moveHistory.getLatestMove();

        // round score to two decimal places
        let score = latestMove.score;
        let integer = Math.trunc(score);
        let decimal = score - integer;
        let roundedDecimal = Math.round(decimal * 100) / 100;
        let roundedScore = integer + roundedDecimal;

        // style score if sequence is complete
        if (moveHistory.MoveIsEndIndex(latestMove.row, latestMove.column)) {
            scoreElement.classList.add("finalScore");
        } else {
            scoreElement.classList.remove("finalScore");
        }


        scoreElement.innerText = roundedScore;
    }
}