use image::{ImageBuffer, RgbImage};
use rand::prelude::*;
use rand_pcg::Pcg64;
use rand_seeder::Seeder;

const W: u32 = 512;
const H: u32 = 512;

pub const WIDTH: usize = W as usize;
pub const HEIGHT: usize = H as usize;

const NAME: &str = "ca.png";
const SEED: &str = "jkl;";
const NOISE_AMOUNT: u8 = 48;

pub fn main() {
    let mut grid = white_noise();

    for _i in 0..3 {
        cellular_automata_pass(&mut grid);
    }

    grid_to_image(grid, NAME);
}

fn cellular_automata_pass(noise: &mut [[u8; HEIGHT]; WIDTH]) {
    for y in 1..HEIGHT - 1 {
        for x in 1..WIDTH - 1 {
            let neighbors: [u8; 8] = [
                noise[x - 1][y - 1], //Upper left
                noise[x][y - 1],     //Upper mid
                noise[x + 1][y - 1], //Upper right
                noise[x - 1][y],     //Mid left
                noise[x + 1][y],     //Mid right
                noise[x - 1][y + 1], //Lower left
                noise[x][y + 1],     //Lower mid
                noise[x + 1][y + 1], //Lower right
            ];

            let mut count : u8 = 0;
            for i in 0..8 {
                count = if neighbors[i] == 1 { count + 1 } else { count }
            }

            noise[x][y] = if count > 4 {
                1
            } else if count < 4 {
                0
            } else {
                noise[x][y]
            }
        }
    }
}

fn white_noise() -> [[u8; HEIGHT]; WIDTH] {
    let mut grid = [[0 as u8; HEIGHT]; WIDTH];
    let mut rng: Pcg64 = Seeder::from(SEED).make_rng();

    for y in 0..HEIGHT {
        for x in 0..WIDTH {
            grid[x as usize][y as usize] = if x == 0 || y == 0 || x == WIDTH - 1 || y == HEIGHT - 1
            {
                1
            } else if rng.gen_range(0..101) > NOISE_AMOUNT {
                1
            } else {
                0
            }
        }
    }

    grid
}

fn grid_to_image(array: [[u8; HEIGHT]; WIDTH], name: &str) {
    let mut image: RgbImage = ImageBuffer::new(W, H);

    for x in 0..array.len() {
        for y in 0..array[x].len() {
            //*image.get_pixel_mut(x as u8, y as u8) = image::Rgb([x.try_into().unwrap(), y.try_into().unwrap(), 0]);
            *image.get_pixel_mut(x as u32, y as u32) = if array[x][y] == 1 {
                image::Rgb([0, 0, 0])
            } else if array[x][y] == 0 {
                image::Rgb([255, 255, 255])
            } else {
                image::Rgb([255, 0, 0])
            }
        }
    }

    image.save(name).unwrap();
}
