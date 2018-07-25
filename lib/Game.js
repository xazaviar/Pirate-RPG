const HashMap = require('hashmap');
const Player = require('./Player');
const Map2D = require('./Map2D');
const Skill = require('./Skill/Skill');
const SkillTree = require('./Skill/SkillTree');
const Util = require('../shared/Util'); 
const SAT = require('../shared/SAT'); 

/**
 * Constructor for a Game object.
 * @constructor
 */
function Game() {
    this.clients = new HashMap();
    this.players = new HashMap();
    this.liveMaps = [];
    var context = this;

    //Read in data
    readComboList(function(data){
        context.comboList = [];

        for(var d in data){
            context.comboList[data[d].id] = data[d];
        }
    });
    readSkillList(function(data){
        context.skillList = [];

        for(var d in data){
            context.skillList[data[d].id] = data[d];
        }
    });
    readSkillTreeList(function(data){

        context.skillTreeList = data;
    });
    readBuffList(function(data){
        context.buffList = [];

        for(var d in data){
            context.buffList[data[d].id] = data[d];
        }
    });
    readMapList(function(spawn, data){
        context.mapList = [];
        context.newInstanceID = 1;
        context.spawn = spawn;

        for(var d in data){
            context.mapList[data[d].id] = data[d];
        }
    });

}

/**
 * Factory method for a Game object.
 * @return {Game}
 */
Game.create = function() {
    
    return new Game();
}



/**
 * Returns callbacks that can be passed into an update()
 * method for an object so that it can access other elements and
 * entities in the game.
 * @return {Object<string, Function>}
 */
Game.prototype._callbacks = function() {
    return {
        players: Util.bind(this, this.players)
    };
}


//*******************************************************
// Player Functions
//*******************************************************
Game.prototype.addNewPlayer = function(socket, data) {
    this.clients.set(socket.id, socket);

    var map;
    var instanceID;

    var exist = this.findMap(this.spawn, null);

    //Need to open a new map instance?
    if(this.mapList[this.spawn].private || !exist){
        this.liveMaps.push(new Map2D(this.spawn, this.mapList[this.spawn].name,this.newInstanceID));
        exist = this.liveMaps[this.liveMaps.length-1];

        this.newInstanceID++;
    }

    var skillTrees = initializeSkillTrees(this.skillTreeList, this.skillList, this.comboList);

    this.players.set(socket.id, Player.create(socket.id, exist.id,this.mapList[this.spawn].spawn,exist.instanceID,skillTrees));
    exist.newPlayer(socket.id);
}

Game.prototype.removePlayer = function(id) {
    this.clients.remove(id);

    //Remove from map
    if(this.players.get(id)!=undefined){
        var currentMap = this.findMap(this.players.get(id).curMap,this.players.get(id).mapInstanceID);
        currentMap.removePlayer(id);
    }

    this.players.remove(id);
}

/**
 * Returns a list containing the connected Player objects.
 * @return {Array<Player>}
 */
Game.prototype.getPlayers = function() {
    return this.players.values();
}

function initializeSkillTrees(treeList, skillList, comboList){
    var skillTrees = [], combos = [];

    for(var t in treeList){
        var tiers = [];

        //Collect skills
        for(var tier = 0; tier < 5; tier++){
            tiers.push([]);
            for(var s in treeList[t].tiers[tier]){
                var skill = skillList[treeList[t].tiers[tier][s].id];

                //Check for combos
                var combo = null;
                if(skill.type == "combo" && skill.subtype == null){
                    combos.push(comboList[skill.base]);
                    combo = comboList[skill.base];
                }

                tiers[tier].push(new Skill({
                    id: skill.id,
                    name: skill.name,
                    type: skill.type,
                    subtype: skill.subtype,
                    desc: skill.desc,
                    prereq: skill.prereq,
                    maxLevels: treeList[t].tiers[tier][s].maxLevels,
                    level: treeList[t].tiers[tier][s].level,
                    base: combo?combo:skill.base,
                    upgrade: skill.upgrade
                }));

                if(skill.type == "combo" && skill.subtype == null) tiers[tier][tiers[tier].length-1]["comboID"] = skill.base;
                else if(skill.type == "combo" && skill.subtype != null) tiers[tier][tiers[tier].length-1]["comboID"] = skill.comboID;
                

                //Check if need to write in buffs
            }
        }

        skillTrees.push(new SkillTree({
            name: treeList[t].name,
            type: treeList[t].type,
            desc: treeList[t].desc,
            tiers: tiers,
            comboList: combos,
            baseSpeed: treeList[t].baseSpeed,
            baseDamage: treeList[t].baseDamage,
            baseBlockingForce: treeList[t].baseBlockingForce
        }));
    }


    return skillTrees;
}

