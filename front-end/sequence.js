import OperatorQueue from './OperatorQueue.js';
import Grid from './Grid.js';
import MoveHistory from './MoveHistory.js';

// Default Grid Generation
let GAME_OPERATORS = new OperatorQueue();
let GAME_GRID = new Grid(4, 6, 2);
let GAME_MOVES = new MoveHistory(GAME_GRID, GAME_OPERATORS);

// Build HTML Game Board
let table = generateGridTable(GAME_GRID);
document.getElementById("grid").appendChild(table);

function selectCell() {

    const row = this.id.split("|")[0];
    const column = this.id.split("|")[1];

    // TODO: if move is the latest move, revert move to the previous move (so you can click to toggle the recent move)

    //does move already exist?
    if (GAME_MOVES.findMove(row, column) != null) {
        GAME_MOVES.revertToMove(row, column);
    } else {
        GAME_MOVES.makeMove(row, column);
    }

    this.classList.add("moved");
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