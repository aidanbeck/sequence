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
        this.updateCellElements(tableElement);
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

        let moves = GAME_MOVES; // TODO recieve this as class input
        let grid = GAME_GRID;

        const row = Number(this.id.split("|")[0]);
        const column = Number(this.id.split("|")[1]);

        moves.makeMove(row, column);

        const moveAlreadyExists = moves.findMove(row, column) != null;
        const moveResultsInWin = (row == grid.endIndex.row) && (column == grid.endIndex.column);

        moveAlreadyExists && moves.revertToMove(row, column);
        moveResultsInWin && alert(`Completed with a score of ${moves.getLatestMove().score}!`); // TODO add winning UI with Submit & Keep Trying options.
        // TODO: if move is the latest move, revert move to the previous move (so you can click to toggle the recent move)
        // TODO (bug): if move is the origin move, it does not reset


        let tableElement = this.parentNode.parentNode;
        // this.updateCellElements(tableElement); // how does this input the correct element?
        // TODO update score UI
        // TODO update operator UI
    }

    updateCellElements(tableElement) {
        this.removeCellElementStyling(tableElement);
        this.addCellElementStyling(tableElement);
    }

    removeCellElementStyling(tableElement) {
        const cellElements = tableElement.querySelectorAll("td");
        for (let element of cellElements) {
            element.classList.remove("moved");
            element.classList.remove("latestMove");
        }
    }

    addCellElementStyling(tableElement) {
        const moves = GAME_MOVES.moves;

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

let gridElement = new GridElementBuilder(GAME_GRID);
document.getElementById("grid").appendChild(gridElement);

globalThis.GAME_MOVES = GAME_MOVES; // exposes state to the developer console for debugging.