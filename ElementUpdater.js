export default class ElementUpdater {
    constructor(state, operatorsElement, scoreElement, gridElement) {
        this.state = state;
        
        this.operatorsElement = operatorsElement;
        this.scoreElement = scoreElement;
        this.gridElement = gridElement;

        this.isMoving = false;
        this.lastMovesCount = 0;
        this.movesCount = 0;
        this.update();

        gridElement.addEventListener("pointerdown", this.onPointerDown);
        gridElement.addEventListener("pointerup", this.onPointerUp);
        gridElement.addEventListener("pointermove", this.onPointerMove);
        gridElement.addEventListener("touchmove", this.onTouchMove);

    }

    onPointerDown = (e) => {
        this.isMoving = true;
        this.selectCellElement(e.target);
    }

    onPointerUp = (e) => {
        this.isMoving = false;
    }

    onPointerMove = (e) => {
        if (!this.isMoving) { return; }

        this.selectCellElement(e.target);
    }

    onTouchMove = (e) => {
        if (!this.isMoving) { return; }
        /*
            Touch events on mobile target the element that was initially touched, NOT the element beneath the touch coordinates, which is what mouse/pointer events do.
            This function converts touch events into pointer events by extracting their coordinates & re-dispatching them at the cell in that location.
        */
        const touch = e.touches[0];
        const targetCell = document.elementFromPoint(touch.clientX, touch.clientY);
        this.selectCellElement(targetCell);
    }

    selectCellElement(cellElement) {

        const moveHistory = this.state.moveHistory;
        const row = Number(cellElement.id.split("|")[0]);
        const column = Number(cellElement.id.split("|")[1]);

        const isMovePrevious = moveHistory.isMovePrevious(row, column);
        const isMoveStart = moveHistory.isMoveStart(row, column);
        
        if (isMovePrevious || isMoveStart) {
            moveHistory.revertToMove(row, column);
        } else {
            moveHistory.makeMove(row, column);
        }

        this.lastMovesCount = this.movesCount;
        this.movesCount = moveHistory.moves.length - 1;
        this.update();
    }

    update() {
        if (this.movesCount == this.lastMovesCount && this.movesCount != 0) { return; }
        this.updateOperators();
        this.updateScore();
        this.updateCells();
        this.updateMoves();
    }

    updateOperators() {
        if (this.movesCount == this.lastMovesCount + 1) {
            this.updateOperatorsForwards();
        }
    }

    updateOperatorsForwards() {
        const operators = this.state.operators;
        const divs = this.operatorsElement.children;

        this.operatorsElement.style.animation = 'none';
        this.operatorsElement.offsetHeight;
        this.operatorsElement.style.animation = 'moveOperatorsLeft 0.3s forwards';

        const firstDiv = divs[0];
        
        divs[1].classList.add("invisibleOperator");
        divs[4].classList.add("pastOperator");
        divs[5].classList.add("currentOperator");
        divs[8].classList.remove("invisibleOperator");

        const newOperator = operators.getOperator(4);
        firstDiv.className = `operator invisibleOperator ${newOperator}`;
        firstDiv.innerText = newOperator;
        this.operatorsElement.appendChild(firstDiv);
    }

    updateScore() {
        const moveHistory = this.state.moveHistory;
        const latestMove = moveHistory.getLatestMove();
        const score = latestMove.score;

        const isSequenceComplete = moveHistory.isMoveEnd(latestMove.row, latestMove.column);

        const integer = Math.trunc(score);
        const decimal = score - integer;
        const roundedDecimal = Math.round(decimal * 100) / 100;
        const roundedScore = integer + roundedDecimal;

        const operator = this.state.operators.getOperator();

        this.scoreElement.innerText = `= ${roundedScore.toLocaleString('en-us')} ${operator}`;

        this.scoreElement.classList.remove("finalScore");
        isSequenceComplete && this.scoreElement.classList.add("finalScore");
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

}