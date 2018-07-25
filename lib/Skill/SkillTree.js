
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
	this.level = Math.floor(Math.random()*50);
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
	this.appliedSP = 0;
	this.maxAppliedSP = 0;
	for(var tier in this.tiers){
		for(var s in this.tiers[tier]){
			this.maxAppliedSP+=this.tiers[tier][s].levels;
		}
	}
}

SkillTree.prototype.increaseSkill = function(skillID, trees){
	for(var tier in this.tiers){
		for(var s in this.tiers[tier]){
			if(this.tiers[tier][s].id == skillID){
				//Check prereqs
				if(hasPrereqs(trees) && this.tiers[tier][s].canIncrementSkill()){
					this.tiers[tier][s].incrementSkill();
					this.appliedSP++;

					if(this.tiers[tier][s].type == "combo" && this.tiers[tier][s].subtype != "upgrade"){
						//Check combo list
						var existing = false;
						for(var c in this.comboList){
							if(this.comboList[c].id == this.tiers[tier][s].comboID){
								this.comboList[c] = this.tiers[tier][s].curSkill;
								existing = true;
								break;
							}
						}

						if(!existing){
							this.comboList.push(this.tiers[tier][s].curSkill);
						}
					}
					else if(this.tiers[tier][s].type == "combo" && this.tiers[tier][s].subtype == "upgrade"){

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

function hasPrereqs(trees){
	return true;
}

module.exports = SkillTree;