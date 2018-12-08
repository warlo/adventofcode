const input = [
  [135, 127],
  [251, 77],
  [136, 244],
  [123, 169],
  [253, 257],
  [359, 309],
  [100, 247],
  [191, 323],
  [129, 323],
  [76, 284],
  [69, 56],
  [229, 266],
  [74, 216],
  [236, 130],
  [152, 126],
  [174, 319],
  [315, 105],
  [329, 146],
  [288, 51],
  [184, 344],
  [173, 69],
  [293, 80],
  [230, 270],
  [279, 84],
  [107, 163],
  [130, 176],
  [347, 114],
  [133, 331],
  [237, 300],
  [291, 283],
  [246, 297],
  [60, 359],
  [312, 278],
  [242, 76],
  [81, 356],
  [204, 291],
  [187, 335],
  [176, 98],
  [103, 274],
  [357, 144],
  [314, 118],
  [67, 196],
  [156, 265],
  [254, 357],
  [218, 271],
  [118, 94],
  [300, 189],
  [290, 356],
  [354, 91],
  [209, 334]
];

const test = [[1, 1], [1, 6], [8, 3], [3, 4], [5, 5], [8, 9]];

const getMaxCoordinates = input =>
  input.reduce(
    (a, b) => {
      let [x, y] = a;
      if (b[0] > x) {
        x = b[0];
      }
      if (b[1] > y) {
        y = b[1];
      }
      return [x, y];
    },
    [0, 0]
  );

const getCounts = matrix =>
  matrix.reduce(
    (acc, row) =>
      row.reduce(
        (rowAcc, [key, ...rest]) => ({
          ...rowAcc,
          [key]: rowAcc[key] ? rowAcc[key] + 1 : 1
        }),
        acc
      ),
    {}
  );

const getMax = counts =>
  Object.values(counts).reduce((max, val) => (max < val ? val : max));

class PartOne {
  constructor(input) {
    this.points = input;
    this.queue = [];
    this.grid = [];
  }

  run = () => {
    this.grid = this.generateGrid(this.points);
    this.fillPoints();
    this.updateAdjacents();
    const counts = getCounts(this.grid);
    const removedInf = partOne.removeInfinite(counts);
    console.log(getMax(removedInf));
  };

  generateGrid = (input = []) => {
    const [maxX, maxY] = getMaxCoordinates(input);
    const row = [];
    row.length = maxX + 2;
    row.fill([".", 0]);
    const grid = Array.from({ length: maxY + 2 }, e => [...row]);

    return grid;
  };

  printGrid = () => {
    for (let row of this.grid) {
      console.log(...row.map(e => e[0]));
    }
    console.log("\n");
  };

  fillPoints = () => {
    for (let [i, [x, y]] of this.points.entries()) {
      const rootChar = i;
      this.grid[y][x] = [rootChar, 0];
      this.queue.push([x, y, 0, rootChar]);
    }
  };

  updateAdjacents = () => {
    let point;
    while (this.queue.length !== 0) {
      const [x, y, i, rootChar] = this.queue.shift();
      const adjacentPoints = [[x, y + 1], [x, y - 1], [x + 1, y], [x - 1, y]];
      const pointChar = this.grid[y][x][0];

      for (let [aX, aY] of adjacentPoints) {
        if (
          aY < 0 ||
          aX < 0 ||
          aY > this.grid.length - 1 ||
          aX > this.grid[0].length - 1
        ) {
          continue;
        }
        const [char, distance] = this.grid[aY][aX];
        if (char === ".") {
          this.grid[aY][aX] = [pointChar, i + 1];
          this.queue.push([aX, aY, i + 1, rootChar]);
        } else if (char !== ".") {
          if (char !== pointChar && this.grid[aY][aX][1] === i + 1) {
            this.grid[aY][aX] = ["?", i + 1];
          } else if (distance > i + 1) {
            this.grid[aY][aX] = [pointChar, i + 1];
            this.queue.push([aX, aY, i + 1, rootChar]);
          }
        }
      }
    }
  };

  removeInfinite = counts => {
    const x = this.grid[0].length;
    const y = this.grid.length;
    const keys = new Set();
    for (let i = 0; i < y; i++) {
      keys.add(String(this.grid[i][0][0]));
      keys.add(String(this.grid[i][x - 1][0]));
    }
    for (let j = 0; j < x; j++) {
      keys.add(String(this.grid[0][j][0]));
      keys.add(String(this.grid[y - 1][j][0]));
    }
    return Object.entries(counts).reduce(
      (acc, [key, val]) => (!keys.has(key) ? { ...acc, [key]: val } : acc),
      {}
    );
  };
}

const partOne = new PartOne(input);
partOne.run();
