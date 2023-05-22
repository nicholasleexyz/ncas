const seedrandom = require('seedrandom');

let SEED = 'asdf';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let width = 128;
let height = 128;

canvas.width = width;
canvas.height = height;

const cellSize = 1;

let grid = [];

function generateWanderingDrunkardNoise(seed, numOfDrunkards) {
    // eslint-disable-next-line new-cap
    const rng = new seedrandom(seed);

    const noise = [];

    for (let y = 0; y < height; y += 1) {
        noise[y] = [];
        for (let x = 0; x < width; x += 1) {
            noise[y][x] = grid[y][x];
        }
    }

    let xCoord = Math.round(rng() * width) % width;
    let yCoord = Math.round(rng() * height) % height;

    for (let i = 0; i < numOfDrunkards; i += 1) {
        const steps = (canvas.width * canvas.height) / 4;
        noise[yCoord][xCoord] = 1;

        for (let j = 0; j < steps; j += 1) {
            const dir = Math.round(rng() * 4) % 4;

            for (let z = 0; z < 1; z += 1) {
                if (dir === 0) {
                    noise[yCoord > height - 2 ? yCoord : yCoord += 1][xCoord] = 1;
                } else if (dir === 1) {
                    noise[yCoord][xCoord > height - 2 ? xCoord : xCoord += 1] = 1;
                } else if (dir === 2) {
                    noise[yCoord === 0 ? yCoord : yCoord -= 1][xCoord] = 1;
                } else if (dir === 3) {
                    noise[yCoord][xCoord === 0 ? xCoord : xCoord -= 1] = 1;
                }
            }
        }
    }

    return noise;
}

function generateCellularAutomata(noise) {
    const ca = new Array(width).fill().map(() => new Array(height));
    const currentNoise = noise.map((a) => a);

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            if (y > 0 && y < height - 1 && x > 0 && x < width - 1) {
                const neighbors = [
                    currentNoise[y + 1][x - 1],
                    currentNoise[y + 1][x],
                    currentNoise[y + 1][x + 1],
                    currentNoise[y][x - 1],
                    currentNoise[y][x + 1],
                    currentNoise[y - 1][x - 1],
                    currentNoise[y - 1][x],
                    currentNoise[y - 1][x + 1],
                ];

                if (neighbors.filter((a) => a === 1).length > 3) {
                    ca[y][x] = 1;
                } else {
                    ca[y][x] = 0;
                }
            } else {
                ca[y][x] = 0;
            }
        }
    }

    return ca;
}

function drawGrid() {
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            context.fillStyle = grid[y][x] ? '#000' : '#FFF';
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function generateGrid() {
    grid = new Array(width).fill().map(() => new Array(height));

    grid = generateWanderingDrunkardNoise(SEED, 1);

    for (let z = 1; z < 6; z += 1) {
        grid = generateCellularAutomata(grid);
    }

    grid = generateWanderingDrunkardNoise(SEED, 10);

    drawGrid();
}

const seedInput = document.querySelector('#seed input');

const ele = document.getElementsByName('size');

function change(str) {
    const dict = { small: 128, medium: 256, large: 512 };
    const s = dict[str];

    width = s;
    height = s;

    canvas.width = s;
    canvas.height = s;

    generateGrid();
}

for (let i = 0; i < ele.length; i += 1) {
    const element = ele[i];

    element.onclick = () => change(element.id);
}

seedInput.addEventListener('input', () => {
    SEED = seedInput.value;
    generateGrid();
});

generateGrid();

const downloadButton = document.querySelector('#download-button');

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    const flattened = [].concat(...grid);
    const total = [];
    for (let i = 0; i < flattened.length; i += 1) {
        total.push((i + 1) % width === 0 ? `${flattened[i]}\n` : flattened[i]);
    }

    const file = new Blob(total, { type: 'text/plaintext' });
    link.href = URL.createObjectURL(file);
    link.download = `${seedInput.value}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
});
