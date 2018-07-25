const CombatStyle = require('./CombatStyle');
const Util = require('./../../shared/Util');

function Swords() {
	var lightAttack = {
		name: "Light Attack",
		energyUsage: 13,
		orientationLock: true,
		movementLock: false,
		specialMovement: null,

		sequence: [[
			{
				weapon: "sword",
				damage: 20,
				cooldown: 24,
				attackForce: 100,
				knockback: 5,
				size: {wid:9,hei:40},
				motion: {
					type: "sweep",
					speed:350 * (Math.PI/180),
					start: 75 * (Math.PI/180),
					dist: 150 * (Math.PI/180),
					direction: "left"
				}
			}
		]]
	};

	var heavyAttack = {
		name: "Heavy Attack",
		energyUsage: 25,
		orientationLock: true,
		movementLock: false,
		specialMovement: null,
		
		sequence: [[
			{
				weapon: "sword",
				damage: 25,
				cooldown: 35,
				attackForce: 130,
				knockback: 5,
				size: {wid:9,hei:40},
				motion: {
					type: "sweep",
					speed:200 * (Math.PI/180),
					start:-60 * (Math.PI/180),
					dist: 120 * (Math.PI/180),
					direction: "right"
				}
			}
		]]
	};

	var combos = [
		{name:"Charge",
		 steps:[
		 	{input:"H",end:false,attack:null},
		  	{input:"H",end:false,attack:{
									name: "Heavy Attack",
									energyUsage: 25,
									orientationLock: true,
									movementLock: false,
									specialMovement: null,
									
									sequence: [[
										{
											weapon: "sword",
											damage: 25,
											cooldown: 35,
											attackForce: 130,
											knockback: 5,
											size: {wid:9,hei:40},
											motion: {
												type: "sweep",
												speed:200 * (Math.PI/180),
												start: 60 * (Math.PI/180),
												dist: 120 * (Math.PI/180),
												direction: "left"
											}
										}
									]]
								}
			},
		  	{input:"L",end:true,attack:{
		  							name: "Charge",
									energyUsage: 25,
									orientationLock: true,
									movementLock: false,
									specialMovement: {
										mSpeed: 400,
										mDirection: "forward",
										distance: 200,
										rSpeed: 0 * (Math.PI/180),
										rDirection: "left",
										rotation: 0
									},
									
									sequence: [[
										{
											weapon: "sword",
											damage: 45,
											cooldown: 40,
											attackForce: 200,
											knockback: 130,
											size: {wid:9,hei:40},
											motion: {
												type: "jab",
												speedF: 400,
												speedB: 60,
												range: 25,
												angle: 0 * (Math.PI/180)
											}
										}
									]]
								}
			}
			]//End Steps
		}//End Charge
		,
		{name:"Pound Cannon",
		 steps:[
		 	{input:"L",end:false,attack:null},
		  	{input:"L",end:false,attack:{
									name: "Light Attack",
									energyUsage: 13,
									orientationLock: true,
									movementLock: false,
									specialMovement: null,

									sequence: [[
										{
											weapon: "sword",
											damage: 20,
											cooldown: 24,
											attackForce: 100,
											knockback: 5,
											size: {wid:9,hei:40},
											motion: {
												type: "sweep",
												speed:350 * (Math.PI/180),
												start:-75 * (Math.PI/180),
												dist: 150 * (Math.PI/180),
												direction: "right"
											}
										}
									]]
								}
			},
		  	{input:"L",end:false,attack:null},
		  	{input:"H",end:true,attack:{
		  							name: "Heavy Attack",
									energyUsage: 25,
									orientationLock: true,
									movementLock: false,
									specialMovement: null,
									
									sequence: [[
										{
											weapon: "sword",
											damage: 35,
											cooldown: 35,
											attackForce: 130,
											knockback: 10,
											size: {wid:9,hei:40},
											motion: {
												type: "sweep",
												speed:200 * (Math.PI/180),
												start:-60 * (Math.PI/180),
												dist: 120 * (Math.PI/180),
												direction: "right"
											}
										},
										{
											weapon: "bullet",
											damage: 25,
											cooldown: 35,
											attackForce: 130,
											knockback: 25,
											size: {wid:60,hei:3},
											motion: {
												type: "bullet",
												speed: 400,
												range: 400,
												pierce: 2
											}
										}
									]]
								}
			}
			] //End steps
		}//End Pound Cannon
	];//End combos

	CombatStyle.call(this,"swords",lightAttack,heavyAttack, 0.7,180,combos);
}
Util.extend(Swords, CombatStyle);

Swords.create = function() {
  	return new Swords();
};

Swords.prototype.getAttack = function(type, queue, energy){
	return this.parent.getAttack.call(this,type,queue,energy);
}

Swords.prototype.minEnergy = function(type){
	return type=="L"?this.lightAttack.energyUsage:this.heavyAttack.energyUsage;
}

module.exports = Swords;