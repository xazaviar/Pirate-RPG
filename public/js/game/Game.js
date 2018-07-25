
/**
 * Creates a Game on the client side to render the players and entities.
 * @constructor
 * @param {Object} socket The socket connected to the server.
 * @param {Drawing} drawing The Drawing object that will render the game.
 */
function Game(socket, drawing) {
    this.socket = socket;
    this.drawing = drawing;

    this.selfPlayer = null;
    this.otherPlayers = [];
    this.animationFrameId = 0;
    this.MAX_IDLE_TIME = 10; //In Minutes
    this.isGettingData = true;
    this.menuOpen = false;
    this.menuLastState = false;
    this.firstData = true;
    this.switchTree = -1;
    this.applySP = null;

    //FPS tracking
    this.fps = 0;
    this.prevTime = -1;
    this.frames = 0;

    this.map = {};
}

/**
 * Factory method to create a Game object.
 * @param {Object} socket The Socket connected to the server.
 * @param {Element} canvasElement The canvas element that the game will use to
 *   draw to.
 * @return {Game}
 */
Game.create = function(socket, canvasElement) {
    var canvasContext = canvasElement.getContext('2d');

    var drawing = Drawing.create(canvasContext);
    return new Game(socket, drawing);
};

/**
 * Initializes the Game object and its child objects as well as setting the
 * event handlers.
 */
Game.prototype.init = function() {
    var context = this;

    this.socket.on('update', function(data) {
        context.receiveGameState(data);
    });
    this.socket.on('map', function(data){
        context.drawing.loadMaps(data.list, data.start);
        context.loadMap(data.list[data.start]);
    });
    this.socket.on('mapChange', function(data){
        context.drawing.changeMap(data.id);
        context.loadMap(data.name);
    });
    this.socket.emit('player-join');
};

/**
 * This method begins the animation loop for the game.
 */
Game.prototype.animate = function() {
    this.animationFrameId = window.requestAnimationFrame(
        Util.bind(this, this.update));
};

/**
 * This method stops the animation loop for the game.
 */
Game.prototype.stopAnimation = function() {
    window.cancelAnimationFrame(this.animationFrameId);
};

/**
 * Updates the game's internal storage of all the powerups, called each time
 * the server sends packets.
 * @param {Object} state The game state received from the server.
 */
Game.prototype.receiveGameState = function(state) {
    this.selfPlayer   = state['self'];
    this.otherPlayers = state['players'];
    this.attacks      = state['attacks'];


    if(this.firstData && this.selfPlayer){
        this.firstData = false;
        this.drawing.loadSkillImages(this.selfPlayer.skillTrees);
    }
};

/**
 * Updates the state of the game client side and relays intents to the
 * server.
 */
Game.prototype.update = function() {
    if(Input.MENU && !this.menuLastState)
        this.menuOpen = !this.menuOpen;
    this.menuLastState = Input.MENU;

    if (this.selfPlayer && this.isGettingData) {
        // Emits an event for the containing the player's input.
        var mouse = this.calculateMouseCoords(Input.MOUSE[0],Input.MOUSE[1],this.selfPlayer.x,this.selfPlayer.y,this.drawing.scale);


        this.socket.emit('player-action', {
            keyboardState: {
                left:       Input.LEFT,
                right:      Input.RIGHT,
                up:         Input.UP,
                down:       Input.DOWN,
                dodge:      Input.DODGE,
                block:      Input.BLOCK,
                respawn:    Input.RESPAWN
            },
            menuState: {
                menuOpen:   this.menuOpen,
                switchTree: this.switchTree,
                applySP:    this.applySP
            },
            mouseState: {
                x:          mouse.x,
                y:          mouse.y,
                left:       Input.LEFT_CLICK,
                right:      Input.RIGHT_CLICK
            }
        });
        this.correctPosition(this.selfPlayer);
        this.switchTree = -1;
        this.applySP = null;
        this.draw();

        //Check if need to shut down
        var currentTime = new Date();
        var idleTime = currentTime - Input.LAST_INPUT_RECEIVED;
        if(idleTime >= this.MAX_IDLE_TIME*60000){
            //Close Connection
            this.socket.close();
            this.isGettingData = false;
            this.draw();
        }

        const time = performance.now();
        this.frames++;
        if(time > this.prevTime+1000){
            this.fps = Math.round((this.frames*1000)/(time-this.prevTime));
            this.prevTime = time;
            this.frames = 0;
        }
    }
    this.animate();
};

