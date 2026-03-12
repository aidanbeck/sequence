import OperatorQueue from './OperatorQueue.js';
import Grid from './Grid.js';
import MoveHistory from './MoveHistory.js';

let GAME_OPERATORS = new OperatorQueue();
let GAME_GRID = new Grid(4, 6, 2);
let GAME_MOVES = new MoveHistory(GAME_GRID, GAME_OPERATORS);

// Build Operators
let operatorsElement = document.getElementById("operators");

for (let operator of GAME_OPERATORS.operators) {
    let operatorSpan = document.createElement("span");
    operatorSpan.classList.add("operator");
    operatorSpan.classList.add(operator);
    operatorSpan.innerHTML = operator;
    operatorsElement.appendChild(operatorSpan);
}
document.getElementsByClassName("operator")[0].classList.add("selectedOperator");

// Build Score
let scoreElement = document.getElementById("score");
scoreElement.innerHTML = "SCORE: " + GAME_MOVES.getLatestMove().score;

// Build Grid

class GridElementBuilder {
    constructor(grid) {

        let tableElement = this.buildTable(grid);
        //updateCellElements()
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

                cellElement.addEventListener('pointerenter', this.selectCell);
                rowElement.appendChild(cellElement);

            }

            tableElement.appendChild(rowElement);
        }

        return tableElement;
    }

    selectCell() {

        const row = Number(this.id.split("|")[0]);
        const column = Number(this.id.split("|")[1]);

        GAME_MOVES.makeMove(row, column);

        // TODO: if move is the latest move, revert move to the previous move (so you can click to toggle the recent move)
        // TODO (bug): if move is the origin move, it does not reset

        const moveAlreadyExists = GAME_MOVES.moveExistsAt(row, column); // const moveAlreadyExists = GAME_MOVES.findMove(row, column) != null;
        if (moveAlreadyExists) { 
            GAME_MOVES.revertToMove(row, column);
        }

        const moveResultsInWin = GAME_GRID.endExistsAt(row, column); // implement!
        if (moveResultsInWin) {
            alert(`Completed with a score of ${GAME_MOVES.getLatestMove().score}!`);
            // TODO add winning UI with Submit & Keep Trying options.
        }


        this.updateCellElements();
        // TODO update score UI
        // TODO update operator UI
    }

    updateCellElements() {
        this.removeCellElementStyling();
        this.addCellElementStyling();
    }

    removeCellElementStyling() {
        const cellElements = document.getElementsByTagName("td"); // TODO select only elements from this grid.
        for (let element of cellElements) {
            element.classList.remove("moved");
            element.classList.remove("latestMove");
        }
    }

    addCellElementStyling() {
        const moves = GAME_MOVES.moves;

        for (let i = 0; i < moves.length; i++) {
            let move = moves[i];
            let element = document.getElementById(`${move.row}|${move.column}`);
            element.classList.add("moved");

            if (i == moves.length - 1) {
                element.classList.add("latestMove");
            }
        }
    }
    
}

let gridElement = new GridElementBuilder(GAME_GRID);
document.getElementById("grid").appendChild(gridElement);

globalThis.GAME_MOVES = GAME_MOVES; // exposes state to the developer console for debugging.