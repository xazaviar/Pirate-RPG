const Entity2D = require('./Entity2D');
const Util = require('../shared/Util');

const CombatStyle = require('./Skill/CombatStyle');
const Punches = require('./Skill/Punches');
const Kicks = require('./Skill/Kicks');
const Mixed = require('./Skill/Mixed');
const Swords = require('./Skill/Swords');
const Ranged = require('./Skill/Ranged');

/**
 * Constructor for a Player
 * @constructor
 * @param {string} id The socket ID of the Player
 */
function Player(id, curMap, spawnCoords, instanceID, skillTrees, comboList) {
  	Entity2D.call(this, [spawnCoords.x, spawnCoords.y], null, null, null, null, Player.HITBOX);
  	this.id = id;


  	//Stats
  	this.hpMax 			= 200;
  	this.hp 			= this.hpMax;
  	this.energyMax 		= 100;
  	this.energy 		= this.energyMax;
  	this.speed 			= Player.BASESPEED;
  	this.defense 		= 0;
  	this.inCombathealthRegen = .01; //per .5 seconds
  	this.healthRegen 	= .05; 		//per .5 seconds
  	this.energyRegen 	= .01; 		//per .5 seconds
  	this.damage 		= 5;
  	this.accuracy 		= 1.0;
  	this.precision 		= .8;
  	this.critChance		= .05;
  	this.dodgeChance 	= .02;
  	this.attackPower	= 10;
  	this.blockPower		= 10;
  	this.damageRes		= 0;

  	//Equipment

  	//Skill Trees

  	//Weapon Sets
  	this.weapon = {
  		weapIndex: 0,
  		combatStyle: [Ranged.create(),Punches.create(),Kicks.create(),Mixed.create(),Swords.create()]
  	}
  	this.weaponType = this.weapon.combatStyle[this.weapon.weapIndex].type;
  	this.comboQueue = [];
  	this.clearComboQueueCooldown = 0;
  	this.queueClearFrames = 30;


  	//Status Flags
  	this.inCombat 				= false;
  	this.isDead 				= false;
  	this.requestRespawn 		= false;
  	this.isMoving 				= false;
  	this.inWater 				= false;
  	this.isDodging 				= false;
  	this.receivedInput			= false;
  	this.canChangeOrientation 	= true;
  	this.canMove 				= true;
  	this.unarmed				= true;


  	//Map
  	this.view = 450;
  	this.curMap = curMap;
  	this.mapInstanceID = instanceID;
  	this.entryMap = null;
  	this.saveMapExit = null;
  	this.spawn = {
  		id: curMap,
  		loc: spawnCoords
  	};

  	//Movement
  	this.orientation = 0;
  	this.dodgeCooldown = 0;
  	this.dodgeCooldownAmt = 30;
  	this.dodgeEnergyUsage = 25;
  	this.specialMovement = null;
  	this.SM_DistTraveled = 0;
  	this.SM_RotTraveled = 0;
  	this.knockback = null;
  	this.kbTravelled = 0;
  	this.inWaterSlow = .5;

  	this.dodgeAcc = true;
  	this.dodgeMod = 1.0;
  	this.dodgeInc = .5;
  	this.maxDodgeMod = 5.0;

  	//Collision		//w,s,a,d
  	this.canPress = {
  		up: true,
  		down: true,
  		left: true,
  		right: true
  	};

  	this.isBlocking = false;

  	//Cooldowns
  	this.attackCooldown = 0;
  	this.inCombatCooldown = 0;
  	this.inCombatCooldownMax = 10;

  	//Prev states
  	this.prevMouseLeft = false;
  	this.prevMouseRight = false;
  	this.prevSwitch = false;
  	this.prevDodge = false;

  	//Attack flags
  	this.activeAttack = null;
  	this.attackSequence = null;
  	this.invincibilityMaxFrames = 20;
  	this.invFrames = 0;
  	this.attackIndex = 0;

  	

  	//TESTING
  	this.frame = 0;
}
Util.extend(Player, Entity2D);