//*******************************************************
// Update Functions
//*******************************************************

/**
 * Updates a player based on input received from their client.
 * @param {string} id The socket ID of the client
 * @param {Object} data The input received from the client
 */
Game.prototype.updatePlayerOnInput = function(id, data) {
    var player = this.players.get(id);
    if (player) {
        player.updateOnInput(data.keyboardState, data.mouseState, data.menuState);
    }
}

/**
 * Steps the server forward in time. Updates every entity in the game.
 */
Game.prototype.update = function() {
    //Update Players
    var players = this.getPlayers();
    for (var i = 0; i < players.length; ++i) {
        var map = this.findMap(players[i].curMap,players[i].mapInstanceID);

        SAT.mapCollisionDetection(players[i], map, players[i].getDeltaTime());
        players[i].update();

        //Getting attacks
        if(players[i].newAttack()){
            var attacks = players[i].getAttack();
            for(var a = 0; a < attacks.length; a++)
                map.addNewAttack(attacks[a]);
            players[i].gotAttack();
        }
    }

    //Update Map Entities
    for(var m in this.liveMaps){
        this.liveMaps[m].moveEntities();
    }
}

Game.prototype.constUpdate = function() {
    var players = this.getPlayers();

    for (var i = 0; i < players.length; i++) {
        players[i].constUpdate();
    }
}

/**
 * Check the validity of all players in the server state.
 */
Game.prototype.checkState = function() {
    var players = this.getPlayers();

    //Check for map transfers
    for(var p in players){
        if(players[p].respawning()){
            this.respawnPlayer(players[p]);
        }else if(players[p].leavingMap()){
            this.mapTransfer(players[p]);
        }
    }

    //Check for collisions
    for(var m = 0; m < this.liveMaps.length; m++){
        if(!this.liveMaps[m].active){
            this.liveMaps.splice(m,1);
            m--;
        }
        else{
            this.liveMaps[m].checkState(this.players.values().filter((player) => player.curMap == this.liveMaps[m].id && player.mapInstanceID == this.liveMaps[m].instanceID));
        }
    }
}

/**
 * Sends the state of the game to every client.
 */
Game.prototype.sendState = function() {
    var ids = this.clients.keys();
    for (var i = 0; i < ids.length; ++i) {
        var map = this.findMap(this.players.get(ids[i]).curMap,this.players.get(ids[i]).mapInstanceID);


        if(map)
            this.clients.get(ids[i]).emit('update', {
                self: this.players.get(ids[i]),
                players: this.players.values().filter((player) => player.id != ids[i] && player.curMap == map.id && player.mapInstanceID == map.instanceID),
                attacks: map.getAttacks()
            });
        else
            this.clients.get(ids[i]).emit('update', {
                self: this.players.get(ids[i]),
                players: [],
                attacks: []
            });
    }
}


//*******************************************************
// Map Functions
//*******************************************************
Game.prototype.findMap = function(id, instanceID){
    for(var m in this.liveMaps){
        if(this.liveMaps[m].id == id && (this.liveMaps[m].instanceID == instanceID || instanceID == null))
            return this.liveMaps[m];
    }

    return false;
}

Game.prototype.getMapNames = function() {
    var names = [];

    for(var m in this.mapList){
        names.push(this.mapList[m].name);
    }

    return names;
}

Game.prototype.mapTransfer = function(player){
    var entry = player.getEntryMap();

    var currentMap = this.findMap(player.curMap,player.mapInstanceID);
    var newMap = this.findMap(entry.id, null);

    var map;
    var instanceID;

    //Need to open a new map instance?
    if(this.mapList[entry.id].private || !newMap){
        this.liveMaps.push(new Map2D(entry.id, this.mapList[entry.id].name,this.newInstanceID));
        newMap = this.liveMaps[this.liveMaps.length-1];

        this.newInstanceID++;
    }    

    currentMap.removePlayer(player.getID());
    newMap.newPlayer(player.getID());

    this.clients.get(player.getID()).emit('mapChange', {id:newMap.id, name:newMap.name});

    player.leftMap(newMap.instanceID, this.mapList[entry.id].spawn);
}

