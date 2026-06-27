export default class ElementUpdater {
    constructor(state, operatorsElement, scoreElement, gridElement) {
        this.state = state;
        
        this.operatorsElement = operatorsElement;
        this.scoreElement = scoreElement;
        this.gridElement = gridElement;

        this.update();

        gridElement.addEventListener("pointerdown", this.onPointerDown);
    }

    onPointerDown = (e) => { // arrow function preserves access to state
        const moveHistory = this.state.moveHistory;

        const cellElement = e.target;
        const row = Number(cellElement.id.split("|")[0]);
        const column = Number(cellElement.id.split("|")[1]);
        moveHistory.makeMove(row, column);

        this.update();
    }

    update() {
        this.updateCells();
        this.updateMoves();
        this.updateScore();
    }

    updateCells() {
        const cells = this.state.grid.cells;

        const endIndex = this.state.grid.endIndex;
        const endCell = document.getElementById(`${endIndex.row}|${endIndex.column}`);

        const startIndex = this.state.grid.startIndex;
        const startCell = document.getElementById(`${startIndex.row}|${startIndex.column}`);

        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[i].length; j++) {

                const td = document.getElementById(`${i}|${j}`);
                const  cell = cells[i][j];

                td.innerText = cell.number;
                td.removeAttribute('class');
                cell.obstructed && td.classList.add("obstructed");
            }
        }

        endCell.classList.add("end");
        startCell.classList.add("start");
        startCell.innerText = "START";
    }

    updateMoves() {
        const moves = this.state.moveHistory.moves;
        const latestMove = this.state.moveHistory.getLatestMove();
        const previousMove = moves[moves.length - 2];

        for (let move of moves) {
            const td = document.getElementById(`${move.row}|${move.column}`);
            td.classList.add("moved");

            move == latestMove && td.classList.add("latestMove");
            move == previousMove && td.classList.add("previousMove");

            // TODO add operator symbol
        }
    }

    updateScore() {
        const moveHistory = this.state.moveHistory;
        const latestMove = moveHistory.getLatestMove();
        const score = latestMove.score;

        const isSequenceComplete = moveHistory.MoveIsEndIndex(latestMove.row, latestMove.column);

        const integer = Math.trunc(score);
        const decimal = score - integer;
        const roundedDecimal = Math.round(decimal * 100) / 100;
        const roundedScore = integer + roundedDecimal;

        this.scoreElement.innerText = "= " + roundedScore.toLocaleString('en-us');

        this.scoreElement.classList.remove("finalScore");
        isSequenceComplete && this.scoreElement.classList.add("finalScore");
    }

}