Player.HITBOX = 16;
Player.BASESPEED = 100;
Player.MAXSPEED = 500;

/**
 * Factory method for creating a Player
 * @param {string} id The socket ID of the Player
 * @return {Player}
 */
Player.create = function(id,curMap,spawnCoords,instanceID,skillTrees,comboList) {
  	
  	return new Player(id,curMap,spawnCoords,instanceID,skillTrees,comboList);
};

/**
 * Updates the Player based on received input.
 * @param {Object} keyboardState The keyboard input received.
 */
Player.prototype.updateOnInput = function(keyboardState, mouseState) {
	

	if(this.isDead && keyboardState.respawn){
		this.requestRespawn = true;
		this.receivedInput = true;
	}
	else if(!this.isDead && this.specialMovement==null && !this.isDodging && this.knockback == null){
		this.requestRespawn = false;

		//Check for blocking
	  	this.isBlocking = this.attackCooldown <= 0?keyboardState.block && !this.inWater:false;

	  	if(this.inWater){
	  		this.speed = Player.BASESPEED * this.inWaterSlow;
	  	}else{
	  		this.speed = Player.BASESPEED;
	  	}

	  	if(!this.isBlocking){
	  		var xMove = ((this.canPress.right?Number(keyboardState.right):0) - (this.canPress.left?Number(keyboardState.left):0));
	  		var yMove = ((this.canPress.down?Number(keyboardState.down):0) - (this.canPress.up?Number(keyboardState.up):0));

			if(this.speed > Player.MAXSPEED) this.speed = Player.MAXSPEED;

			//Update position
			if(this.canMove){
				this.vy = this.speed * this.weapon.combatStyle[this.weapon.weapIndex].mobilityMod * yMove;
		  		this.vx = this.speed * this.weapon.combatStyle[this.weapon.weapIndex].mobilityMod * xMove;
			}else{
				this.vx = 0;
				this.vy = 0;
			}
		  	

		  	if(yMove != 0 || xMove != 0 || this.attackCooldown > 0){
		  		this.receivedInput = true;
		  		this.isMoving = true;
		  	} 

	  		//Do action keys
		  	if(mouseState.left && !this.prevMouseLeft && !this.inWater){ //Light Attack
		  		this.receivedInput = true;
				this.isMoving = true;
		  		this.doAttack("L");
		  	}
		  	else if(mouseState.right && !this.prevMouseRight && !this.inWater){ //Heavy Attack
		  		this.receivedInput = true;
				this.isMoving = true;
		  		this.doAttack("H");
		  	}
	  	}
	  	else{
	  		this.receivedInput = true;
	  		this.isMoving = true;
			this.vx = 0;
			this.vy = 0;
		}

	  	//Update Orientation
	  	if(this.canChangeOrientation)
	  		this.orientation = Util.calculateAngle({x:this.x,y:this.y},{x:mouseState.x,y:mouseState.y});


	  	//Update WeaponSet
	  	if(keyboardState.switch && !this.prevSwitch){
	  		this.weapon.weapIndex = (this.weapon.weapIndex+1)%this.weapon.combatStyle.length;
				this.weaponType = this.weapon.combatStyle[this.weapon.weapIndex].type;
	  	}

	  	//See if can dodge
	  	if(this.attackCooldown <= 0 && keyboardState.dodge && !this.prevDodge && this.dodgeEnergyUsage <= this.energy && this.dodgeCooldown <= 0){
	  		this.isDodging = true;
	  		this.canChangeOrientation = false;
	  		this.invFrames = this.invincibilityMaxFrames*2;
	  		this.energy -= this.dodgeEnergyUsage;
	  		this.isBlocking = false;
	  	}

	  	//Update presses
	  	this.prevMouseLeft = mouseState.left;
	  	this.prevMouseRight = mouseState.right;
	  	this.prevSwitch = keyboardState.switch;	
	  	this.prevDodge = keyboardState.dodge;

  		// console.log(this.canPress);
	}
	else{
		this.requestRespawn = false;
	}
};

/**
 * Steps the Player forward in time and updates the internal position, velocity,
 * etc.
 */
