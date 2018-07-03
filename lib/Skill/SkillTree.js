


function SkillTree(params){ 
	//Received Data
	this.name 	= params.name;
	this.type 	= params.type;
	this.tiers 	= params.tiers;

	//Base Stats
	if(this.type == "CombatMain"){
		this.baseSpeed 			= params.baseSpeed;
		this.baseAttack 		= params.baseAttack;
		this.baseBlockingForce  = params.baseBlockingForce;
	}

	//Saved Data
	this.level = 0;
	this.experience = 0;
	this.appliedSP = 0;
	this.tierNames = ["Novice","Apprentice","Adept","Expert","Master"];
	this.requirements = [
		{level:0, sp:0},
		{level:10, sp:11},
		{level:20, sp:22},
		{level:30, sp:33},
		{level:40, sp:44}
	];
}

SkillTree.prototype.increaseSkill = function(tier, skillID, trees){
	for(var s in tiers[tier]){
		if(tiers[tier][s].id == skillID){
			//Check prereqs
			if(hasPrereqs(trees)){
				tiers[tier][s].incrementSkill();
				this.appliedSP++;
			}

			break;
		}
	}
}


function hasPrereqs(trees){
	return true;
}

module.exports = SkillTree;