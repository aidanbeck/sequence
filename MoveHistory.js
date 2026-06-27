class Move {
    constructor(row, column, operator, score) {
        this.row = row;
        this.column = column;
        this.operator = operator;
        this.score = score;
    }
}

export default class MoveHistory {

    constructor(grid, operators) {
        this.grid = grid;
        this.operators = operators;

        this.moves = []
        this.makeInitialMove();
    }

    makeMove(row, column) {

        if (!this.validateMove(row, column)) { return; }

        const currentMove = this.getLatestMove();
        const newCellNumber = this.grid.getCell(row, column).number;

        const newScore = this.operators.operate(currentMove.score, newCellNumber, currentMove.operator);
        const newOperator = this.operators.getNextOperator();

        let newMove = new Move(row, column, newOperator, newScore);
        this.moves.push(newMove)
        // this.printMove(newMove);
    }

    validateMove(row, column) {

        // Check that move does not already exist at this index.
        let preExistingMove = this.findMove(row, column);
        if (preExistingMove != null) {
            //throw Error(`Move already exists at row: ${row}, column: ${column}!`);
            return false; // TODO handle this error instead of ignoring it.
        }

        // Check that move is adjacent to the latest move
        const latestMove = this.getLatestMove();
        if (!this.MoveIsAdjacent(row, column, latestMove)) {
            throw Error(`row: ${row}, column: ${column} is not an adjacent move!`);
        }
        
        // Check that move is not obstructed
        if (this.grid.isObstructed(row, column)) {
            throw Error(`Cannot move to row: ${row}, column: ${column}, cell is obstructed!`);
        }

        // Check that game is not already won
        if (this.MoveIsEndIndex(latestMove.row, latestMove.column)) {
            throw Error(`Cannot move after game has already won`);
        }

        // TODO: Check that move is in bounds

        return true;
    }

    getLatestMove() {

        if (this.moves.length < 1) {
            throw Error("Cannot return latest Move as there are none.");
        }

        return this.moves[this.moves.length - 1];
    }

    makeInitialMove() {
        let startIndex = this.grid.startIndex;
        let startCell = this.grid.getCell(startIndex.row, startIndex.column);
        let startScore = startCell.number;
        let startOperator = this.operators.getOperator();
        let initialMove = new Move(startIndex.row, startIndex.column, startOperator, startScore);

        this.moves.push(initialMove);
    }

    printMove(move) {
        console.log(`Moved to (${move.row},${move.column}) \n Score: ${move.score} \n Operator: ${move.operator}`);
    }

    findMove(row, column) {
        for (let move of this.moves) {

            if (move.row == row && move.column == column) {
                return move;
            }
        }
        return null; // no moves found. Throw error?
    }

    revertToMove(row, column) {

        let move = this.findMove(row, column);
        if (move != null) {
            let index = this.moves.indexOf(move)
            if (index == 0) { index = 1; } // don't remove the first move
            this.moves.splice(index);
            this.makeMove(row, column); // make move on this spot again (useful for triggering thins like printMove)
        }

        return move;
        // TODO: Throw error if no moves match
    }

    MoveIsAdjacent(row, column, move) {

        const rowIsAdjacent = row <= move.row + 1 && row >= move.row - 1 && column == move.column;
        const columnIsAdjacent = column <= move.column + 1 && column >= move.column - 1 && row == move.row;

        return rowIsAdjacent || columnIsAdjacent;
    }

    MoveIsPrevious(row, column) {
        const previousMove = this.moves[this.moves.length - 2];
        return row == previousMove.row && column == previousMove.column;
    }

    MoveIsPreexisting(row, column) {
        return this.findMove(row, column) != null;
    }

    MoveIsEndIndex(row, column) {
        let endIndex = this.grid.endIndex;
        return row == endIndex.row && column == endIndex.column;
    }

    MoveIsStartIndex(row, column) {
        let startIndex = this.grid.startIndex;
        return row == startIndex.row && column == startIndex.column;
    }

}