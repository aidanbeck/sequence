A daily game by Aidan & Carter Beck

# Temporary PseudoCode

OperatorQueue
- operators: array of chars
- selectedIndex
* getSelectedSymbol()
* selectNextOperator()
* selectOperator(index)
* operate(score, number): returns new score

Cell
- number (random integer between 1 and 9)
- isObstructed

Grid (rows, columns, obstacleCount)
- cells: 2d array of cells
- startIndex:    row & column of start
- endIndex:      row & column of end
- selectedIndex: row & column of selection
* initializeCells(rows, columns): fills a 2d grid with random numbered cells
* spawnObstacles(obstacleCount): changes x cells into obstacles.
* spawnStartIndex(): sets spawn index to a free space.
* spawnEndIndex(): sets end index to a free at a minimum distance from the start.
* generateTable(): creates an html representation of the cell grid.
* printCells(): prints the cell grid to the console.
* helpers:
    * isObstructed(row, column): returns true if cell at row,column is obstructed.
    * randomCellIndex(): returns a random row,column index.

Move
- row
- column
- operatorIndex
- score

MoveHistory
- grid:             reference to Grid class
- operatorQueue:    reference to OperatorQueue class
- moves:            array of Move objects
* makeMove
* validateMove
* getLatestMove
* makeInitialMove
* printMove
* revertToMove


Tapping always reverts, dragging ONLY reverts most recent (Not even origin)
If tap is recent, it reverts to previous
Submission Button & Completion Panel
Stylization
Back-End High Scores