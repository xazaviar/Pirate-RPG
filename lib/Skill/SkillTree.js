const Util = require('../../shared/Util');

function SkillTree(params){ 
	//Received Data
	this.name 			= params.name;
	this.desc			= params.desc;
	this.type 			= params.type;
	this.tiers 			= params.tiers;
	this.comboListOpt	= params.comboList;
	this.comboList 		= [];

	//Base Stats
	if(this.type == "CombatMain"){
		this.baseSpeed 			= params.baseSpeed;
		this.baseDamage 		= params.baseDamage;
		this.baseBlockingForce  = params.baseBlockingForce;
	}

	//Saved Data
	this.level = 50;//Math.floor(Math.random()*50);
	this.maxLevel = 50;
	this.experience = Math.floor(Math.random()*100);
	this.experienceNeed = 100;
	this.tierNames = ["Novice","Apprentice","Adept","Expert","Master"];
	this.requirements = [
		{level:0, sp:0},
		{level:10, sp:11},
		{level:20, sp:22},
		{level:30, sp:33},
		{level:40, sp:44}
	];
	this.appliedSP = this.type=="CombatMain"?2:0;
	this.maxAppliedSP = 0;
	for(var tier in this.tiers){
		for(var s in this.tiers[tier]){
			this.maxAppliedSP += this.tiers[tier][s].maxLevels; //NEED TO FIX
		}
	}
}

SkillTree.prototype.increaseSkill = function(skillID, trees){
	for(var tier in this.tiers){
		for(var s in this.tiers[tier]){
			if(this.tiers[tier][s].id == skillID){
				var skill = this.tiers[tier][s];
				
				//Check reqs and prereqs
				var metReqs = this.level >= this.requirements[tier].level && this.appliedSP >= this.requirements[tier].sp;
				if(Util.hasPrereqs(skill, trees) && skill.canIncrementSkill() && metReqs || true){
					skill.incrementSkill();
					this.appliedSP++;

					if(skill.type == "combo" && skill.subtype == null){
						//Check combo list
						var existing = false;
						for(var c in this.comboList){
							if(this.comboList[c].id == skill.comboID){
								this.comboList[c] = skill.curSkill;
								existing = true;
								break;
							}
						}

						if(!existing){
							this.comboList.push(skill.curSkill);
						}
					}
					else if(skill.type == "combo" && skill.subtype == "finisher"){
						for(var c in this.comboList){
							if(this.comboList[c].id == skill.comboID){
								var last = this.comboList[c].steps[this.comboList[c].steps.length-1];

								if(last.attack.name != skill.curSkill.attack.name){
									//New finisher
									last.end = false;
									this.comboList[c].steps.push(skill.curSkill);
								}
								else
									last = skill.curSkill;
								
								break;
							}
						}
					}
				} else return false;

				return true;
			}
		}
	}
}

SkillTree.prototype.getAttacks = function(){
	if(this.type != "CombatMain"){
		return []; //did something wrong
	}
	else{
		var light = null, heavy = null;
		for(var s in this.tiers[0]){
			var skill = this.tiers[0][s];

			if(skill.type == "attack" && skill.subtype == "light"){
				light = skill.curSkill;
			}
			else if(skill.type == "attack" && skill.subtype == "heavy"){
				heavy = skill.curSkill;
			}

			if(light && heavy) break;
		}

		return [light, heavy];
	}
}

module.exports = SkillTree;