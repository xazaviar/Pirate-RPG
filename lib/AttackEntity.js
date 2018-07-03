const Entity2D = require('./Entity2D');
const Util = require('../shared/Util');

function AttackEntity(id, attack) {
  	Entity2D.call(this, [attack.location.x, attack.location.y], null, null, attack.orientation+(attack.motion.type=="jab"?attack.motion.angle:0), null, 1);
  	this.id = id;

  	//Stats
  	this.owner = attack.owner;
  	this.damage = attack.damage;
  	this.size = attack.size;
    this.weapon = attack.weapon;
    this.motion = attack.motion;
    this.attackForce = attack.attackForce;
    this.knockback = attack.knockback;

  	//Default
  	this.isDead = false;

    if(this.weapon=="bullet")
      this.pierced = 0;
}
Util.extend(AttackEntity, Entity2D);

AttackEntity.create = function(id, attack) {
  	return new AttackEntity(id, attack);
};

AttackEntity.prototype.update = function() {
  	this.parent.update.call(this);

  	//Update position
    if(this.motion.type=="bullet"){
      AttackEntity.bulletMotion(this);
    }
    else if(this.motion.type=="jab"){
      AttackEntity.jabMotion(this);
    }
    else if(this.motion.type=="sweep"){
      AttackEntity.sweepMotion(this);
    }	
};


AttackEntity.bulletMotion = function(ref){
  if(ref.distanceTravelled < ref.motion.range){
    ref.vy = ref.motion.speed * Math.sin(ref.orientation-Math.PI/2);
    ref.vx = ref.motion.speed * Math.cos(ref.orientation-Math.PI/2);
  }
  else{
    ref.isDead = true;
  }
}

AttackEntity.jabMotion = function(ref){
  ref.x += ref.owner.velocity[0]*ref.deltaTime;
  ref.y += ref.owner.velocity[1]*ref.deltaTime;

  if(ref.distanceTravelled < ref.motion.range){
    ref.vy = (ref.motion.speedF) * Math.sin(ref.orientation-Math.PI/2);
    ref.vx = (ref.motion.speedF) * Math.cos(ref.orientation-Math.PI/2);
  }
  else if(ref.distanceTravelled > ref.motion.range && ref.distanceTravelled < ref.motion.range*2){
    ref.vy = (-ref.motion.speedB) * Math.sin(ref.orientation-Math.PI/2);
    ref.vx = (-ref.motion.speedB) * Math.cos(ref.orientation-Math.PI/2);
  }
  else{
    ref.isDead = true;
  }
}

AttackEntity.sweepMotion = function(ref){
  if(!("curAngle" in ref)){
    ref.motion = {
      type: "sweep",
      speed: ref.motion.speed,
      start: ref.motion.start+ref.orientation,
      dist: ref.motion.dist,
      direction: ref.motion.direction
    };
    ref["curAngle"] = ref.motion.start;
  }

  if(ref.motion.direction == "left" && ref.curAngle > ref.motion.start-ref.motion.dist){
    //Move attack
    ref.curAngle -= ref.motion.speed * ref.deltaTime;

    //place attack
    ref.x = ref.owner.x + (2*ref.size.hei/3 * Math.cos(ref.curAngle-Math.PI/2));
    ref.y = ref.owner.y + (2*ref.size.hei/3 * Math.sin(ref.curAngle-Math.PI/2));
    ref.orientation = ref.curAngle;
  }
  else if(ref.motion.direction == "right" && ref.curAngle < ref.motion.start+ref.motion.dist){
    //Move attack
    ref.curAngle += ref.motion.speed * ref.deltaTime;

    //place attack
    ref.x = ref.owner.x + (2*ref.size.hei/3 * Math.cos(ref.curAngle-Math.PI/2));
    ref.y = ref.owner.y + (2*ref.size.hei/3 * Math.sin(ref.curAngle-Math.PI/2));
    ref.orientation = ref.curAngle;
  }
  else{
    ref.isDead = true;
  }
}



AttackEntity.prototype.isCollidedWith = function(entity){

	var rect = {
		x: this.x,
		y: this.y,
		w: this.size.wid,
		h: this.size.hei,
		deg: this.orientation
	}
	var circle = {
		x: entity.x,
		y: entity.y,
		r: entity.hitbox/2,
    orient: entity.orientation
	}

	return Util.rectCircleCollision(rect,circle);
}



AttackEntity.prototype.getIsDead = function(){
	return this.isDead;
}

AttackEntity.prototype.getID = function(){
	return this.id;
}

AttackEntity.prototype.getDamage = function(){
	return this.damage;
}

AttackEntity.prototype.getOwner = function(){
	return this.owner.getID();
}

AttackEntity.prototype.removable = function(){
  return this.weapon == "bullet" && this.pierced > this.motion.pierce;
}

AttackEntity.prototype.getAttackForce = function(){
  return this.attackForce;
}

AttackEntity.prototype.getKnockback = function(){
  return this.knockback;
}

AttackEntity.prototype.hitTarget = function(){
  if(this.weapon == "bullet")
    this.pierced++;
}

module.exports = AttackEntity;