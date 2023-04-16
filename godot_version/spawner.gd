extends Node2D

@export var tile_scene: PackedScene
var width=512
var height=512
var image_res = 4
func spawn():
	for y in height:
		for x in width:
			var t = tile_scene.instantiate()
			var pos = (get_viewport_rect().size / 2) + Vector2(x * image_res, y * image_res) - Vector2(width * 0.5 * image_res - (image_res * 0.5), height * 0.5 * image_res - (image_res * 0.5))
			t.position = pos
			add_child(t)

# Called when the node enters the scene tree for the first time.
func _ready():
	spawn()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
