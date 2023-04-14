'use strict'
var seedrandom = require('seedrandom');
let seed = "asdf";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const width = canvas.width = 640;
const height = canvas.height = width / (16 / 9);
const cellSize = 4;
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);

let density = 0.6;
const density_input = document.querySelector('#density input');
const density_label = document.querySelector('#density span');

const seed_input = document.querySelector('#seed input');

density_input.value = density;
let decimalToPercent = (decimal) => Math.floor(decimal * 100) + "%";
density_label.innerText = decimalToPercent(density);

const generate_button = document.querySelector('#generate');

density_input.addEventListener('input', () => {
    density = density_input.value;
    density_label.innerText = decimalToPercent(density);
    generateGrid();
});

generate_button.addEventListener('click', generateGrid);

seed_input.addEventListener('input', () => {
    seed = seed_input.value;
    generateGrid();
});

let grid = [];

function generateGrid() {

    grid = generateCellularAutomata(generateNoise(seed)).map(a => a);

    drawGrid();
}

function generateCellularAutomata(noise) {
    let ca = Array(cols).fill().map(() => Array(rows));
    let current_noise = noise.map(a => a);

    for (let z = 1; z < 4; z++) {
        for (let y = 1; y < rows - 1; y++) {
            for (let x = 1; x < cols - 1; x++) {
                let neighbors = [
                    current_noise[y + 1][x - 1],
                    current_noise[y + 1][x],
                    current_noise[y + 1][x + 1],
                    current_noise[y][x - 1],
                    current_noise[y][x + 1],
                    current_noise[y - 1][x - 1],
                    current_noise[y - 1][x],
                    current_noise[y - 1][x + 1],
                ];

                if (neighbors.filter(a => a === 1).length > 3)
                    ca[y][x] = 1;
                else
                    ca[y][x] = 0;
            }
        }

        current_noise = ca.map(a => a);
    }

    return ca;
}

function generateNoise(seed) {
    let rng = new seedrandom(seed);

    let noise = [];

    for (let y = 0; y < rows; y++) {
        noise[y] = [];
        for (let x = 0; x < cols; x++) {
            if (y == 0 || x == 0 || y == (rows - 1) || x == (cols - 1)) {
                noise[y][x] = 1;
            }
            else {
                noise[y][x] = rng() < density ? 1 : 0;
            }
        }
    }
    return noise;
}

generateGrid();

function drawGrid() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            context.fillStyle = grid[y][x] ? "#FFF" : "#000";
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}