/**
 * Draws the state of the game using the internal Drawing object.
 */
Game.prototype.draw = function() {
    var mouse = this.calculateMouseCoords(Input.MOUSE[0],Input.MOUSE[1],this.selfPlayer.x,this.selfPlayer.y,this.drawing.scale);
    var angle = Util.calculateAngle({x:this.selfPlayer.x,y:this.selfPlayer.y},{x:mouse.x,y:mouse.y});

    //Resize the canvas
    this.drawing.resize();

    //Set scale
    this.drawing.setScale($("#gameArea").width()/this.selfPlayer.view);

    // Clear the canvas.
    this.drawing.clear();

    //Draw map background
    this.drawing.drawMap(this.map, this.selfPlayer.x, this.selfPlayer.y, this.selfPlayer.hitbox,1);

    //Draw attacks
    for (var attack of this.attacks) {
        this.drawing.drawAttack(
            this.selfPlayer.x, 
            this.selfPlayer.y,
            this.selfPlayer.hitbox,
            attack.weapon,
            attack.x,
            attack.y,
            attack.size,
            attack.orientation,
            this.map
        );
    }

    //Draw player
    if(!this.selfPlayer.isDead){
        this.drawing.drawSelf(
            this.selfPlayer.x,
            this.selfPlayer.y,
            this.selfPlayer.hitbox,
            /*this.selfPlayer.canChangeOrientation?angle:*/this.selfPlayer.orientation,
            this.selfPlayer.isBlocking?this.selfPlayer.weaponType:null,
            this.selfPlayer.inWater,
            this.map
        );
    }


    //Draw the other players
    for (var player of this.otherPlayers) {
        if(!player.isDead){
            this.drawing.drawOther(
                this.selfPlayer.x, 
                this.selfPlayer.y,
                this.selfPlayer.hitbox,
                player.x,
                player.y,
                player.hitbox,
                player.orientation,
                player.isBlocking?player.weaponType:null,
                player.inWater,
                this.map
            );
        }
    }

    //Draw map foreground
    this.drawing.drawMap(this.map, this.selfPlayer.x, this.selfPlayer.y, this.selfPlayer.hitbox,2);
    
    //Draw Info
    var left = 100;
    var down = 0;
    this.drawing.drawText("FPS   : "+this.fps,                                               $("#canvas").width()-left,down+=10);
    // this.drawing.drawText("screen: "+parseInt(window.innerWidth)+","+parseInt(window.innerHeight),  $("#canvas").width()-left,down+=10);
    // this.drawing.drawText("player: "+parseInt(this.selfPlayer.x)+","+parseInt(this.selfPlayer.y),   $("#canvas").width()-left,down+=10);
    // this.drawing.drawText("raw m : "+parseInt(Input.MOUSE[0])+","+parseInt(Input.MOUSE[1]),         $("#canvas").width()-left,down+=10);
    // this.drawing.drawText("mouse : "+parseInt(mouse.x)+","+parseInt(mouse.y),                       $("#canvas").width()-left,down+=10);
    // this.drawing.drawText("angle : "+parseInt(angle*180/Math.PI),                                   $("#canvas").width()-left,down+=10);
    this.drawing.drawText("weapon: "+this.selfPlayer.skillTrees[this.selfPlayer.selectedCombatTree].name, $("#canvas").width()-left,down+=10);
    this.drawing.drawText("D/Ced?: "+!this.isGettingData,                                           $("#canvas").width()-left,down+=10);
    this.drawing.drawText("ComboQ: "+this.selfPlayer.comboQueue,                                    $("#canvas").width()-left,down+=10);
    this.drawing.drawText("Atk C : "+this.selfPlayer.attackCooldown.toFixed(0),                                $("#canvas").width()-left,down+=10);
    // this.drawing.drawText("Water : "+this.selfPlayer.inWater,                                       $("#canvas").width()-left,down+=10);
    // this.drawing.drawText("movin : "+this.selfPlayer.isMoving,                                      $("#canvas").width()-left,down+=10);
    // this.drawing.drawText("Spawn : "+this.selfPlayer.spawn.id+" ["+this.selfPlayer.spawn.loc.x+","+this.selfPlayer.spawn.loc.y+"]",$("#canvas").width()-left,down+=10);
    this.drawing.drawText("inMenu: "+this.menuOpen,                                                 $("#canvas").width()-left,down+=10);
    // this.drawing.drawText("Switch: "+this.switchTree,                                               $("#canvas").width()-left,down+=10);

    
    //Draw UI
    this.drawing.drawUI(this.selfPlayer.hp,
                        this.selfPlayer.hpMax,
                        this.selfPlayer.energy,
                        this.selfPlayer.energyMax);


    if(this.menuOpen){
        var actions = this.drawing.drawMenu(this.selfPlayer, Input.MOUSE, Input.LEFT_CLICK);

        //Probably will only be one or none
        for(var a in actions){
            if(actions[a].type=="switchTree") this.switchTree = actions[a].value;
            if(actions[a].type=="applySP") this.applySP = {skill:actions[a].skill,tree:actions[a].tree};
        }
    }
};


