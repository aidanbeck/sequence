import OperatorQueue from './OperatorQueue.js';
import Grid from './Grid.js';
import MoveHistory from './MoveHistory.js';

// Default Grid Generation
let GAME_OPERATORS = new OperatorQueue();
let GAME_GRID = new Grid(4, 6, 2);
let GAME_MOVES = new MoveHistory(GAME_GRID, GAME_OPERATORS);

// Build HTML Game Board

let operatorsElement = document.getElementById("operators");

for (let operator of GAME_OPERATORS.operators) {
    let operatorSpan = document.createElement("span");
    operatorSpan.classList.add("operator");
    operatorSpan.classList.add(operator);
    operatorSpan.innerHTML = operator;
    operatorsElement.appendChild(operatorSpan);
}
document.getElementsByClassName("operator")[0].classList.add("selectedOperator");

let table = generateGridTable(GAME_GRID);
document.getElementById("grid").appendChild(table);
colorMovedCells(); // color starting cell

let scoreElement = document.getElementById("score");
scoreElement.innerHTML = "SCORE: " + GAME_MOVES.getLatestMove().score;


function selectCell() {

    const row = Number(this.id.split("|")[0]);
    const column = Number(this.id.split("|")[1]);

    // TODO: if move is the latest move, revert move to the previous move (so you can click to toggle the recent move)
    // TODO (bug): if move is the origin move, it does not reset

    //does move already exist?
    if (GAME_MOVES.findMove(row, column) != null) {
        GAME_MOVES.revertToMove(row, column);
        resetCells();
        colorMovedCells();
    } else {
        GAME_MOVES.makeMove(row, column);
    }

    resetCells();
    colorMovedCells();

    scoreElement.innerHTML = "SCORE: " + GAME_MOVES.getLatestMove().score.toFixed(2);

    for (let operatorElement of document.getElementsByClassName("operator")) {
        operatorElement.classList.remove("selectedOperator");
    }

    document.getElementsByClassName(`operator ${GAME_OPERATORS.operators[GAME_MOVES.getLatestMove().operatorIndex]}`)[0].classList.add("selectedOperator");
}

function resetCells() {
    const cellElements = document.getElementsByTagName("td");

    for (let element of cellElements) {
        element.classList.remove("moved");
        element.classList.remove("latestMove");
    }
}

function colorMovedCells() {

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

function generateGridTable(grid) {

    let cells = grid.cells;
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
            if (i === grid.startIndex.row && j === grid.startIndex.column) {
                cellElement.classList.add("start");
            }

            //Ending Square Styling
            if (i === grid.endIndex.row && j === grid.endIndex.column) {
                cellElement.classList.add("end");
            }
            cellElement.id = `${i}|${j}`;
            cellElement.addEventListener('click', selectCell);
            rowElement.appendChild(cellElement);

        }

        tableElement.appendChild(rowElement);
    }

    return tableElement;
}


globalThis.GAME_MOVES = GAME_MOVES; // allow developer console to interact with game state.

/*
    Because this site uses js modules, opening index files directly will result in CORS errors.
    You will have to run the site as a web server. I am using node's http-server package.
*/