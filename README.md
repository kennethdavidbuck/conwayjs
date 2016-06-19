## ConwayJS

An ES6 implementation of Conway's Game of Life. Given it's current state, calling ```#next``` will return a new instance
of the game initialized with the next state. In that sense, the game works as a stream of essentially immutable states.

### Install
```bash
    npm install --save conwayjs
```

### Usage

```javascript
    const Conway = require('conwayjs');

    // create a new game instance.
    let conway = new Conway();
    
    // get the current game board (2D array of 0s ad 1s)
    let board = conway.board;
    
    // get the next game instance
    conway = conway.next();
```

The default board size is 100x100. You can pass in an instance of your own if you wish in 
the following way:

```javascript
    // create a new game instance with a game board that is 50x50
    let conway = new Conway(Conway.createBoard({width: 50, height: 50}));
```

When you create a new game instance it will automatically get populated with a random set of living and dead cells. You can
disable that if you wish:

```javascript
       let conway = new Conway(Conway.createBoard({width: 50, height: 50, preFill: false})); 
```

You can influence the state of game like so:

```javascript
    let conway = new Conway();
    
    let row = 0;
    let column = 1;
    
    // check if a given cell is alive
    conway.isAlive(row, column);
    
    // toggle the state of a cell 
    conway.toggleCell(row, column);
    
    // revive a cell
    conway.reviveCell(row, column);
    
    // kill a cell
    conway.killCell(row, column);
```

Print the current board to console:

```javascript
    let conway = new Conway();
    
    conway.print();
```