Player.prototype.update = function() {
	//Special Movement Conditions
	if(!this.isDead){
		if(this.specialMovement!=null){
			this.inWater = false;
			this.isMoving = true;
			//Travel distance
			if(this.SM_DistTraveled < this.specialMovement.distance){
				this.vx = this.specialMovement.mSpeed * Math.cos(this.orientation-Math.PI/2)
				this.vy = this.specialMovement.mSpeed * Math.sin(this.orientation-Math.PI/2)

				this.SM_DistTraveled += Util.calculateDistance({x:this.vx,y:this.vy},{x:0,y:0}) * this.deltaTime;
			}
			else{
				this.vx = 0;
				this.vy = 0;
			}


			//Travel Rotation
			if(this.SM_RotTraveled < this.specialMovement.rotation){
				this.orientation += (this.specialMovement.rDirection=="left"?-1:1) * this.specialMovement.rSpeed;
				
				this.SM_RotTraveled += this.specialMovement.rSpeed;
			}


			//End condition
			if(this.SM_RotTraveled >= this.specialMovement.rotation && 
			   this.SM_DistTraveled >= this.specialMovement.distance){
				this.SM_RotTraveled = 0;
				this.SM_DistTraveled = 0;
				this.specialMovement = null;
			}
		}
		else if(this.isDodging){
			this.isMoving = true;

		  	if(this.inWater){
		  		this.speed = Player.BASESPEED * this.inWaterSlow;
		  	}else{
		  		this.speed = Player.BASESPEED;
		  	}

			if(this.speed > Player.MAXSPEED) this.speed = Player.MAXSPEED;

			//Move
			this.vy = this.speed * this.dodgeMod * this.weapon.combatStyle[this.weapon.weapIndex].mobilityMod * Math.sin(this.orientation-Math.PI/2);
		  	this.vx = this.speed * this.dodgeMod * this.weapon.combatStyle[this.weapon.weapIndex].mobilityMod * Math.cos(this.orientation-Math.PI/2);
			
		  	//Adjust speed
		  	if(this.dodgeMod <= 1.0 && !this.dodgeAcc){
		  		this.isDodging = false;
		  		this.canChangeOrientation = true;
		  		this.dodgeCooldown = this.dodgeCooldownAmt;
		  		this.dodgeAcc = true;
		  	}
		  	else if(this.dodgeMod >= this.maxDodgeMod){
		  		this.dodgeMod -= this.dodgeInc;
		  		this.dodgeAcc = false;
		  	}
		  	else if(this.dodgeMod < this.maxDodgeMod && this.dodgeAcc){
		  		this.dodgeMod += this.dodgeInc;
		  	}
		  	else if(this.dodgeMod < this.maxDodgeMod && !this.dodgeAcc){
		  		this.dodgeMod -= this.dodgeInc;
		  	}
		}
		else if(this.knockback != null){
			this.isMoving = true;

			//Move
			this.vy = this.knockback.speed * 15 * Math.sin(this.knockback.orientation-Math.PI/2);
		  	this.vx = this.knockback.speed * 15 * Math.cos(this.knockback.orientation-Math.PI/2);
		
		  	this.kbTravelled += Util.calculateDistance({x:this.vx,y:this.vy},{x:0,y:0}) * this.deltaTime;

		  	if(this.kbTravelled >= this.knockback.speed){
		  		this.kbTravelled = 0;
		  		this.knockback = null;
		  	}
		}
	}

	if(!this.isMoving){
		this.vx = 0;
		this.vy = 0;
	}

	//Make smarter
	this.vx = Math.min(this.vx,Player.MAXSPEED);
	this.vy = Math.min(this.vy,Player.MAXSPEED);

  	this.parent.update.call(this);

  	//Backup Check
  	if(this.hp <= 0){
		this.hp = 0;
		this.isDead = true;
  	}

  	//Update Cooldowns
  	if(!this.isDead){
	  	this.invFrames--;
	  	this.attackCooldown--;
	  	this.dodgeCooldown--;
	  	this.clearComboQueueCooldown--;

	  	//Check for next sequence attacks
	  	if(this.attackCooldown <= 0 && this.attackSequence!=null){
	  		this.attackCooldown = this.attackSequence[this.attackIndex][0].cooldown;
	  		this.activeAttack = [];
	  		for(var a = 0; a < this.attackSequence[this.attackIndex].length; a++){
	  			this.activeAttack.push({
					//Player Data
					location:{x:this.x, y:this.y},
					orientation: this.orientation,
					owner: this,

					//Weapon Data
					weapon: this.attackSequence[this.attackIndex][a].weapon,
					size: this.attackSequence[this.attackIndex][a].size,
					damage: this.damage * this.attackSequence[this.attackIndex][a].damage,
					motion: this.attackSequence[this.attackIndex][a].motion,
					attackForce: this.attackSequence[this.attackIndex][a].attackForce,
					knockback: {speed:this.attackSequence[this.attackIndex][a].knockback,
								orientation:this.orientation}
				});
	  		}
	  	}

	  	if(this.attackCooldown <= 0 && !this.isDodging){
	  		this.canMove = true;
	  		this.canChangeOrientation = true;
	  	} 

	  	if(this.clearComboQueueCooldown <= 0){
			this.comboQueue.length = 0;
	  	}
  	}
}

