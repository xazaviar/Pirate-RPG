const Util = require('../shared/Util');
const SAT = require('../shared/SAT');
const HashMap = require('hashmap');
const AttackEntity = require('./AttackEntity');

/**
 * Constructor for a Map2D object.
 * @param {.map} take in a map file location
 * @constructor
 */
function Map2D(id,map,instanceID) {
    this.id = id;
    this.instanceID = instanceID;
    this.name = ""+map; 
    this.active = false;

    //Player List
    this.playerList = [];

    //Attack List
    this.attackID = 0;
    this.attacks = new HashMap();

	var jsonfile = require('jsonfile');
	var context = this;

	jsonfile.readFile("./shared/Maps/"+map+".json",function(err,obj){
		context.tilesize = obj.tilewidth;
		context.width = obj.width * context.tilesize;
		context.height = obj.height * context.tilesize;

		context.objects = [];

		for(var l = 0; l < obj.layers.length; l++){
			if("objects" in obj.layers[l]){
				var objects = obj.layers[l].objects;
				for(var o in objects){
                    if(objects[o].name == "exit"){
                        context.objects.push({
                            name: objects[o].name,
                            id: objects[o].id,
                            polygon: new SAT.Box({x:objects[o].x,y:objects[o].y},objects[o].width,objects[o].height).toPolygon(),
                            width: objects[o].width,
                            height: objects[o].height,
                            x: objects[o].x,
                            y: objects[o].y,
                            entry_map_id: objects[o].properties.entry_map_id,
                            spawn: objects[o].properties.spawn,
                            saveExit: objects[o].properties.saveExit,
                            useExit: objects[o].properties.useExit
                        });
                    }else
                        context.objects.push({
                            name: objects[o].name,
                            id: objects[o].id,
                            polygon: new SAT.Box({x:objects[o].x,y:objects[o].y},objects[o].width,objects[o].height).toPolygon(),
                            width: objects[o].width,
                            height: objects[o].height,
                            x: objects[o].x,
                            y: objects[o].y
                        });
                }
				break;
			}
		}
	});
}

//Players
Map2D.prototype.newPlayer = function(playerID){
    this.playerList.push(playerID);
    this.active = true;
}

Map2D.prototype.removePlayer = function(playerID){
    for(var p in this.playerList){
        if(this.playerList[p] == playerID){
            this.playerList.splice(p,1);
            break;
        }
    }

    if(this.playerList.length == 0) this.active = false;
}


//Attacks
Map2D.prototype.getAttacks = function() {
    
    return this.attacks.values();
}

Map2D.prototype.addNewAttack = function(attack) {
    this.attackID++;
    this.attacks.set(this.attackID,AttackEntity.create(this.attackID,attack));
}

Map2D.prototype.removeAttack = function(id) {

    this.attacks.remove(id);
}



//Entity Control
Map2D.prototype.moveEntities = function(){
    //Move attacks
    var attacks = this.getAttacks();
    for (var i = 0; i < attacks.length; ++i) {
        attacks[i].update();
        if(attacks[i].getIsDead()){
            this.removeAttack(attacks[i].getID());
        }
    }

    //Move AI
}

Map2D.prototype.checkState = function(players){
    var attacks = this.getAttacks();

    for (var i = 0; i < players.length; ++i) {
        //Attacks
        for (var b = 0; b < attacks.length; ++b) {
            var collision = attacks[b].isCollidedWith(players[i]);

            if(attacks[b].getOwner()!=players[i].getID() && 
            !players[i].getIsDead() &&
            collision!=false){

                //Check for block
                var blocked = false;
                if(players[i].getIsBlocking() && collision=="front") blocked = true;

                if(!players[i].isInvincible())
                    attacks[b].hitTarget();
                players[i].takeDamage(attacks[b].getDamage(), attacks[b].getAttackForce(), blocked, attacks[b].getKnockback());

                if(attacks[b].removable()){
                    this.removeAttack(attacks[b].getID());
                }

            }
        }
        
    }
}

module.exports = Map2D;