function Buff(params){ 
	//Received Data
	this.id 		= params.id;
	this.name 		= params.name;
	this.type 		= params.type;
	this.stats 		= JSON.parse(JSON.stringify(params.stats));
	this.duration	= 0+params.duration;

	//cooldown data
	this.durationMax = 1; //temp value
	this.curDuration = 0;
}

Buff.prototype.upgrade = function(params){

}

//buff Cooldowns
Buff.prototype.isActive = function(){

	return this.curDuration > 0 || this.duration == -1;
}

Buff.prototype.activate = function(){
	if(this.duration > 0){
		this.durationMax = this.duration*2;
		this.curDuration = this.durationMax;
	}	
}

Buff.prototype.decrementDuration = function(){
	if(this.curDuration > 0)
		this.curDuration--;
}

module.exports = Buff;