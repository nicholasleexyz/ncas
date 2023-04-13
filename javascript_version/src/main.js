import * as seedrandom from "seedrandom";
var rng = Math.seedrandom('hello.');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const width = canvas.width = 640;
const height = canvas.height = width / (16 / 9);
const cellSize = 8
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);

let density = 0.6;
const density_input = document.querySelector('#density input');
const density_label = document.querySelector('#density span')
density_input.value = density;
decimalToPercent = (decimal) => (decimal * 100) + "%"
density_label.innerText = decimalToPercent(density);

const generate_button = document.querySelector('#generate');

density_input.addEventListener('input', () => {
    density = density_input.value;
    density_label.innerText = decimalToPercent(density);
    generateGrid();
});

generate_button.addEventListener('click', generateGrid);

const grid = [];

function generateGrid() {

    for (let y = 0; y < rows; y++) {
        grid[y] = [];
        for (let x = 0; x < cols; x++) {
            if (y == 0 || x == 0 || y == (rows - 1) || x == (cols - 1)) {
                grid[y][x] = 1;
            }
            else {
                grid[y][x] = rng() < density ? 1 : 0;
            }
        }
    }
    // for (let y = 0; y < rows; y++) {
    //     grid[y] = [];
    //     for (let x = 0; x < cols; x++) {
    //         grid[y][x] = Math.random() < density ? 1 : 0;
    //     }
    // }
    drawGrid();
}

generateGrid();

function drawGrid() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            context.fillStyle = grid[y][x] ? "#000" : "#FFF";
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}