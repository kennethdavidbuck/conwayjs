## ConwayJS

An ES6 implementation of Conway's Game of Life. Given it's current state, calling #next will return a new instance
of the game initialized with the next state. In that sense, the game works mostly as a stream of essentially 
immutable states.

### Usage

```javascript
    // create a new game instance.
    let conway = new Conway();
    
    // get the current game board (2D array of 0s ad 1s)
    let board = conway.board;
    
    // get the next game instance
    conway = conway.next();
```

The default current default board size is 100x100. You can pass in an instance of your own if you wish in 
the following way:

```javascript
    // create a new game instance with a game board that is 50x50
    let conway = new Conway(Conway.createBoard({width: 50, height: 50}));
```

When you create a new game instance will automatically get populated with a random set of living and dead cells. You can
disable that if you wish:

```javascript
       let conway = new Conway(Conway.createBoard({width: 50, height: 50, preFill: false})); 
```
