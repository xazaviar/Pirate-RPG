const CombatStyle = require('./CombatStyle');
const Util = require('./../../shared/Util');

function Kicks() {
	var lightAttack = {
		name: "Light Attack",
		energyUsage: 5,
		orientationLock: true,
		movementLock: true,
		specialMovement: null,

		sequence: [[
			{
				weapon: "kick",
				damage: 10,
				cooldown: 16,
				attackForce: 50,
				knockback: 0,
				size: {wid:8,hei:25},
				motion: {
					type: "jab",
					speedF: 180,
					speedB: 120,
					range: 20,
					angle: 0 * (Math.PI/180)
				}
			}
		]]
	};

	var heavyAttack = {
		name: "Heavy Attack",
		energyUsage: 15,
		orientationLock: true,
		movementLock: true,
		specialMovement: null,

		sequence: [[
			{
				weapon: "kick",
				damage: 20,
				cooldown: 24,
				attackForce: 90,
				knockback: 5,
				size: {wid:8,hei:25},
				motion: {
					type: "sweep",
					speed:400 * (Math.PI/180),
					start:-60 * (Math.PI/180),
					dist: 120 * (Math.PI/180),
					direction: "right"
				}
			}
		]]
	};
	
	var combos = [
		{name:"Tornado",
		 steps:[
		 	{input:"H",end:false,attack:null},
		  	{input:"H",end:false,attack:{
									name: "Heavy Attack",
									energyUsage: 15,
									orientationLock: true,
									movementLock: true,
									specialMovement: null,

									sequence: [[
										{
											weapon: "kick",
											damage: 20,
											cooldown: 24,
											attackForce: 90,
											knockback: 5,
											size: {wid:8,hei:25},
											motion: {
												type: "sweep",
												speed:400 * (Math.PI/180),
												start: 60 * (Math.PI/180),
												dist: 120 * (Math.PI/180),
												direction: "left"
											}
										}
									]]
								}
			},
		  	{input:"H",end:true,attack:{
									name: "Tornado",
									energyUsage: 25,
									orientationLock: true,
									movementLock: true,
									specialMovement: {
										mSpeed: 0,
										mDirection: "forward",
										distance: 0,
										rSpeed: 80 * (Math.PI/180),
										rDirection: "right",
										rotation: 96
									},

									sequence: [[
										{
											weapon: "kick",
											damage: 25,
											cooldown: 70,
											attackForce: 120,
											knockback: 1,
											size: {wid:8,hei:25},
											motion: {
												type: "sweep",
												speed:600 * (Math.PI/180),
												start:  0 * (Math.PI/180),
												dist: 720 * (Math.PI/180),
												direction: "right"
											}
										},
										{
											weapon: "kick",
											damage: 25,
											cooldown: 1,
											attackForce: 120,
											knockback: 0,
											size: {wid:8,hei:25},
											motion: {
												type: "sweep",
												speed:600 * (Math.PI/180),
												start:180 * (Math.PI/180),
												dist: 720 * (Math.PI/180),
												direction: "right"
											}
										}
									]]
								}
		  	}
		  	]//End Steps
		}//End Tornado
		,
		{name:"Parage Shot",
		 steps:[
		 	{input:"L",end:false,attack:null},
		  	{input:"L",end:false,attack:null},
		  	{input:"L",end:false,attack:null},
		  	{input:"L",end:true,attack:{
									name: "Parage Shot",
									energyUsage: 15,
									orientationLock: true,
									movementLock: true,
									specialMovement: {
										mSpeed: 150,
										mDirection: "forward",
										distance: 100,
										rSpeed: 0 * (Math.PI/180),
										rDirection: "left",
										rotation: 0
									},

									sequence: [[
										{
											weapon: "kick",
											damage: 15,
											cooldown: 10,
											attackForce: 60,
											knockback: 50,
											size: {wid:8,hei:25},
											motion: {
												type: "jab",
												speedF: 240,
												speedB: 180,
												range: 20,
												angle: 0 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "kick",
											damage: 15,
											cooldown: 10,
											attackForce: 60,
											knockback: 50,
											size: {wid:8,hei:25},
											motion: {
												type: "jab",
												speedF: 240,
												speedB: 180,
												range: 20,
												angle: 0 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "kick",
											damage: 15,
											cooldown: 10,
											attackForce: 60,
											knockback: 50,
											size: {wid:8,hei:25},
											motion: {
												type: "jab",
												speedF: 240,
												speedB: 180,
												range: 20,
												angle: 0 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "kick",
											damage: 15,
											cooldown: 30,
											attackForce: 60,
											knockback: 0,
											size: {wid:8,hei:25},
											motion: {
												type: "jab",
												speedF: 240,
												speedB: 100,
												range: 20,
												angle: 0 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "kick",
											damage: 25,
											cooldown: 40,
											attackForce: 60,
											knockback: 150,
											size: {wid:8,hei:25},
											motion: {
												type: "jab",
												speedF: 400,
												speedB: 50,
												range: 20,
												angle: 0 * (Math.PI/180)
											}
										}
									],
									]//End Sequence
								}//End Attack
			}
			]//End Steps
		}//End Parage Shot
	];

	CombatStyle.call(this,"kicks",lightAttack,heavyAttack, 1.2,130,combos);
}
Util.extend(Kicks, CombatStyle);

Kicks.create = function() {
  	return new Kicks();
};

Kicks.prototype.getAttack = function(type, queue, energy){
	return this.parent.getAttack.call(this,type,queue,energy);
}

Kicks.prototype.minEnergy = function(type){
	return type=="L"?this.lightAttack.energyUsage:this.heavyAttack.energyUsage;
}

module.exports = Kicks;