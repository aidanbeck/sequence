export default class ElementUpdater {
    constructor(state, operatorsElement, scoreElement, gridElement) {
        this.state = state;
        
        this.operatorsElement = operatorsElement;
        this.scoreElement = scoreElement;
        this.gridElement = gridElement;

        this.isMoving = false;
        this.lastSelectedCell = null;
        this.update();

        this.shareString = "";

        gridElement.addEventListener("pointerdown", this.onPointerDown);
        gridElement.addEventListener("touchstart", this.onPointerDown);
        gridElement.addEventListener("pointerup", this.onPointerUp);
        gridElement.addEventListener("touchend", this.onPointerUp);
        gridElement.addEventListener("mousemove", this.onMouseMove);
        gridElement.addEventListener("touchmove", this.onTouchMove);

    }

    onPointerDown = (e) => {
        this.isMoving = true;
        this.selectCellElement(e.target);
    }

    onPointerUp = (e) => {
        const moveHistory = this.state.moveHistory;

        this.isMoving = false;
        const cell = moveHistory.getLatestMove();

        if (moveHistory.isMoveEnd(cell.row, cell.column)) {
            this.endGame();
        }
    }

    onMouseMove = (e) => {
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

        if (cellElement == this.lastSelectedCell) {
            return;
        }
        this.lastSelectedCell = cellElement;
        
        const moveHistory = this.state.moveHistory;
        const row = Number(cellElement.id.split("|")[0]);
        const column = Number(cellElement.id.split("|")[1]);

        const isMovePrevious = moveHistory.isMovePrevious(row, column);
        const isMoveStart = moveHistory.isMoveStart(row, column);
        const isMoveValid = moveHistory.validateMove(row, column);
        
        if (isMovePrevious) {
            moveHistory.undoLatestMove();
            this.updateOperatorsBackwards();

        } else if (isMoveStart) {
            moveHistory.resetMoves();
            this.resetOperators();

        } else if (isMoveValid) {
            moveHistory.makeMove(row, column);
            this.updateOperatorsForwards();
        }

        this.update();
    }

    update() {
        this.updateScore();
        this.updateCells();
        this.updateMoves();
    }

    updateOperatorsForwards() {
        const operators = this.state.operators;
        const latestMoveIndex = this.state.moveHistory.getLatestMoveIndex();
        const divs = this.operatorsElement.children;

        this.operatorsElement.style.animation = 'none';
        this.operatorsElement.offsetHeight;
        this.operatorsElement.style.animation = 'moveOperatorsLeft 0.3s forwards';

        const firstDiv = divs[0];
        
        divs[1].classList.add("invisibleOperator");
        divs[4].classList.add("pastOperator");
        divs[5].classList.add("currentOperator");
        divs[8].classList.remove("invisibleOperator");

        const newOperator = operators.getOperator(latestMoveIndex, 4);
        firstDiv.className = `operator invisibleOperator ${newOperator}`;
        firstDiv.innerText = newOperator;
        this.operatorsElement.appendChild(firstDiv);
    }

    updateOperatorsBackwards() {
        const operators = this.state.operators;
        const latestMoveIndex = this.state.moveHistory.getLatestMoveIndex();
        const divs = this.operatorsElement.children;

        this.operatorsElement.style.animation = 'none';
        this.operatorsElement.offsetHeight;
        this.operatorsElement.style.animation = 'moveOperatorsRight 0.3s forwards';

        const lastDiv = divs[8];
        
        divs[0].classList.remove("invisibleOperator");
        divs[3].classList.remove("pastOperator");
        divs[4].classList.remove("currentOperator");
        divs[7].classList.add("invisibleOperator");

        const newOperator = operators.getOperator(latestMoveIndex, -4);
        if (latestMoveIndex < 4) {
            lastDiv.className = `operator currentOperator pastOperator invisibleOperator beforeStart ${newOperator}`;
        } else {
            lastDiv.className = `operator currentOperator pastOperator invisibleOperator ${newOperator}`;
        }
        lastDiv.innerText = newOperator;

        this.operatorsElement.prepend(lastDiv);
    }

    resetOperators() {
        operators.innerHTML = `<div class="operator pastOperator invisibleOperator beforeStart ÷">÷</div>
            <div class="operator pastOperator beforeStart +">+</div>
            <div class="operator pastOperator beforeStart ×">×</div>
            <div class="operator pastOperator beforeStart ÷">÷</div>
            <div class="operator currentOperator +">+</div>
            <div class="operator ×">×</div>
            <div class="operator ÷">÷</div>
            <div class="operator +">+</div>
            <div class="operator invisibleOperator ×">×</div>`;
        // I love repeating myself! Hacky hacky hack hack hack

        this.operatorsElement.style.animation = 'none';
        this.operatorsElement.offsetHeight;
        this.operatorsElement.style.animation = 'fadeOperatorsIn 0.3s forwards';
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

        const operator = moveHistory.getLatestMove().symbol;

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

        let previousSymbol = 'START'
        for (let move of moves) {

            const td = document.getElementById(`${move.row}|${move.column}`);
            const cell = this.state.grid.getCell(move.row, move.column)

            move == latestMove && td.classList.add("latestMove");
            move == previousMove && td.classList.add("previousMove");

            if (!this.state.moveHistory.isMoveStart(move.row, move.column)) {
                td.innerText = `${previousSymbol}${cell.number}  `;
                td.classList.add("moved");
            }

            previousSymbol = move.symbol;
        }
    }

    endGame() {

        
        const score = this.state.moveHistory.getLatestMove().score;
        const date = (new Date()).toISOString() // TODO store date in game state

        let movesString = "";
        for (let move of this.state.moveHistory.moves) {
            movesString += this.state.grid.getCell(move.row, move.column).number;
            movesString += " ";
            movesString += move.symbol;
        }

        leaderboardMoves.innerText = movesString.slice(0, -1);;
        leaderboardScore.innerText = `= ${score.toLocaleString('en-us')}`;

        this.shareString = this.getShareString(score);
        console.log(this.shareString);

        this.leaderboard(score, date);

        overlay.classList.remove("hidden");
        leaderboard.classList.remove("hidden");
    }

    leaderboard(score, date) {
        fetch("/api/sequence", {
            method: "POST",
            body: JSON.stringify({
                id: localStorage.getItem("sequence:id"),
                score: score,
                moves: null,
                date: date
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(response => response.json())
        .then(json => {
            const moveHistory = this.state.moveHistory;

            localStorage.setItem("sequence:id", json.id);
            localStorage.setItem("sequence:solveId", json.solveId);

            const playerCount = json.totalSolvesToday;
            const place = json.totalBetterSolvesToday + 1;

            solvePlace.innerHTML = `Placed #${place.toLocaleString('en-us')} out of <br> ${playerCount.toLocaleString('en-us')} solvers!`;
            
            if (json.totalTiedSolvesToday > 0) {
                totalTied.innerText = `Tied with ${json.totalTiedSolvesToday.toLocaleString('en-us')} solvers.`;
            }

            console.log(this.getShareString(score, place, playerCount));
            this.shareString = this.getShareString(score, place, playerCount);

        });
    }

    getShareString(score, place, playerCount) {

        const moveHistory = this.state.moveHistory;
        const cells = this.state.grid.cells;
        const date = new Date();
        const emoji = this.getShareEmoji(place, playerCount);

        let resultString = "notebeck.com/sequence\n\n";

        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[i].length; j++) {
                let cell = cells[i][j];
                if (cell.obstructed) { resultString += "⬛"; continue; }
                if ( moveHistory.isMoveEnd(i, j) ) { resultString += "🟩"; continue; }
                if ( moveHistory.isMoveStart(i, j) ) { resultString += "🟩"; continue; }
                if ( moveHistory.isMovePreexisting(i, j) ) { resultString += "🟦"; continue; }
                resultString += "⬜";
            }

            if (i == 0) { resultString += ` ${date.toLocaleDateString()}`; }
            if (i == 2 && place) { resultString += ` Placed #${place.toLocaleString('en-us')} out of`; }
            if (i == 3 && place) { resultString += ` out of`; }
            if (i == 4 && place) { resultString += ` ${playerCount.toLocaleString('en-us')} solvers`; }
            resultString += "\n";
        }

        resultString += `= ${score.toLocaleString('en-us')}${emoji}`;

        return resultString;
    }

    getShareEmoji(place, playerCount) {
        if (place == 1) { return '🥇'; }
        if (place == 2) { return '🥈'; }
        if (place == 3) { return '🥉'; }
        
        if (place >= 10) { return '🏆'; }
        if (place > playerCount - 5) { return '💩'; }

        return '⭐';

    }

}
