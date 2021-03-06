
function Skill(params){ 

	//Received Data
	this.id 		= params.id;
	this.name 		= params.name;
	this.type 		= params.type;
	this.subtype	= params.subtype;
	this.desc		= params.desc;
	this.prereq 	= params.prereq;
	this.maxLevels 	= params.maxLevels;
	this.upgrade 	= JSON.parse(JSON.stringify(params.upgrade));
	if(params.base.hasOwnProperty("buffs")){
		//save buff class
		var tempB = params.base.buffs;
		this.base = JSON.parse(JSON.stringify(params.base));
		this.base.buffs = tempB;
	}else
		this.base = JSON.parse(JSON.stringify(params.base));

	//Tracking data
	this.level = params.level;
	this.curSkill = this.level>0?this.base:null;

	this.cooldown = 0;
	this.cooldownMax = 1; //temp value
}

Skill.prototype.incrementSkill = function(){
	if(this.level < this.maxLevels){
		this.level++;

		if(this.level == 1){
			//Establish Skill
			this.curSkill = this.base;
		}
		else{
			//Increase skill
			var keys = Object.keys(this.upgrade);
			for(var k in keys){
				if(this.type == "passive" || (this.type == "active" && this.subtype == "stance")){
					var props = Object.keys(this.curSkill);
					for(var p in props){
						if(props[p] == keys[k]){
							this.curSkill[""+props[p]] += this.upgrade[""+keys[k]];
						}
					}
				}
				else if(this.type == "attack"){
					if(keys[k] == "damage") this.curSkill.sequence[0][0].damage += this.upgrade[""+keys[k]];
					else if(keys[k] == "cooldown") this.curSkill.sequence[0][0].cooldown += this.upgrade[""+keys[k]];
					else if(keys[k] == "energyUsage") this.curSkill.energyUsage += this.upgrade[""+keys[k]];
				}
				else if(this.type == "combo" && this.subtype == null){
					for(var s in this.curSkill.steps){
				        var step = this.curSkill.steps[s];
				        if(step.attack!=null && step.attack.name == this.curSkill.name){
				            //In main combo
				            if(keys[k] == "energyUsage")
				            	step.attack.energyUsage += this.upgrade[""+keys[k]];


				            if(keys[k] == "damage"){
					            for(var stage in step.attack.sequence){ //phase of attack
					                for(var a in step.attack.sequence[stage]){ //Attacks
					                    step.attack.sequence[stage][a].damage += this.upgrade[""+keys[k]];
					                }
					            }
				            }
				            break;
				        }//Close main combo check
				    }//Close step checks
				}
				else if(this.type == "combo" && this.subtype == "finisher"){
					if(keys[k] == "energyUsage")
		            	this.curSkill.attack.energyUsage += this.upgrade[""+keys[k]];


		            if(keys[k] == "damage" || keys[k] == "cooldown" || keys[k] == "knockback"){
		            	var last = null;
			            for(var stage in this.curSkill.attack.sequence){ //phase of attack
			                for(var a in this.curSkill.attack.sequence[stage]){ //Attacks
			                	var last = this.curSkill.attack.sequence[stage][a];
			                    if(keys[k] == "damage") this.curSkill.attack.sequence[stage][a].damage += this.upgrade[""+keys[k]];
			                }
			            }

			            if(keys[k] == "knockback") last.knockback+= this.upgrade[""+keys[k]];
			            if(keys[k] == "cooldown") last.cooldown += this.upgrade[""+keys[k]];
		            }
				}
			}
		}

	}
}

Skill.prototype.canIncrementSkill = function(){
	return this.level < this.maxLevels;
}

Skill.prototype.reset = function(){
	this.curSkill = this.base;
	this.level = 0;
}



//Skill Cooldowns
Skill.prototype.onCooldown = function(){

	return this.cooldown > 0;
}

Skill.prototype.putOnCooldown = function(){
	this.cooldownMax = this.curSkill.abilityCooldown*2;
	this.cooldown = this.cooldownMax;	
}

Skill.prototype.decrementCooldown = function(){
	this.cooldown--;
}

module.exports = Skill;