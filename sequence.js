import Operators from './Operators.js';
import Grid from './Grid.js';
import MoveHistory from './MoveHistory.js';
import ElementUpdater from './ElementUpdater.js';

const RANDOMIZE_ON_REFRESH = false;

// Daily Seed
const today = new Date();
let seed = "" + today.getFullYear() + today.getMonth() + today.getDate();
seed = Number(seed);

RANDOMIZE_ON_REFRESH && ( seed = Math.random() * 1000 );

class GameState {
    constructor(seed, operatorsElement, scoreElement, gridElement) {
        this.grid = new Grid(4, 6, 2, seed);
        this.operators = new Operators();
        this.moveHistory = new MoveHistory(this.grid, this.operators)
    }
}

const state = new GameState(seed);
const updater = new ElementUpdater(state, operators, score, grid);

title.innerText = `SEQUENCE ${today.toLocaleDateString()}`;

/*
    This is a band-aid, setting GAME_MOVES to a global variable.
    It allows the element builders to have access to GAME_MOVES, which they depend on, even though they shouldn't.
    I need a solution that allows the UI to update the game state and be updated by the game state, without directly referencing it.

    This is also useful for debugging, as it exposes state to the developer console.
*/
globalThis.GAME_STATE = state;
