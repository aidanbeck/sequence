import OperatorQueue from './OperatorQueue.js';
import Grid from './Grid.js';
import MoveHistory from './MoveHistory.js';
import { OperatorQueueElementBuilder, GridElementBuilder, ScoreElementBuilder } from './UI.js';

let GAME_OPERATORS = new OperatorQueue();
let GAME_GRID = new Grid(4, 6, 2);
let GAME_MOVES = new MoveHistory(GAME_GRID, GAME_OPERATORS);

/*
    This is a band-aid, setting GAME_MOVES to a global variable.
    It allows the element builders to have access to GAME_MOVES, which they depend on, even though they shouldn't.
    I need a solution that allows the UI to update the game state and be updated by the game state, without directly referencing it.

    This is also useful for debugging, as it exposes state to the developer console.
*/
globalThis.GAME_MOVES = GAME_MOVES;

let operatorQueueElement = new OperatorQueueElementBuilder(GAME_OPERATORS);
let gridElement = new GridElementBuilder(GAME_GRID);
let scoreElement = new ScoreElementBuilder(GAME_MOVES);

document.getElementById("operators").appendChild(operatorQueueElement);
document.getElementById("grid").appendChild(gridElement);
document.getElementById("score").appendChild(scoreElement);