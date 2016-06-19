"use strict";

/*global QUnit, Conway*/

QUnit.module('Conway\'s Game Of Life');

const equalNeighbours = function(neighbours1, neighbours2) {
  if (neighbours1.length !== neighbours2.length) return false;

  let length = neighbours1.length;
  let remainders;
  let i;

  remainders = neighbours1.filter((cell) => {
    for (i = 0; i < neighbours2.length; i += 1) {
      if (neighbours2[i][0] === cell[0] && neighbours2[i][1] === cell[1]) {
        return true;
      }
    }

    return false;
  });

  // some elements in the first neighbours set are not in the second.
  if (remainders.length < length) {
    return false;
  }

  remainders = neighbours2.filter((cell) => {
    for (i = 0; i < neighbours1.length; i += 1) {
      if (neighbours1[i][0] === cell[0] && neighbours1[i][1] === cell[1]) {
        return true;
      }
    }

    return false;
  });

  if (remainders.length < length) {
    return false;
  }

  return true;
};

QUnit.test('it exists', 1, (assert) => {
  assert.ok(new Conway(), 'should be able to create instance of conway');
});

QUnit.test('fills with unique arrays',1 ,  (assert) => {
  let board = Conway.createBoard({width: 2, height: 2});

  assert.notEqual(board[0], board[1], 'should be different array instances');
});

QUnit.test('can get width', 1, (assert) => {
  let conway = new Conway();

  assert.strictEqual(conway.width, 100);
});

QUnit.test('can get height', 1, (assert) => {
  let conway = new Conway();

  assert.strictEqual(conway.height, 100);
});

QUnit.test('returns correct neighbors for board size 0', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 0, height: 0}));

  let neighbours = conway.neighbours(0, 0);

  assert.equal(neighbours.length, 0, 'should have no neighbours');
});

QUnit.test('returns correct neighbors for board size 1', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 1, height: 1}));

  let neighbours = conway.neighbours(1, 1);

  assert.equal(neighbours.length, 0, 'should have no neighbours');
});

QUnit.test('returns correct neighbors for board size 2', 2, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 2, height: 1}));

  assert.ok(equalNeighbours(conway.neighbours(0, 0), [[1, 0]]));
  assert.ok(equalNeighbours(conway.neighbours(1, 0), [[0, 0]]));
});

QUnit.test('returns correct neighbours for middle', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));

  assert.ok(equalNeighbours(conway.neighbours(1, 1), [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2]
  ]));
});

QUnit.test('returns correct neighbors for bottom right', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));

  assert.ok(equalNeighbours(conway.neighbours(2, 2), [
    [1, 1],
    [1, 2],
    [2, 1]
  ]));
});

QUnit.test('returns correct neighbors for bottom middle', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));

  assert.ok(equalNeighbours(conway.neighbours(2, 1), [
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 2]
  ]));
});

QUnit.test('returns correct neighbors for bottom left', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));

  assert.ok(equalNeighbours(conway.neighbours(2, 0), [
    [1, 0],
    [1, 1],
    [2, 1]
  ]));
});

QUnit.test('returns correct neighbors for middle left', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));

  assert.ok(equalNeighbours(conway.neighbours(1, 0), [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 0],
    [2, 1]
  ]));
});

QUnit.test('returns correct neighbors for middle right', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));

  assert.ok(equalNeighbours(conway.neighbours(2, 1), [
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 2]
  ]));
});

QUnit.test('returns correct neighbors top left', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));

  assert.ok(equalNeighbours(conway.neighbours(0, 0), [
    [0, 1],
    [1, 0],
    [1, 1]
  ]));
});

QUnit.test('returns correct neighbors top middle', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));

  assert.ok(equalNeighbours(conway.neighbours(0, 1), [
    [0, 0],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2]
  ]));
});

QUnit.test('returns correct neighbors top right', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));

  assert.ok(equalNeighbours(conway.neighbours(0, 2), [
    [0, 1],
    [1, 1],
    [1, 2]
  ]));
});

QUnit.test('caches neighbours across games (single cell board)', 1, () => {
  let conway = new Conway(Conway.createBoard({width: 3, height: 3}));
  let next = conway.next();

  assert.equal(conway.neighboursCache, next.neighboursCache, 'should be same cache');
});

QUnit.test('determines correct number of living neighbours', 1, (assert) => {
  let conway = new Conway(Conway.createBoard({width: 1, height: 1, preFill: false}));

  assert.equal(conway.livingNeighbourCount(0, 0), 0, 'should have no living neighbours')
});

QUnit.test('determines correct number of living neighbours', 4, (assert) => {
  let conway = new Conway([[0, 1], [0, 0]]);

  assert.equal(conway.livingNeighbourCount(0, 0), 1, 'should have one living neighbour');
  assert.equal(conway.livingNeighbourCount(0, 1), 0, 'should have no living neighbours');
  assert.equal(conway.livingNeighbourCount(1, 1), 1, 'should have one living neighbour');
  assert.equal(conway.livingNeighbourCount(1, 0), 1, 'should have one living neighbour');
});
