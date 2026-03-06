
class Cell {
    constructor() {
        this.number = Math.floor( Math.random() * 10);
        this.moveDirection = null;
        this.start = false;
        this.obstructed = false;
    }
}

class Grid {
    constructor(rows, columns) {
        this.grid = [];

        for (let i = 0; i < columns; i++) {
            this.grid[i] = [];
            for (let j = 0; j < rows; j++) {
                this.grid[i][j] = new Cell(0);
            }
        }
    }
}