//This is called every .5 seconds
Player.prototype.constUpdate = function() {
	if(!this.isDead){
	  	this.inCombatCooldown--;
	  	if(this.inCombatCooldown <= 0) this.inCombat = false;

	  	if(this.specialMovement==null && !this.isDodging && this.knockback==null && !this.receivedInput)
  			this.isMoving = false;
  		this.receivedInput = false;

	  	this.hp+=this.hpMax*(this.inCombat?this.inCombathealthRegen:this.healthRegen);
	  	if(this.hp>this.hpMax) this.hp = this.hpMax;

		this.energy+=this.energyMax*(this.isMoving?this.energyRegen:this.energyRegen*2);
	  	if(this.energy>this.energyMax) this.energy = this.energyMax;
	}
}

Player.prototype.isCollidedWith = function(other) {
  	
  	return this.parent.isCollidedWith.call(this, other);
}

Player.prototype.doAttack = function(type) { 
	if(this.attackCooldown <= 0 && this.weapon.combatStyle[this.weapon.weapIndex].minEnergy(type) <= this.energy){
		this.inCombat = true;
		this.inCombatCooldown = this.inCombatCooldownMax;
		var attack = this.weapon.combatStyle[this.weapon.weapIndex].getAttack(type, this.comboQueue, this.energy);

		if(attack!=null && attack.energyUsage <= this.energy){ //backup check, not needed (ranged attacks maybe)
	  		this.energy -= attack.energyUsage;
	  		this.canChangeOrientation = !attack.orientationLock;
			this.canMove = !attack.movementLock;
	  		this.specialMovement = attack.specialMovement;
	  		this.attackIndex = 0;
	  		this.attackSequence = attack.sequence;
			this.clearComboQueueCooldown = attack.sequence[this.attackIndex][0].cooldown+this.queueClearFrames;
  			


	  		this.attackCooldown = this.attackSequence[this.attackIndex][0].cooldown;
	  		this.activeAttack = [];
	  		for(var a = 0; a < this.attackSequence[this.attackIndex].length; a++){
	  			this.activeAttack.push({
					//Player Data
					location:{x:this.x, y:this.y},
					orientation: this.orientation,
					owner: this,

					//Weapon Data
					weapon: this.attackSequence[this.attackIndex][a].weapon,
					size: this.attackSequence[this.attackIndex][a].size,
					damage: this.damage * this.attackSequence[this.attackIndex][a].damage,
					motion: this.attackSequence[this.attackIndex][a].motion,
					attackForce: this.attackSequence[this.attackIndex][a].attackForce,
					knockback: {speed:this.attackSequence[this.attackIndex][a].knockback,
								orientation:this.orientation}
				});
	  		}
		}
	}	
}