Game.prototype.loadMap = function(map){
    var context = this;
    $.ajax({
        dataType: "text",
        url: "/shared/Maps/"+map+".json", 
        success: function(data){
            var contextMap = JSON.parse(data);

            context.map["width"] = contextMap.width * contextMap.tilewidth;
            context.map["height"] = contextMap.height * contextMap.tilewidth;
            context.map["objects"] = [];
            context.map["tilesize"] = contextMap.tilewidth; 

            for(var l = 0; l < contextMap.layers.length; l++){
                if("objects" in contextMap.layers[l]){
                    var objects = contextMap.layers[l].objects;
                    for(var o in objects){
                        context.map.objects.push({
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

        },
        error(xhr,status,error){
            console.log(error);
        }
    });
}


Game.prototype.correctPosition = function(entity) {
    var width = this.map.width;
    var height = this.map.height;
    var objects = this.map.objects;

    // //Map bounds
    if(entity.x < 0+entity.hitbox/2) entity.x = entity.hitbox/2;
    if(entity.x > width-entity.hitbox/2) entity.x = width-entity.hitbox/2;
    if(entity.y < 0+entity.hitbox/2) entity.y = entity.hitbox/2;
    if(entity.y > height-entity.hitbox/2) entity.y = height-entity.hitbox/2;
};


Game.prototype.calculateMouseCoords = function(x, y, px, py, scale){
    var cWid = $("#canvas").width();
    var cHei = $("#canvas").height();
    var wWid = window.innerWidth;
    var wHei = window.innerHeight;
    var mX, mY; 
    // = Input.MOUSE[0]/this.drawing.scale - window.innerWidth/2/this.drawing.scale + this.selfPlayer.x;
    // var mY = Input.MOUSE[1]/this.drawing.scale - window.innerHeight/2/this.drawing.scale + this.selfPlayer.y;


    //Map width is smaller than screen size
    var sepWid = (wWid - cWid)/2;
    var sepHei = (wHei - cHei)/2;
    if(this.map.width*scale <= cWid){
        mX =  (x - sepWid - (cWid - this.map.width*scale)/2)/scale; 
    }
    else if(px*scale <= cWid/2){
        mX = (x - sepWid)/scale;
    }
    else if(px*scale >= this.map.width*scale-cWid/2){
        mX = (x - sepWid - (cWid-this.map.width*scale))/scale;
    }
    else{
        mX = x/scale - wWid/2/scale + px;
    }

    //Map height is smaller than screen size
    if(this.map.height*scale <= cHei){
        mY = (y - sepHei - (cHei - this.map.height*scale)/2)/scale;
    }
    else if(py*scale <= cHei/2){
        mY = (y - sepHei)/scale;
    }
    else if(py*scale >= this.map.height*scale-cHei/2){
        mY = (y - sepHei -(cHei-this.map.height*scale))/scale;
    }
    else{
        mY = y/scale - wHei/2/scale + py;
    }

    return {x:mX, y:mY};
}