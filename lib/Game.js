const HashMap = require('hashmap');
const Player = require('./Player');
const Map2D = require('./Map2D');
const Util = require('../shared/Util'); 
const SAT = require('../shared/SAT'); 

/**
 * Constructor for a Game object.
 * @constructor
 */
function Game() {
    this.clients = new HashMap();
    this.players = new HashMap();

    readComboList(function(data){
        this.comboList = [];

        for(var d in data){
            this.comboList[data[d].id] = data[d];
        }
        // console.log(this.comboList[3]);

    });

    readSkillList(function(data){
        this.skillList = [];

        for(var d in data){
            this.skillList[data[d].id] = data[d];
        }
        // console.log(this.skillList);
    });

    readSkillTreeList(function(data){
        this.skillTreeList = data;
    });

    readBuffList(function(data){
        this.buffList = data;
    });




    this.liveMaps = [];
    this.newInstanceID = 1;
    this.mapList = [{name:'arena',      private:false,      spawn: null},           //0
                    {name:'entry',      private:true,       spawn: {x:100,y:100}},  //1
                    {name:'landing',    private:true,       spawn: {x:100,y:100}},  //2
                    {name:'pathway',    private:true,       spawn: null},           //3
                    {name:'cave',       private:false,      spawn: null},           //4
                    {name:'the pit',    private:false,      spawn: null},           //5
                    {name:'tiny room',  private:true,       spawn: {x:65,y:65}}     //6
                    ];
    this.spawn = 1;

    // this.globalTimer = setInterval(this.constUpdate,500);
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

    var lists = initializeSkillTrees(this.skillTreeList, this.skillList, this.comboList);

    this.players.set(socket.id, Player.create(socket.id, exist.id,this.mapList[this.spawn].spawn,exist.instanceID,lists[0],lists[1]));
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
    var skillTrees, combos;


    for(var t in treeList){
        var tiers = [];

        //Collect skills
        for(var tier = 0; tier < 5; tier++){
            tiers.push([]);
            for(var s in treeList[t].tiers[tier]){
                var skill = skillList[treeList[t].tiers[tier][s].id];

                tiers[tier].push(new Skill({
                    id: skill.id,
                    name: skill.name,
                    type: skill.type,
                    subtype: skill.subtype,
                    desc: skill.desc,
                    prereq: skill.prereq,
                    levels: treeList[t].tiers[tier][s].levels,
                    base: skill.base,
                    increase: skill.increase
                }));

                //Check if need to write in buffs
            }
        }
    }


    return [skillTrees,combos];
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
        player.updateOnInput(data.keyboardState, data.mouseState);
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


module.exports = Game;