Player.prototype.takeDamage = function(damage, attackForce, blocked, kb){
	if(this.invFrames <= 0){
		this.inCombat = true;
		this.inCombatCooldown = this.inCombatCooldownMax;

		if(blocked){
			if(attackForce >= this.weapon.combatStyle[this.weapon.weapIndex].blockForce){
				//BLOCK BREAK
				this.hp -= damage;

				if(kb.speed > 0)
					this.knockback = kb;
			}
			else if((1.0*attackForce/this.weapon.combatStyle[this.weapon.weapIndex].blockForce) > .5){
				this.hp -= Math.max(parseInt(damage/2),1);

				if(kb.speed > 0)
					this.knockback = {speed:kb.speed/2,orientation:kb.orientation};
			}
			else{
				this.hp -= Math.max(parseInt(damage/4),1);
				if(kb.speed > 0)
					this.knockback = {speed:kb.speed/4,orientation:kb.orientation};
			}
		}
		else{
			this.hp -= damage;
			if(kb.speed > 0)
				this.knockback = kb;
		}
		this.invFrames = this.invincibilityMaxFrames;
	}

	if(this.hp <= 0){
		this.hp = 0;
		this.isDead = true;
	}
}

//*******************************************************************************
//Accessors
//*******************************************************************************
Player.prototype.getAttack = function() {
	return this.activeAttack;
}

Player.prototype.gotAttack = function() { 
	this.attackIndex++;
	this.activeAttack = null;

	//Clear sequence when last attacks are grabbed
	if(this.attackIndex >= this.attackSequence.length)
		this.attackSequence = null;
}

Player.prototype.newAttack = function(){
	return this.activeAttack != null;
}

Player.prototype.getX = function(){
	return this.x;
}

Player.prototype.getY = function(){
	return this.y;
}

Player.prototype.getOrientation = function(){
	return this.orientation;
}

Player.prototype.getID = function(){
	return this.id;
}

Player.prototype.getIsDead = function(){
	return this.isDead;
}

Player.prototype.getIsBlocking = function(){
	return this.isBlocking;
}

Player.prototype.isInvincible = function(){
	return this.invFrames > 0;
}

Player.prototype.getDeltaTime = function(){
	return this.deltaTime;
}

Player.prototype.isInWater = function(status){
	this.inWater = status;
}

//Map Functions
//***********************************************************************
Player.prototype.currentMap = function(){
	return this.curMap;
}

Player.prototype.leavingMap = function(){
	return this.entryMap != null;
}

Player.prototype.leftMap = function(instanceID, spawnCoords){
	this.mapInstanceID = instanceID;
	this.curMap = this.entryMap.id;
	this.x = this.entryMap.loc.x;
	this.y = this.entryMap.loc.y;
	this.vx = 0;
	this.vy = 0;

	//Check if need to set new spawn
	if(spawnCoords){
		this.spawn = {
			id: this.entryMap.id,
  			loc: spawnCoords
		};
	}
	this.entryMap = null;
}

Player.prototype.getEntryMap = function(){
	return this.entryMap;
}

Player.prototype.enteredExit = function(targetMap, coords, saveExit, useExit){
	this.entryMap = {
		id: targetMap,
		loc: useExit?this.saveMapExit:coords
	};

	if(useExit) this.saveMapExit = null;

	if(saveExit)
		this.saveMapExit = {x: this.x, y: this.y};
}


//Respawn Functions
//***********************************************************************
Player.prototype.respawning = function(){
	return this.requestRespawn;
}

Player.prototype.getSpawn = function(){
	return this.spawn;
}

Player.prototype.respawned = function(instanceID){
	//Location Change
	this.mapInstanceID = instanceID;
	this.curMap = this.spawn.id;
	this.x = this.spawn.loc.x;
	this.y = this.spawn.loc.y;
	this.vx = 0;
	this.vy = 0;

	//Stats Change
	this.hp = this.hpMax;
	this.energy = this.energyMax/4;
	this.invFrames = 100; //TO BE DETERMINED (do actual seconds)
	this.isDead = false;
}

module.exports = Player;
