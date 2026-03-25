import OperatorQueue from './OperatorQueue.js';
import Grid from './Grid.js';
import MoveHistory from './MoveHistory.js';
import SequenceUI from './SequenceUI.js';

let GAME_OPERATORQUEUE = new OperatorQueue();
let GAME_GRID = new Grid(4, 6, 2);
let GAME_MOVES = new MoveHistory(GAME_GRID, GAME_OPERATORQUEUE);

/*
    This is a band-aid, setting GAME_MOVES to a global variable.
    It allows the element builders to have access to GAME_MOVES, which they depend on, even though they shouldn't.
    I need a solution that allows the UI to update the game state and be updated by the game state, without directly referencing it.

    This is also useful for debugging, as it exposes state to the developer console.
*/
globalThis.GAME_MOVES = GAME_MOVES;

let UI = new SequenceUI(GAME_OPERATORQUEUE, GAME_GRID, GAME_MOVES);
UI.appendToIds("operatorQueue", "grid", "score");