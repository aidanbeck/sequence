export default class ElementUpdater {
    constructor(state, operatorsElement, scoreElement, gridElement) {
        this.state = state;
        
        this.operatorsElement = operatorsElement;
        this.scoreElement = scoreElement;
        this.gridElement = gridElement;

        this.updateCells();

        gridElement.addEventListener("pointerdown", this.onPointerDown);
    }

    onPointerDown = (e) => { // arrow function preserves access to state
        const moveHistory = this.state.moveHistory;

        const cellElement = e.target;
        const row = Number(cellElement.id.split("|")[0]);
        const column = Number(cellElement.id.split("|")[1]);

        moveHistory.makeMove(row, column);
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
                cell.obstructed && td.classList.add("obstructed");
            }
        }

        endCell.classList.add("end");
        startCell.classList.add("start");
        startCell.innerText = "START";
    }

}