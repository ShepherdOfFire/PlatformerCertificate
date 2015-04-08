var Player = function()
{
	this.image = document.createElement("img");
	this.position = new Vector2;
	this.position.set( 1*TILE, 0*TILE);
	
	this.width = 159;
	this.height = 163;
	
	this.velocity = new Vector2();

	this.angularVelocity = 0;
	
	this.rotation = 0;
	
	this.image.src = "hero.png";
};

Player.prototype.update = function(deltaTime)
{


	var acceleration = new Vector2();
	var playerAccel = 20
	var playerDrag = 20;
	var playerGravity = TILE * 9.8 * 6

	if ( keyboard.isKeyDown(keyboard.KEY_LEFT) )
	{
		acceleration.x -= playerAccel
	}
	if ( keyboard.isKeyDown(keyboard.KEY_RIGHT) )
	{
		acceleration.x + playerAccel
	}
	if ( keyboard.isKeyDown(keyboard.KEY_UP) )
	{
		acceleration.y -= playerAccel
	}

	if ( keyboard.isKeyDown(keyboard.KEY_DOWN) )
	{
		acceleration.y += playerAccel
	}	

	if (keyboard.isKeyDown(Keyboard.KEY_SPACE) )
	{
		this.rotation += deltaTime; 
	}
	else
	{
		this.rotation -= deltaTime;
	}

		
	var nx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);

	var nx = this.position.x % TILE;
	var ny = this.position.y % TILE;
		
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);


	//ACTUAL COLLISION
		if( this.velocity.y > 0 )
		{
				if ( (cell_down && !cell) || (cell_diag && !cell_right && nx) )
				{
					this.position.y = yileToPixel(ty);
					this.velocity.y = 0;
				
					cell = cell_down;
					cell_right = cell_diag;
					cell_down = getCellAtTileCoord(tx, ty+2);
					cell_diag = getCellAtTileCoord(tx+1, ty+2);
					ny = 0;
				}
			
			
			}

	}

	if (this.velocity.x > 0 )//if we are moving right
	{
		if ( (cell_right && !cell) || ( cell_diag && !cell_down && ny) )
		{
			this.position.x = tileToPixel(tx);
			this.velocity,x = 0;
		}
	}
	else if (this.velocity.x < 0)// if we are moving left
	{
		if ( (cell && !cell_right) ||(cell_down && !cell_diag && ny) )
		{
			this.position.x = tileToPixel(tx+1);
			this.velocity.x = 0;
		}
	}
	
	

Player.prototype.draw = function()
{
	context.save();
		
		context.translate( Vector2.x, Vector2.y );
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}
Player.prototype.draw = function()
{
	context.save();
		
		context.translate( Vector2.x, Vector2.y );
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}