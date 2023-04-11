from PIL import Image
import random

WIDTH: int = 512 
HEIGHT: int = 512

img: Image = Image.new( mode = "RGB", size = (WIDTH, HEIGHT) )

pixels = img.load()
img_copy: Image = Image.new( mode = "RGB", size = (WIDTH, HEIGHT) )
pixels_copy = img_copy.load()

for x in range(WIDTH):
    for y in range(HEIGHT):
        color = (0, 0, 0) if random.randint(0, 99) < 60 else (255, 255, 255)
        pixels[x, y] = color
        # pixels[i, j] = (0, 0 ,0) if i % 2 == j % 2 else (255, 255, 255)

for x in range(WIDTH):
    for y in range(HEIGHT):
        if x == 0 or x == WIDTH - 1 or y == 0 or y == HEIGHT - 1:
            pixels[x, y] = (0, 0, 0)

for i in range(3):
    for x in range(WIDTH):
        for y in range(HEIGHT):
            if x > 0 and x < WIDTH - 1 and y > 0 and y < HEIGHT - 1:
                # neighboring coordinates shown with x
                # xxx
                # x.x
                # xxx
                neighbor_coords = [(x - 1, y + 1), (x, y + 1), (x + 1, y + 1), (x - 1, y), (x + 1, y), (x - 1, y - 1), (x, y - 1), (x + 1, y - 1)]
                neighbor_colors = [img.getpixel(neighbor_coords[i]) for i in range(8)]

                counter = 0
                for col in neighbor_colors:
                    if col == (0, 0, 0):
                        counter = counter + 1

                pixels_copy[x, y] = (0, 0, 0) if counter > 4 else (255, 255, 255)

    img = img_copy.copy()

img.show()
