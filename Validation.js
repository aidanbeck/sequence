import Operators from './Operators.js';
import Grid from './Grid.js';
import MoveHistory from './MoveHistory.js';

export default class Validation {

    constructor() {};
    
    proveMoves(score, proof, seed) {
        const grid = new Grid(4, 6, 2, seed);
        const operators = new Operators();
        const moveHistory = new MoveHistory(grid, operators);

        const moves = this.getMoves(proof);
        this.executeMoves(moves, moveHistory);
        const derivedScore = moveHistory.getLatestMove().score;
        return derivedScore == score;
    }

    getMoves(proof) {

        let moves = [];

        const chars = proof.split('');

        for (let i = 0; i < chars.length; i += 3) {
            let move = {};
            move.column = Number(chars[i]);
            move.row = Number(chars[i+1]);

            moves.push(move);
        }
        return moves;
    }

    executeMoves(moves, moveHistory) {
        for (let move of moves) {
            moveHistory.makeMove(move.row, move.column);
        }
    }


}