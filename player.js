var LEFT = 0;
var RIGHT = 1;
var	ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;

var ANIM_MAX = 6;

var Player = function()
{
	this.sprite = new Sprite("ChuckNorris.png");
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[0,1,2,3,4,5,6,7]);//left idle animation
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[8,9,10,11,12]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[13,14,15,16,17,18,19,20,21,22,23,24,25,26]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[52,53,54,55,56,57,58,59]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[60,61,62,63,64]);
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[65,66,67,68,69,70,71,72,73,74,75,76,77,78]);
	
	for ( var i = 0 ; i < ANIM_MAX ; ++i)
	{
		this.sprite.setAnimationOffset(i, -55, -87);

	}
		
	this.position = new Vector2();
	this.position.set( 100, 100);
	
	this.velocity = new Vector2();
	
	this.health = 100;
	
	this.width = 159;
	this.height = 163;
	this.falling = false;
	this.jumping = false;
	this.angularVelocity = 0;
	this.rotation = 0;
};

Player.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);

	var acceleration = new Vector2();
	var playerAccel = 6000;
	var jumpForce = 50000;
	var playerDrag = 12;
	var playerGravity = TILE * 9.8 * 6;
	
	acceleration.y = playerGravity;
	
	if ( keyboard.isKeyDown(keyboard.KEY_LEFT) )
	{
		this.direction = LEFT;
		
		if(this.sprite.currentAnimation != ANIM_WALK_LEFT && !this.jumping)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
			
		acceleration.x -= playerAccel;
	}
	else if ( keyboard.isKeyDown(keyboard.KEY_RIGHT) )
	{
		this.direction = RIGHT;
		if(this.sprite.currentAnimation != ANIM_WALK_RIGHT && !this.jumping)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
			
		acceleration.x += playerAccel;
	}
	else if(this.jumping == false && this.falling == false)
	{
		if(this.direction == LEFT)
		{
			if(this.sprite.currentAnimation != ANIM_IDLE_LEFT)
				this.sprite.setAnimation(ANIM_IDLE_LEFT);
		}
		else
		{
			if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
				this.sprite.setAnimation(ANIM_IDLE_RIGHT);
		}
	}

	if (this.velocity.y > 0)
	{
		this.falling = true;
	}
	else
	{
		this.falling = false;
	}
	if (keyboard.isKeyDown(keyboard.KEY_SPACE) && !this.jumping && !this.falling )
	{
	
		acceleration.y -= jumpForce
		this.jumping = true;
	}
	
	if ( this.jumping || this.falling )
	{
		if(this.direction == LEFT && this.sprite.currentAnimation != ANIM_JUMP_LEFT)
			this.sprite.setAnimation(ANIM_JUMP_LEFT)
		else if (this.direction == RIGHT && this.sprite.currentAnimation != ANIM_JUMP_RIGHT)
			this.sprite.setAnimation(ANIM_JUMP_RIGHT)
	}

	
	var dragVector = this.velocity.multiplyScalar(playerDrag);
	dragVector.y = 0;
	acceleration = acceleration.subtract(dragVector);
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	/*
	var collisionOffset = new Vector2();
	collisionOffset.set(-TILE/2,)
	*/
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	
	var nx = this.position.x % TILE;
	var ny = this.position.y % TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);
	
	//ACTUAL COLLISION!
	if ( this.velocity.y > 0 ) //if moving down
	{
		if ( (cell_down && !cell) || (cell_diag && !cell_right && nx) )
		{
			this.position.y = tileToPixel(ty);
			this.jumping = false;
			this.falling = false;
			this.velocity.y = 0;
			ny = 0;
		}
	}
	else if (this.velocity.y < 0 ) //if moving up
	{
		if ( (cell && !cell_down) || (cell_right && !cell_diag && nx) )
		{
			this.position.y =  tileToPixel(ty + 1);
			this.velocity.y = 0;
			
			cell = cell_down;
			cell_right = cell_diag;
			
			cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+2);
			cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+2);
			
			ny = 0;
		}
	}
	
	if (this.velocity.x > 0 )//if we're moving right
	{
		if ( (cell_right && !cell) || (cell_diag && !cell_down && ny) )
		{
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;
		}
	}
	else if (this.velocity.x < 0) //if we're moving left
	{
		if ( (cell && !cell_right) || (cell_down && !cell_diag && ny) )
		{
			this.position.x = tileToPixel(tx+1);
			this.velocity.x = 0;
		}
	}
}

Player.prototype.draw = function()
{
	var tileX = pixelToTile(player.position.x);
	var offsetX = TILE + Math.floor(player.position.x%TILE);
	
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
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
	this.sprite.draw(context, this.position.x- worldOffsetX, this.position.y);

	context.fillStyle = "black";
	context.font = "64px MS Gothic";
	var textToDisplay = "HP: " + this.health;
	context.fillText(textToDisplay, canvas.width - 1300,60)
};