Game.prototype.respawnPlayer = function(player){
    var spawn = player.getSpawn();

    var currentMap = this.findMap(player.curMap,player.mapInstanceID);
    var newMap = this.findMap(spawn.id, null);

    var map;
    var instanceID;

    //Need to open a new map instance?
    if(this.mapList[spawn.id].private || !newMap){
        this.liveMaps.push(new Map2D(spawn.id, this.mapList[spawn.id].name,this.newInstanceID));
        newMap = this.liveMaps[this.liveMaps.length-1];

        this.newInstanceID++;
    }    

    currentMap.removePlayer(player.getID());
    newMap.newPlayer(player.getID());

    this.clients.get(player.getID()).emit('mapChange', {id:newMap.id, name:newMap.name});

    player.respawned(newMap.instanceID);
}


//*******************************************************
// Read in data
//*******************************************************
function readComboList(_callback){
    console.log("Reading in combos...");

    var jsonfile = require('jsonfile');
    var comboList = [];

    jsonfile.readFile("./data/combos.json", function(err, data){

        if(err){
            console.log("Error reading in combos:", err);
            process.exit();
        }

        for(var c in data){
            comboList.push(data[c]);

            //convert all angles to radians
            for(var s in comboList[comboList.length-1].steps){
                var step = comboList[comboList.length-1].steps[s];

                if(step.attack!=null){
                    if(step.attack.specialMovement != null){
                        step.attack.specialMovement.rSpeed *= Math.PI/180;
                    }

                    for(var seq1 in step.attack.sequence){
                        for(var seq2 in step.attack.sequence[seq1]){
                            var motion = step.attack.sequence[seq1][seq2].motion;
                            if(motion.type == "sweep"){
                                motion.speed *= Math.PI/180;
                                motion.start *= Math.PI/180;
                                motion.dist *= Math.PI/180;
                            }
                            else if(motion.type == "jab"){
                                motion.angle *= Math.PI/180;
                            }
                        }
                    }//Close Sequence
                }//Close attack check
            }//Close step correction
        }//Close combo read in
        _callback(comboList);
    });
}

function readSkillList(_callback){
    console.log("Reading in skills...");
    var jsonfile = require('jsonfile');
    var skillList = [];

    jsonfile.readFile("./data/skills.json", function(err, data){

        if(err){
            console.log("Error reading in skills:", err);
            process.exit();
        }

        for(var s in data){
            skillList.push(data[s]);

            if(skillList[skillList.length-1].type=="attack"){
                //convert all angles to radians
                var attack = skillList[skillList.length-1].base;
                if(attack.specialMovement != null){
                    attack.specialMovement.rSpeed *= Math.PI/180;
                }

                for(var seq1 in attack.sequence){
                    for(var seq2 in attack.sequence[seq1]){
                        var motion = attack.sequence[seq1][seq2].motion;
                        if(motion.type == "sweep"){
                            motion.speed *= Math.PI/180;
                            motion.start *= Math.PI/180;
                            motion.dist *= Math.PI/180;
                        }
                        else if(motion.type == "jab"){
                            motion.angle *= Math.PI/180;
                        }
                    }
                }//Close Sequence
            }//Close attack check
        }

        _callback(skillList);
    });
}

function readSkillTreeList(_callback){
    console.log("Reading in skillTrees...");
    var jsonfile = require('jsonfile');
    var skillTreeList = [];

    jsonfile.readFile("./data/skilltrees.json", function(err, data){

        if(err){
            console.log("Error reading in skill trees:", err);
            process.exit();
        }

        for(var s in data){
            skillTreeList.push(data[s]);
        }

        _callback(skillTreeList);
    });
}

function readBuffList(_callback){
    console.log("Reading in buffs...");
    var jsonfile = require('jsonfile');
    var buffList = [];

    jsonfile.readFile("./data/buffs.json", function(err, data){

        if(err){
            console.log("Error reading in buffs:", err);
            process.exit();
        }

        for(var s in data){
            buffList.push(data[s]);
        }

        _callback(buffList);
    });
}

function readMapList(_callback){
    console.log("Reading in maps...");
    var jsonfile = require('jsonfile');
    var mapList = [];

    jsonfile.readFile("./data/maps.json", function(err, data){
        if(err){
            console.log("Error reading in maps:", err);
            process.exit();
        }

        for(var m in data.list){
            mapList.push(data.list[m]);
        }

        _callback(data.spawn, mapList);
    });
}

module.exports = Game;