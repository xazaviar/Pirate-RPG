
function Skill(params){ 

	//Received Data
	this.id 		= params.id;
	this.name 		= params.name;
	this.type 		= params.type;
	this.subtype	= params.subtype;
	this.desc		= params.desc;
	this.prereq 	= params.prereq;
	this.levels 	= params.levels;

	//To figure out
	this.base		= params.base;
	this.increase 	= params.increase;

	//Tracking data
	this.level = 0;
	this.curSkill = this.base;
}

Skill.prototype.incrementSkill = function(){
	if(this.level < this.levels){
		this.level++;

		//Increase skill

	}
}

Skill.prototype.reset = function(){
	this.curSkill = this.base;
	this.level = 0;
}


module.exports = Skill;