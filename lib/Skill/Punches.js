const CombatStyle = require('./CombatStyle');
const Util = require('./../../shared/Util');

function Punches() {
	var lightAttack = {
		name: "Light Attack",
		energyUsage: 2,
		orientationLock: true,
		movementLock: false,
		specialMovement: null,

		sequence: [[
			{
				weapon: "punch",
				damage: 1.0,
				cooldown: 10,
				attackForce: 25,
				knockback: 0,
				size: {wid:8,hei:20},
				motion: {
					type: "jab",
					speedF: 200,
					speedB: 160,
					range: 20,
					angle: 0 * (Math.PI/180)
				}
			}
		]]
	};

	var heavyAttack = {
		name: "Heavy Attack",
		energyUsage: 5,
		orientationLock: true,
		movementLock: false,
		specialMovement: null,

		sequence: [[
			{
				weapon: "punch",
				damage: 1.5,
				cooldown: 16,
				attackForce: 25,
				knockback: 2,
				size: {wid:8,hei:20},
				motion: {
					type: "jab",
					speedF: 200,
					speedB: 80,
					range: 20,
					angle: 0 * (Math.PI/180)
				}
			}
		]]
	};

	var combos = [
		{name:"Uppercut",
		 steps:[
		 	{input:"L",end:false,attack:null},
		  	{input:"L",end:false,attack:null},
		  	{input:"H",end:true, attack:{
									name: "Uppercut",
									energyUsage: 15,
									orientationLock: true,
									movementLock: true,
									specialMovement: {
										mSpeed: 350,
										mDirection: "forward",
										distance: 35,
										rSpeed: 0 * (Math.PI/180),
										rDirection: "left",
										rotation: 0
									},

									sequence: [[
										{
											weapon: "punch",
											damage: 18,
											cooldown: 20,
											attackForce: 50,
											knockback: 15,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 200,
												speedB: 50,
												range: 20,
												angle: 0 * (Math.PI/180)
											}
										}
									]]
								}
			}
			]//End Steps
		}//End Uppercut
		,
		{name:"Quick Attack",
		 steps:[
		 	{input:"L",end:false,attack:null},
		  	{input:"L",end:false,attack:null},
		  	{input:"L",end:false,attack:null},
		  	{input:"L",end:false,attack:null},
		  	{input:"L",end:true,attack:{
									name: "Quick Attack",
									energyUsage: 15,
									orientationLock: true,
									movementLock: true,
									specialMovement: null,

									sequence: [[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: 0 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: 10 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: -20 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: 20 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: 0 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: -10 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: 20 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: -20 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: 0 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: 5 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: -10 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: 15 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 20,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: 0 * (Math.PI/180)
											}
										}
									],
									[
										{
											weapon: "punch",
											damage: 8,
											cooldown: 4,
											attackForce: 45,
											knockback: 1,
											size: {wid:8,hei:20},
											motion: {
												type: "jab",
												speedF: 300,
												speedB: 250,
												range: 22,
												angle: -5 * (Math.PI/180)
											}
										}
									]
									]//End Sequence
								}//End attack
			}
			]//End Steps
		}//End Quick Punch
	];//End combos

	CombatStyle.call(this,"punches",lightAttack,heavyAttack, 1.0, 100, combos);
}
Util.extend(Punches, CombatStyle);

Punches.create = function() {
  	return new Punches();
};

Punches.prototype.getAttack = function(type, queue, energy){
	return this.parent.getAttack.call(this,type,queue,energy);
}

Punches.prototype.minEnergy = function(type){
	return type=="L"?this.lightAttack.energyUsage:this.heavyAttack.energyUsage;
}

module.exports = Punches;