var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var HUD = function()
{
	this.image = document.createElement("img");
	this.image.src = "HUD!.png"
	context.drawImage(this.image, 100, 100);
	this.position = new Vector2();
	this.velocity = new Vector2();
}

//setting up delta time variables
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var LAYER_COUNT = 3;

//SET THESE TO HOW BIG YOUR MAP IS tw is width and th is height
var MAP = { tw:100, th:20 }; 

var TILE = 35;
var TILESET_TILE = 70;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;

var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;



var tileset = document.createElement("img");
tileset.src = "tileset.png";


var cells = [];

function initializeCollision()
{
	//loop through each layer
	for ( var layerIdx = 0 ; layerIdx < LAYER_COUNT ; ++layerIdx )
	{
		cells[layerIdx] = [];
		var idx = 0;
	
		//loop through each row
		for ( var y = 0 ; y < Level1.layers[layerIdx].height ; ++y)
		{
			cells[layerIdx][y] = [];
		
			//loop through each cell
			for ( var x = 0 ; x < Level1.layers[layerIdx].width ; ++x)
			{
				//if the tile for this cell is not empty
				if ( Level1.layers[layerIdx].data[idx] != 0 )
				{
					//set the 4 cells around it to be colliders
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y][x+1] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y-1][x] = 1;
				}
				
				//if the cell hasn't already been set to 1, set it to 0
				else if (cells[layerIdx][y][x] != 1 )
				{
					cells[layerIdx][y][x] = 0;
				}
				
				++idx;
			}
		}
	}
}

function tileToPixel(tile_coord)
{
	return tile_coord * TILE;
}

function pixelToTile(pixel)
{
	return Math.floor(pixel / TILE);
}


function cellAtTileCoord(layer, tx, ty)
{
	//if off the top, left or right of the map
	if ( tx < 0 || tx > MAP.tw || ty < 0 )
	{
		return 1;
	}
	
	//if off the bottom of the map
	if ( ty >= MAP.th )
	{
		return 0;
	};
	
	return cells[layer][ty][tx];
}

function cellAtPixelCoord(layer, x, y)
{
	var tx = pixelToTile(x);
	var ty = pixelToTile(y);
	
	return cellAtTileCoord(layer, tx, ty);
}

function drawMap()
{
	if (typeof(level2) === "undefined" )
	{
		alert("ADD 'level1' TO JSON FILE");
	}
	var startX = -1;
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
	var tileX = pixelToTile(player.position.x);
	var offsetX = TILE + Math.floor(player.position.x%TILE);

	startX = tileX - Math.floor(maxTiles / 2);

	 if(startX < -1)
	 {
		startX = 0;
		offsetX = 0;
	 }
	 if(startX > MAP.tw - maxTiles)
	 {
		startX = MAP.tw - maxTiles + 1;
		offsetX = TILE;
	 }
		worldOffsetX = startX * TILE + offsetX;



	//this loops over all the layers in our tilemap
	for (var layerIdx = 0 ; layerIdx < LAYER_COUNT ; ++layerIdx )
	{
		//render everything in the current layer (layerIdx)
		//look at every tile in the layer in turn, and render them.
		
		var idx = 0;
		//look at each row
		for (var y = 0 ; y < Level1.layers[layerIdx].height ; ++y)
		{
			//look at each tile in the row
			for ( var x = 0 ; x < Level1.layers[layerIdx].width ; ++x)
			{
				var tileIndex = Level1.layers[layerIdx].data[idx] - 1;
				
				//if there's actually a tile here
				if ( tileIndex != -1 )
				{
					//draw the current tile at the current location
					
					//where in the tilemap is the current tile?
					//where in the world should the current tile go?
					
					//source x in the tileset
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * 
												(TILESET_TILE + TILESET_SPACING);
					//source y in the tileset
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_X)) * 
												(TILESET_TILE + TILESET_SPACING);
					//destination x on the canvas
					var dx = x * TILE;
					//destination y on the canvas
					var dy = (y-1) * TILE;
					
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE,
							(x-startX)*TILE - offsetX, (y-1)*TILE, TILESET_TILE, TILESET_TILE);

				}
				
				++idx;
			}
		}
	}
}

var keyboard = new Keyboard();
var player = new Player();
var hud = new HUD();

var timer = 0;

var music = new Audio("background.ogg");
music.loop = true;

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	timer += deltaTime;
	
	drawMap();
	
	player.update(deltaTime);
	player.draw();
	
	context.fillStyle = "black";
	context.font = "64px MS Gothic";
	
	var timerSeconds = Math.floor(timer);
	var timerMilliseconds = Math.floor((timer - timerSeconds) * 1000);
	var textToDisplay = "Time: " + timerSeconds + ":" + timerMilliseconds;
	context.fillText(textToDisplay, canvas.width - 1700, 60);
	
	if (player.health <= 0 )
	{
		player.position.set (16, 25);
		player.health = 100;
	}
	
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
	
	music.play();
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	
	context.drawImage(hud.image, 0,0, 1200, 600);
}


initializeCollision();

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);