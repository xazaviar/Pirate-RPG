
function CombatStyle(type, lightAttack, heavyAttack, mobilityMod, blockForce,combos) {
	this.type = type;
	this.lightAttack = lightAttack;
	this.heavyAttack = heavyAttack;
	this.mobilityMod = mobilityMod;
	this.blockForce = blockForce;
	this.combos = combos;
}


CombatStyle.prototype.getType = function(){
	return this.type;
}

CombatStyle.prototype.getLightAttack = function(){
	return this.lightAttack;
}

CombatStyle.prototype.getHeavyAttack = function(){
	return this.heavyAttack;
}

CombatStyle.prototype.getBlockForce = function(){
	return this.blockForce;
}

CombatStyle.prototype.getAttack = function(type, queue, energy){
	//Check combos
	queue.push(type);

	var matched = false;
	var attack;
	for(var c in this.combos){
		if(this.combos[c].steps.length >= queue.length){
			//Match current queue
			matched = true;
			for(var q in queue){
				if(this.combos[c].steps[q].input!=queue[q]){
					matched = false;
					break;
				}
			}


			if(matched){
				attack = this.combos[c].steps[queue.length-1].attack;
				if(this.combos[c].steps[queue.length-1].end){
					queue.length = 0;
				}
				break;
			}
		}
	}

	//Check queue
	if(queue.length > 5){
		queue.length = 0;
		queue.push(type);
	}
	else if(!matched){
		queue.length = 0;
	}

	if(attack!=null){
		if(attack.energyUsage <= energy)
		return attack;
	} 
	if(type=="L") return this.lightAttack;
	if(type=="H") return this.heavyAttack;
}


module.exports = CombatStyle;