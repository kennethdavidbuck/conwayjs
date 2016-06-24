"use strict";

const ALIVE = 1;
const DEAD = 0;

class Conway {

  constructor(board = Conway.createBoard({ width: 100, height: 100, preFill: true}), neighboursCache = new Map()) {
    this._board = board;
    this._neighboursCache = neighboursCache;
  }

  /**
   * Provides a means of iterating through conway game instances.
   *
   * @method next
   * @returns {Conway} A new instance of conway where the cell state naturally follows the state of the previous instance
   */
  next() {
    return new Conway(this.board.map((row, rowIndex) => {
      return row.map((state, columnIndex) => {
        let count = this.livingNeighbourCount(rowIndex, columnIndex);
        let nextState = state;

        if (Conway.isAlive(state) && Conway.shouldDie(count)) {
          nextState = DEAD;
        } else if (Conway.isDead(state) && Conway.shouldRestore(count)) {
          nextState = ALIVE;
        }

        return nextState;
      });
    }), this.neighboursCache);
  }

  /**
   * @method toggleCell
   * @param row
   * @param column
   * @returns {Boolean} Whether the cell has been revived
   */
  toggleCell(row, column) {
    if (this.isAlive(row, column)) {
      this.killCell(row, column);
    } else {
      this.reviveCell(row, column);
    }

    return this.isAlive(row, column);
  }

  /**
   * @method getCell
   * @param row
   * @param column
   */
  getCell(row, column) {
    return this.board[row][column];
  }

  /**
   * @method killCell
   * @param row
   * @param column
   */
  killCell(row, column) {
    this.board[row][column] = DEAD;
  }

  /**
   * @method reviveCell
   * @param row
   * @param column
   */
  reviveCell(row, column) {
    this.board[row][column] = ALIVE;
  }

  /**
   * @method isAlive
   * @param row
   * @param column
   * @returns {boolean}
   */
  isAlive(row, column) {
    return Conway.isAlive(this.getCell(row, column));
  }

  /**
   * Provides the number of living neighbours for a given cell
   *
   * @method livingNeighboursCount
   * @param {number} row Row of the cell to have its living neighbours count retrieved
   * @param {number} column Column of the cell to have it living neighbours count retrieved
   * @returns {Number}
   */
  livingNeighbourCount(row, column) {
    return this.neighbours(row, column)
      .filter((cell) => this.isAlive(cell[0], cell[1]))
      .length;
  }

  /**
   * Provides the grid coordinates for all neighbours existing around given cell coordinates
   *
   * @method neighbours
   * @param {number} row The row number for a given cell
   * @param {number} column The column number for a given cell
   * @returns {[[number, number]]}
   */
  neighbours(row, column) {
    let cacheKey = `${row}:${column}`;

    if (!this.neighboursCache.has(cacheKey)) {
      let neighbours;

      if (!this.isLegalCoordinate(row, column)) {
        neighbours = [];
      } else {
        neighbours = [
          [row, column + 1],
          [row, column - 1],
          [row + 1, column],
          [row + 1, column + 1],
          [row + 1, column - 1],
          [row - 1, column],
          [row - 1, column - 1],
          [row - 1, column + 1]
        ].filter((cell) => this.isLegalCoordinate(cell[0], cell[1]));
      }

      this.neighboursCache.set(cacheKey, neighbours);
    }

    return this.neighboursCache.get(cacheKey);
  }

  /**
   * @method isLegalCoordinate
   * @param {number} row The cell row number
   * @param {number} column The cell column number
   * @returns {boolean} Whether the cell position exists on the current cell grid
   */
  isLegalCoordinate(row, column) {
    if (row < 0)                return false;
    if (row >= this.height)     return false;
    if (column < 0)             return false;
    if (column >= this.width)   return false;

    return true;
  }

  /**
   * @method toString
   * @returns {string} The cell grid in rows and columns
   */
  toString() {
    return this.board.map((row) => row.join(' ')).join('\r\n');
  }

  /**
   * Prints a string representation of the cell grid to console
   *
   * @method print
   */
  print() {
    console.log(this.toString());
    console.log();
  }

  /**
   * The width of the current cell grid
   *
   * @property {number} width
   */
  get height() {
    return this.board.length;
  }

  /**
   * The height of the current cell grid
   *
   * @property {number} height
   */
  get width() {
    return this.height > 0 ? this.board[0].length : 0;
  }

  /**
   *
   * @returns {*}
   */
  get board() {
    return this._board;
  }

  /**
   *
   * @returns {*}
   */
  get neighboursCache() {
    return this._neighboursCache;
  }

  /**
   * @method createBoard
   * @param {number} width The desired width of the new game board
   * @param {number} height The desired height of the game board
   * @param {boolean} preFill Whether or not to randomly pre-fill with DEAD and ALIVE values
   */
  static createBoard({width = 0, height = 0, preFill = true}) {
    return new Array(height).fill().map(() => {
      return new Array(width).fill().map(() => {
          return preFill && Math.random() > .5 ? ALIVE : DEAD;
      });
    });
  }

  /**
   * @method isAlive
   * @param {number} state The state to validate is alive
   * @returns {boolean} Whether the state is equivalent to a cell being alive
   */
  static isAlive(state) {
    return state === ALIVE;
  }

  /**
   * @method isDead
   * @param {*} state The state to validate as dead
   * @return {boolean} Whether the given state is equivalent to a cell being dead
   */
  static isDead(state) {
    return state === DEAD;
  }

  /**
   * @param {number} livingNeighbourCount
   * @returns {boolean}
   */
  static shouldRestore(livingNeighbourCount) {
    return livingNeighbourCount === 3;
  }

  /**
   * @param {number} livingNeighbourCount
   * @returns {boolean} Whether the given living neighbour count should result in a cell dying
   */
  static shouldDie(livingNeighbourCount) {
    return Conway.isLonely(livingNeighbourCount) || Conway.isCrowded(livingNeighbourCount);
  }

  /**
   * @param {number} livingNeighbourCount
   * @returns {boolean} Whether the living neighbour count constitutes a cell a lonely
   */
  static isLonely(livingNeighbourCount) {
    return livingNeighbourCount < 2;
  }

  /**
   * @param {number} livingNeighbourCount
   * @returns {boolean} Whether the living neighbour count constitutes a cell being crowded
   */
  static isCrowded(livingNeighbourCount) {
    return livingNeighbourCount > 3;
  }
}

module.exports = Conway;
