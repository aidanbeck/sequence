class Move {
    constructor(row, column, operatorIndex, score) {
        this.row = row;
        this.column = column;
        this.operatorIndex = operatorIndex;
        this.score = score;
    }
}

export default class MoveHistory {

    constructor(grid, operatorQueue) {
        this.grid = grid;
        this.operatorQueue = operatorQueue;

        this.moves = []
        this.makeInitialMove();
    }

    makeMove(row, column) {

        if (!this.validateMove(row, column)) { return; }

        const currentMove = this.getLatestMove();
        const newCellNumber = this.grid.getCell(row, column).number;

        const newScore = this.operatorQueue.operate(currentMove.score, newCellNumber, currentMove.operatorIndex);
        const newOperatorIndex = this.operatorQueue.getNextIndex(currentMove.operatorIndex);

        let newMove = new Move(row, column, newOperatorIndex, newScore);
        this.moves.push(newMove)
        this.printMove(newMove);
    }

    validateMove(row, column) {

        // Check that move does not already exist at this index.
        let preExistingMove = this.findMove(row, column);
        if (preExistingMove != null) {
            throw Error(`Move already exists at row: ${row}, column: ${column}!`);
        }

        // Check that move is in bounds
        // Check that move is adjacent to the latest move
        // Check that move is not obstructed

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
        let initialMove = new Move(startIndex.row, startIndex.column, 0, startScore);

        this.moves.push(initialMove);
    }

    printMove(move) {
        console.log(`Moved to (${move.row},${move.column}) \n Score: ${move.score} \n Operator: ${this.operatorQueue.operators[move.operatorIndex]}`);
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
            const index = this.moves.indexOf(move)
            this.moves.splice(index);
        }

        this.makeMove(row, column); // make move on this spot again (useful for triggering thins like printMove)

        return move;
        // TODO: Throw error if no moves match
    }

}