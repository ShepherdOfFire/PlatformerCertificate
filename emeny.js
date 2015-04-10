var enemy = function()
{
	this.image = document.createElement("img");
	this.src = "enemy.png"
	
	this.width = 220;
	this.height = 165;
	
	this.position = new Vector2();
	this.velocity = new Vector2();
	
}
enemy.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var enemyAccel = 4;
	var enemyDrag = 10;
	
	if ( this.direction == RIGHT)
	{
		acceleration.x = enemyAccel;
	}
	else
	{
		acceleration.x = -enemyAccel;
	}
	
	var dragX = this.velocity.x * enemyDrag;
	acceleration.x -= dragX;
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
}
	
enemy.prototype.draw = function(offsetX,offsetY)
{
	context.drawImage(this.image, this.position.x, 
						this.position.y, this.width, this.height);
}
