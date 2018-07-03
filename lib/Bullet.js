const Entity2D = require('./Entity2D');
const Util = require('../shared/Util');

function Bullet(id, location, orientation, owner, damage) {
  	Entity2D.call(this, [location.x, location.y], null, null, orientation, null, Bullet.HITBOX);
  	this.id = id;

  	//Stats
  	this.speed = 400;
  	this.travelled = 0;
  	this.isDead = false;
  	this.owner = owner;
  	this.damage = damage;
}
Util.extend(Bullet, Entity2D);

Bullet.HITBOX = 5;
Bullet.DISTANCE = 100;

Bullet.create = function(id, location, orientation, owner, damage) {
  	return new Bullet(id, location, orientation, owner, damage);
};


Bullet.prototype.update = function() {
  	this.parent.update.call(this);

  	//Update position
  	if(this.travelled < Bullet.DISTANCE){
  		this.vy = this.speed * Math.sin(this.orientation-Math.PI/2);
  		this.vx = this.speed * Math.cos(this.orientation-Math.PI/2);
  		this.travelled++;
  	}
  	else{
  		this.isDead = true;
  	}
};


Bullet.prototype.getIsDead = function(){
	return this.isDead;
}

Bullet.prototype.getID = function(){
	return this.id;
}

Bullet.prototype.getDamage = function(){
	return this.damage;
}

Bullet.prototype.getOwner = function(){
	return this.owner;
}



module.exports = Bullet;