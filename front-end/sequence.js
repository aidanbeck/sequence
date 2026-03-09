import OperatorQueue from './OperatorQueue.js';
import Grid from './Grid.js';
import MoveHistory from './MoveHistory.js';

// Default Grid Generation
let GAME_OPERATORS = new OperatorQueue();
let GAME_GRID = new Grid(4, 6, 2);
let GAME_MOVES = new MoveHistory(GAME_GRID, GAME_OPERATORS);

globalThis.GAME_MOVES = GAME_MOVES; // allow developer console to interact with game state.

/*
    Because this site uses js modules, opening index files directly will result in CORS errors.
    You will have to run the site as a web server. I am using node's http-server package.
*/