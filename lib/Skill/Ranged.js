const CombatStyle = require('./CombatStyle');
const Util = require('./../../shared/Util');

function Ranged() {
	var lightAttack = {
		name: "Light Attack",
		energyUsage: 1,
		orientationLock: false,
		movementLock: false,
		specialMovement: null,

		sequence: [[
			{
				weapon: "bullet",
				damage: 8,
				cooldown: 17,
				attackForce: 80,
				knockback: 0,
				size: {wid:3,hei:5},
				motion: {
					type: "bullet",
					speed: 400,
					range: 400,
					pierce: 0
				}
			}
		]]
	};

	var heavyAttack = null;
	var combos = [];

	// {
	// 	weapon: "bullet",
	// 	orientationLock: false,
	// 	movementLock: false,
	// 	cooldown: 100,
	// 	damage: 20,
	// 	energyUsage: 15,
	// 	size: {wid:30,hei:5},
	// 	motion: {
	// 		type: "bullet",
	// 		speed: 250,
	// 		range: 200
	// 	}
	// };

	CombatStyle.call(this,"ranged",lightAttack,heavyAttack, 0.9,50,combos);
}
Util.extend(Ranged, CombatStyle);

Ranged.create = function() {
  	return new Ranged();
};

Ranged.prototype.getAttack = function(type, queue, energy){
	return this.parent.getAttack.call(this,type,queue,energy);
}

Ranged.prototype.minEnergy = function(type){
	return type=="L"?this.lightAttack.energyUsage:1000;
}

module.exports = Ranged;