const CombatStyle = require('./CombatStyle');
const Util = require('./../../shared/Util');

function Mixed() {
	var lightAttack = {
		name: "Light Attack",
		energyUsage: 2,
		orientationLock: true,
		movementLock: false,
		specialMovement: null,

		sequence: [[
			{
				weapon: "punch",
				damage: 6,
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
												angle: -5 * (Math.PI/180)
											}
										}
									]
									]//End Sequence
								}//End attack
			}
			]//End Steps
		}//End Quick Punch
	];//End Combos
	
	CombatStyle.call(this,"mixed",lightAttack,heavyAttack,1.0, 100,combos);
}
Util.extend(Mixed, CombatStyle);

Mixed.create = function() {
  	return new Mixed();
};

Mixed.prototype.getAttack = function(type, queue, energy){
	return this.parent.getAttack.call(this,type,queue,energy);
}

Mixed.prototype.minEnergy = function(type){
	return type=="L"?this.lightAttack.energyUsage:this.heavyAttack.energyUsage;
}

module.exports = Mixed;