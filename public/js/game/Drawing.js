/**
 * Creates a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @constructor 
 */
function Drawing(context) {
    this.context = context;
    this.scale = 3;

    //Menu data
    this.menuTab = 1;

    //Skills tab
    this.viewTree = 0;
    this.viewSkill = 0;
    this.hoverSkill = -1;
    this.hoverTree = -1;
    this.testCount = 0;

    this.loadImages();
}

//Drawing General Functions
//**********************************************************************
/**
 * This is a factory method for creating a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @return {Drawing}
 */
Drawing.create = function(context) {
    
    return new Drawing(context);
}

/**
 * This method creates and returns an Image object.
 * @param {string} src The path to the image
 * @param {number} width The width of the image in pixels
 * @param {number} height The height of the image in pixels
 * @return {Image}
 */
Drawing.createImage = function(src, width, height) {
    var image = new Image(width, height);
    image.src = src;
    return image;
}

/**
 * Clears the canvas context.
 */
Drawing.prototype.clear = function() {
    var canvas = this.context.canvas;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
}

Drawing.prototype.setScale = function(scale){
    
    this.scale = scale;
}

//Entitiy Drawing
//**********************************************************************

/**
 * Draws the player's sprite as a green circle.
 * @param {number} x The x coordinate of the player
 * @param {number} y The y coordinate of the player
 * @param {number} size The radial size of the player
 */
Drawing.prototype.drawSelf = function(x, y, size, orientation, blockingWeapon, inWater, map) {
    var wid = $("#canvas").width();
    var hei = $("#canvas").height();
    var placeX, placeY;

    this.context.save();
    this.context.beginPath();

    //Map width is smaller than screen size
    if(map.width*this.scale <= wid){
        placeX = (wid - map.width*this.scale)/2 + x*this.scale-size/2*this.scale;
    }
    else if(x*this.scale <= wid/2){
        placeX = x*this.scale-size/2*this.scale;
    }
    else if(x*this.scale >= map.width*this.scale-wid/2){
        placeX = wid-map.width*this.scale+x*this.scale-size/2*this.scale;
    }
    else{
        placeX = wid/2-size/2*this.scale;
    }

    //Map height is smaller than screen size
    if(map.height*this.scale <= hei){
        placeY = (hei - map.height*this.scale)/2 + y*this.scale-size/2*this.scale;
    }
    else if(y*this.scale <= hei/2){
        placeY = y*this.scale-size/2*this.scale;
    }
    else if(y*this.scale >= map.height*this.scale-hei/2){
        placeY = hei-map.height*this.scale+y*this.scale-size/2*this.scale;
    }
    else{
        placeY = hei/2-size/2*this.scale;
    }

    this.context.translate(placeX,placeY); //Move to location
    this.context.translate(size/2*this.scale,size/2*this.scale); //Move 1/2 the size
    this.context.rotate(orientation);
    this.context.drawImage(this.playerImg,-(size/2*this.scale),-(size/2*this.scale),size*this.scale,size*this.scale);

    if(blockingWeapon!=null){
        var blockImage;
        if(blockingWeapon == "kicks") blockImage = this.blockKickImg;
        else if(blockingWeapon == "swords") blockImage = this.blockSwordImg;
        else if(blockingWeapon == "ranged") blockImage = this.blockImg;
        else blockImage = this.blockPunchImg;
    
        this.context.drawImage(blockImage,-(size/2*this.scale),-(size/2*this.scale),size*this.scale,size*this.scale/4)
    } 
    // if(inWater)
    //     this.context.drawImage(this.waterMaskImg,-(size/2*this.scale),-(size/2*this.scale),size*this.scale,size*this.scale+1)
    this.context.restore();
    if(inWater)
        this.context.drawImage(this.waterMaskImg,placeX,placeY,size*this.scale,size*this.scale+1)

    this.context.fill();
}

/**
 * Draws other players' sprite as a red circle.
 * @param {number} x The x coordinate of the player
 * @param {number} y The y coordinate of the player
 * @param {number} size The radial size of the player
 */
Drawing.prototype.drawOther = function(px, py, psize, x, y, size, orientation, blockingWeapon, inWater, map) {
    var wid = $("#canvas").width();
    var hei = $("#canvas").height();
    var placeX, placeY;

    this.context.save();
    this.context.beginPath();

    //Map width is smaller than screen size
    if(map.width*this.scale <= wid){
        placeX = (wid - map.width*this.scale)/2 + x*this.scale-size/2*this.scale;
    }
    else if(px*this.scale <= wid/2){
        placeX = x*this.scale-size/2*this.scale;
    }
    else if(px*this.scale >= map.width*this.scale-wid/2){
        placeX = wid-map.width*this.scale+x*this.scale-size/2*this.scale;
    }
    else{
        placeX = wid/2-px*this.scale+x*this.scale-size/2*this.scale;
    }

    //Map height is smaller than screen size
    if(map.height*this.scale <= hei){
        placeY = (hei - map.height*this.scale)/2 + y*this.scale-size/2*this.scale;
    }
    else if(py*this.scale <= hei/2){
        placeY = y*this.scale-size/2*this.scale;
    }
    else if(py*this.scale >= map.height*this.scale-hei/2){
        placeY = hei-map.height*this.scale+y*this.scale-size/2*this.scale;
    }
    else{
        placeY = hei/2-py*this.scale+y*this.scale-size/2*this.scale;
    }

    this.context.translate(placeX,placeY); //Move to location
    this.context.translate(size/2*this.scale,size/2*this.scale); //Move 1/2 the size
    this.context.rotate(orientation);
    this.context.drawImage(this.oPlayerImg,-(size/2*this.scale),-(size/2*this.scale),size*this.scale,size*this.scale);

    if(blockingWeapon!=null){
        var blockImage;
        if(blockingWeapon == "kicks") blockImage = this.blockKickImg;
        else if(blockingWeapon == "swords") blockImage = this.blockSwordImg;
        else if(blockingWeapon == "ranged") blockImage = this.blockImg;
        else blockImage = this.blockPunchImg;
    
        this.context.drawImage(blockImage,-(size/2*this.scale),-(size/2*this.scale),size*this.scale,size*this.scale/4)
    }

    // if(inWater)
    //     this.context.drawImage(this.waterMaskImg,-(size/2*this.scale),-(size/2*this.scale),size*this.scale,size*this.scale+1)
    this.context.restore();
    if(inWater)
        this.context.drawImage(this.waterMaskImg,placeX,placeY,size*this.scale,size*this.scale+1)

    this.context.fill();
}

Drawing.prototype.drawAttack = function(px, py, psize, weapon, x, y, size, orientation, map){
    var wid = $("#canvas").width();
    var hei = $("#canvas").height();
    var placeX, placeY;
    var image;

    //Map width is smaller than screen size
    if(map.width*this.scale <= wid){
        placeX = (wid - map.width*this.scale)/2 + x*this.scale-size.wid/2*this.scale;
    }
    else if(px*this.scale <= wid/2){
        placeX = x*this.scale-size.wid/2*this.scale;
    }
    else if(px*this.scale >= map.width*this.scale-wid/2){
        placeX = wid-map.width*this.scale+x*this.scale-size.wid/2*this.scale;
    }
    else{
        placeX = wid/2-px*this.scale+x*this.scale-size.wid/2*this.scale;
    }

    //Map height is smaller than screen size
    if(map.height*this.scale <= hei){
        placeY = (hei - map.height*this.scale)/2 + y*this.scale-size.hei/2*this.scale;
    }
    else if(py*this.scale <= hei/2){
        placeY = y*this.scale-size.hei/2*this.scale;
    }
    else if(py*this.scale >= map.height*this.scale-hei/2){
        placeY = hei-map.height*this.scale+y*this.scale-size.hei/2*this.scale;
    }
    else{
        placeY = hei/2-py*this.scale+y*this.scale-size.hei/2*this.scale;
    }

    if(weapon=="bullet")        image = this.bulletImg;
    else if(weapon=="sword")    image = this.swordImg;
    else if(weapon=="kick")     image = this.kickImg;
    else if(weapon=="punch")    image = this.punchImg;

    this.context.save();
    this.context.beginPath();

    this.context.translate(placeX,placeY); //Move to location
    this.context.translate(size.wid/2*this.scale,size.hei/2*this.scale); //Move 1/2 the size
    this.context.rotate(orientation);
    this.context.drawImage(image,-(size.wid/2*this.scale),-(size.hei/2*this.scale),size.wid*this.scale,size.hei*this.scale);

    this.context.fill();
    this.context.restore();  
}

Drawing.prototype.drawObjects = function(px, py, wid, hei, objects){
    var cwid = $("#canvas").width();
    var chei = $("#canvas").height();

    this.context.save();
    this.context.fillStyle = '#F00';

    for(var o = 0; o < objects.length; o++){
        this.context.beginPath();
        this.context.rect(objects[o].x*this.scale+cwid/2-px*this.scale,(chei/2-py*this.scale)+objects[o].y*this.scale,objects[o].width*this.scale,objects[o].height*this.scale);
        this.context.stroke();
    }

    this.context.restore();
}


//Map Drawing
//**********************************************************************
Drawing.prototype.drawMap = function(map, x, y, size, layer){
    var wid = $("#canvas").width();
    var hei = $("#canvas").height();



    this.context.save();
    this.context.beginPath();

    var placeX, placeY;

    //Map width is smaller than screen size
    if(map.width*this.scale <= wid){
        placeX = (wid - map.width*this.scale)/2;
    }
    else if(x*this.scale <= wid/2){
        placeX = 0;
    }
    else if(x*this.scale >= map.width*this.scale-wid/2){
        placeX = wid-map.width*this.scale;
    }
    else{
        placeX = wid/2-x*this.scale;
    }

    //Map height is smaller than screen size
    if(map.height*this.scale <= hei){
        placeY = (hei - map.height*this.scale)/2;
    }
    else if(y*this.scale <= hei/2){
        placeY = 0;
    }
    else if(y*this.scale >= map.height*this.scale-hei/2){
        placeY = hei-map.height*this.scale;
    }
    else{
        placeY = hei/2-y*this.scale;
    }


    this.context.drawImage(layer==1?this.maps[this.curMap].bottomLayer:this.maps[this.curMap].topLayer,placeX,placeY,map.width*this.scale,map.height*this.scale);

    this.context.fill();
    this.context.restore();
}

Drawing.prototype.drawGrid = function(px, py, wid, hei, size){
    var cwid = $("#canvas").width();
    var chei = $("#canvas").height();

    this.context.save();
    this.context.fillStyle = '#000';

    for(var x = 0; x < (wid/size); x++){
        for(var y = 0; y < (hei/size); y++){
            this.context.beginPath();
            this.context.rect(size*x*this.scale+cwid/2-px*this.scale,(chei/2-py*this.scale)+size*y*this.scale,size*this.scale,size*this.scale);
            this.context.stroke();
        }
    }

    this.context.restore();
}


//UI Drawing
//**********************************************************************
Drawing.prototype.drawUI = function(hp,hpMax,energy,energyMax) {
    var width = 200;
    var height = 20;


    this.context.save();
    this.context.beginPath();

    //HP Bar
    this.context.fillStyle = '#D1D1D1';
    this.context.fillRect(10,10,width,height);
    this.context.fillStyle = '#FF0000';
    this.context.fillRect(10,10,width*(hp/hpMax),height);
  
    //Energy Bar
    this.context.fillStyle = '#D1D1D1';
    this.context.fillRect(10,10+height,width,height);
    this.context.fillStyle = '#FFA500';
    this.context.fillRect(10,10+height,width*(energy/energyMax),height);


    this.context.fill();
    this.context.restore();
}

Drawing.prototype.drawMenu = function(player, mouse, click){
    const scale = .8;
    var wid = $("#canvas").width();
    var hei = $("#canvas").height();

    var mAdj = mouseCoordsAdjust(mouse);

    this.context.save();
    this.context.beginPath();

    var placeX = (wid-wid*scale)/2, placeY = (hei-hei*scale)/2;
    var tabWid = 30*(wid/1920), tabHei = 60*(hei/1080);
    var tabX = placeX+wid*scale-wid*.02, tabY = placeY-tabHei+hei*.05;

    //Draw book
    this.context.drawImage(this.menuBookImg,placeX,placeY,wid*scale,hei*scale);

    //Check for tab change
    if(click){
        for(var t = 0; t < 2; t++){
            if(mAdj.x >= tabX && mAdj.x <= tabX+tabWid &&
               mAdj.y >= tabY+(t+1)*tabHei && mAdj.y <= tabY+(t+2)*tabHei){
                
                this.menuTab = t;
            }
        }
    }
        
    //Draw tabs
    var actions = [];
    this.context.drawImage(this.playerTabImg,tabX,tabY+=tabHei,tabWid,tabHei);
    this.context.drawImage(this.skillsTabImg,tabX,tabY+=tabHei,tabWid,tabHei);
    if(this.menuTab == 0){
        actions = this.drawPlayerTab({x:placeX,y:placeY,scale:scale}, player);
    }
    else if(this.menuTab == 1){
        actions = this.drawSkillsTab({x:placeX,y:placeY,scale:scale}, player, mAdj, click);
    }


    this.context.fill();
    this.context.restore();

    return actions;
}

Drawing.prototype.drawPlayerTab = function(book, player){
    var wid = $("#canvas").width();
    var hei = $("#canvas").height();

    //Left Side
    //*************************************
    //Draw player

    //Draw equipment

    
    //Right Side
    //*************************************
    //Draw player Stats
    var dX = wid/2 + wid*.05, dY = book.y+hei*.05, line = 15;

    this.context.font = ""+line+"px Arial";
    this.context.fillStyle = 'black';
    this.context.fillText("Name: "           +player.username,                       dX,dY+=line);
    this.context.fillText("LVL: "            +player.level,                          dX,dY+=line);
    this.context.fillText("HP: "             +player.hp+"/"+player.hpMax,            dX,dY+=line);
    this.context.fillText("Energy: "         +player.energy+"/"+player.energyMax,    dX,dY+=line);
    this.context.fillText("Speed: "          +player.speed,                          dX,dY+=line);
    this.context.fillText("Defense: "        +player.defense,                        dX,dY+=line);
    this.context.fillText("Health Regen: "   +(player.inCombathealthRegen*100)+"%",  dX,dY+=line);
    this.context.fillText("Energy Regen: "   +(player.energyRegen*100)+"%",          dX,dY+=line);
    this.context.fillText("Damage: "         +player.damage,                         dX,dY+=line);
    this.context.fillText("Accuracy: "       +(player.accuracy*100)+"%",             dX,dY+=line);
    this.context.fillText("Precision: "      +(player.precision*100)+"%",            dX,dY+=line);
    this.context.fillText("Critical Chance: "+(player.critChance*100)+"%",           dX,dY+=line);
    this.context.fillText("Dodge Chance: "   +(player.dodgeChance*100)+"%",          dX,dY+=line);
    this.context.fillText("Attack Power: "   +player.attackPower,                    dX,dY+=line);
    this.context.fillText("Block Power: "    +player.blockPower,                     dX,dY+=line);
    this.context.fillText("Damage Res: "     +player.damageRes,                      dX,dY+=line);

    //Actions performed
    return [];
}

Drawing.prototype.drawSkillsTab = function(book, player, mouse, click){
    var wid = $("#canvas").width();
    var hei = $("#canvas").height();
    const scale = (1920/wid);
    var actions = [];

    var curTree = player.skillTrees[this.viewTree];
    // console.log(player.skillTrees);

    //Left Side
    var xOffset = 42/scale;
    var startX = book.x+xOffset;
    var startY = book.y+40/scale;
    var lWid = (wid*book.scale/2);

    //Skill Tree Info
    this.context.fillStyle = 'black';
    this.context.font = ""+(40/scale)+"px Arial";
    this.context.fillText(curTree.name.toUpperCase(),startX+10/scale, startY+40/scale);
    this.context.font = ""+(14/scale)+"px Arial";
    var descLines = desciptionWrap(this.context,300/scale,curTree.desc);
    for(var i in descLines){
        this.context.fillText(descLines[i],startX+10/scale, startY+60/scale+i*(14/scale));
    }

    //Base Stats description
    if(curTree.type == "CombatMain"){
        var offset = 470/scale;
        this.context.font = ""+(25/scale)+"px Arial";
        this.context.fillText("BASE STATS",startX+offset, startY+25/scale);
        this.context.font = ""+(18/scale)+"px Arial";
        this.context.fillText("BASE SPEED:"+curTree.baseSpeed,startX+offset, startY+50/scale);
        this.context.fillText("BASE DAMAGE:"+curTree.baseDamage,startX+offset, startY+70/scale);
        this.context.fillText("BASE BLOCK FORCE:"+curTree.baseBlockingForce,startX+offset, startY+90/scale);

        //Set Button
        if(player.selectedCombatTree!=this.viewTree){
            var x = startX+offset+50/scale
                y = startY+100/scale;
            if(mouse.x > x && mouse.x < x+120/scale && mouse.y > y && mouse.y < y+40/scale){
                if(click) actions.push({type:"switchTree",value:this.viewTree});
                this.context.fillStyle = 'black';
                this.context.fillRect(x,y,120/scale,40/scale);
                this.context.fillStyle = 'white';
                this.context.fillText("SET MAIN",startX+offset+65/scale, startY+125/scale);
            }
            else{
                this.context.fillStyle = 'black';
                this.context.rect(x,y,120/scale,40/scale);
                this.context.fillText("SET MAIN",startX+offset+65/scale, startY+125/scale);
            }
        }
    }
    
    //Skill List
    startY = book.y + 200/scale;
    var skillSize = 60/scale;

    //Draw Tree Level
    this.context.fillStyle = "green";
    var x = startX,
        y = startY+1,
        wid = lWid-xOffset,
        hei = Math.min(curTree.appliedSP/curTree.requirements[1].sp,curTree.tiers.length)*(skillSize+50/scale);
    this.context.fillRect(x,y,wid,hei);

    //Draw Skills
    var selectedSkill = null, backupSkill = null;
    for(var tier in curTree.tiers){
        //Draw tier line
        this.context.strokeStyle = "black";
        this.context.moveTo(book.x+42/scale,startY+(skillSize+50/scale)*tier);
        this.context.lineTo(book.x+lWid,startY+(skillSize+50/scale)*tier);
        this.context.stroke();

        //Draw skill boxes
        var margin = lWid/curTree.tiers[tier].length;
        for(var s in curTree.tiers[tier]){
            var skill = curTree.tiers[tier][s];
            x = book.x+margin*s+(margin/2),
            y = startY+(skillSize+50/scale)*tier+25/scale;

            if(backupSkill == null) backupSkill = skill;

            //check selected
            if(this.viewSkill == skill.id){
                this.context.fillStyle = "red";
                this.context.fillRect(x-2,y-2,skillSize+4,skillSize+4);
                selectedSkill = skill;
            }

            this.context.drawImage(this.skillImages[skill.id].image,x,y,skillSize,skillSize);

            //Skill Levels
            var l = 0;
            var gapSizes = [0,10,8,6,4,2];
            var lvlGapWid = gapSizes[skill.maxLevels-1]/scale;
            var lvlWid = (skillSize - (skill.maxLevels-1)*lvlGapWid)/skill.maxLevels;
            this.context.fillStyle = '#0D0';
            for(; l < skill.level; l++){
                this.context.fillRect(x+skillSize+3/scale, y+l*(lvlWid+lvlGapWid), 5/scale, lvlWid);
            }
            this.context.fillStyle = '#000';
            for(; l < skill.maxLevels; l++){
                this.context.fillRect(x+skillSize+3/scale, y+l*(lvlWid+lvlGapWid), 5/scale, lvlWid);
            }

            //Check hover/click
            if(mouse.x > x && mouse.x < x+skillSize && mouse.y > y && mouse.y < y+skillSize){
                this.hoverSkill = skill.id;
                if(click)
                    this.viewSkill = skill.id;

                this.context.fillStyle = "rgba(0,0,255,.2)";
                this.context.fillRect(x,y,skillSize,skillSize);
            }
        }
    }

    if(selectedSkill == null && backupSkill != null && this.testCount >= 1){
        selectedSkill = backupSkill;
        this.viewSkill = selectedSkill.id;
        this.testCount = 0;
    }
    else if(selectedSkill == null && backupSkill != null) this.testCount++;
    else this.testCount = 0; //To remove momentary flash

    //Logo
    startX = book.x+xOffset;
    startY = book.y+55/scale;
    var treeLogoSize = 120/scale;
    var percent = curTree.experience / curTree.experienceNeed;
    this.context.beginPath();
    this.context.fillStyle = '#222';
    this.context.arc(startX+lWid/2,startY+treeLogoSize/2,treeLogoSize/2+4,0,2*Math.PI);
    this.context.fill();
    this.context.beginPath();
    this.context.strokeStyle = '#00DD00';
    this.context.arc(startX+lWid/2,startY+treeLogoSize/2,treeLogoSize/2+2,1.5*Math.PI,3.5*Math.PI-(percent*2)*Math.PI,true);
    this.context.lineWidth = 5/scale;
    this.context.stroke();
    this.context.beginPath();
    this.context.drawImage(this.skillTreeImages[this.viewTree].image,startX+lWid/2-treeLogoSize/2,startY,treeLogoSize,treeLogoSize);

    //Right Side
    
    //Seperator line
    this.context.fillStyle = '#000';
    this.context.fillRect(startX-xOffset+lWid, startY+200/scale, lWid-55/scale, 3/scale);

    //Skill Info
    startX = book.x+lWid+xOffset;
    startY = book.y+280/scale;
    // console.log(selectedSkill);

    if(selectedSkill){
        skillSize = 140/scale;
        this.context.drawImage(this.skillImages[selectedSkill.id].image,startX,startY,skillSize,skillSize);
        this.context.fillStyle = '#000';
        this.context.font = "bold "+(40/scale)+"px Arial";
        this.context.fillText(selectedSkill.name, startX+skillSize+30/scale, startY+30/scale);
        this.context.font = "bold "+(30/scale)+"px Arial";
        this.context.fillText("["+selectedSkill.type+(selectedSkill.subtype?" / "+selectedSkill.subtype:"")+"]", startX+skillSize+30/scale, startY+65/scale);
        this.context.font = ""+(25/scale)+"px Arial";
        var descLines = desciptionWrap(this.context,500/scale,selectedSkill.desc);
        for(var i in descLines){
            this.context.fillText(descLines[i],startX+skillSize+30/scale, startY+95/scale+i*(25/scale));
        }

        //Skill Levels
        var l = 0;
        var gapSizes = [0,10,8,6,4,2];
        var lvlGapWid = gapSizes[selectedSkill.maxLevels-1]/scale;
        var lvlWid = (skillSize - (selectedSkill.maxLevels-1)*lvlGapWid)/selectedSkill.maxLevels;
        this.context.fillStyle = '#0D0';
        for(; l < selectedSkill.level; l++){
            this.context.fillRect(startX+l*(lvlWid+lvlGapWid), startY+skillSize+5/scale, lvlWid, 10/scale);
        }

        this.context.fillStyle = '#000';
        for(; l < selectedSkill.maxLevels; l++){
            this.context.fillRect(startX+l*(lvlWid+lvlGapWid), startY+skillSize+5/scale, lvlWid, 10/scale);
        }

        //Button
        if(selectedSkill.level < selectedSkill.maxLevels && player.skillPoints > 0){
            var x = startX;
                y = startY+skillSize+30/scale;
            if(mouse.x > x && mouse.x < x+skillSize && mouse.y > y && mouse.y < y+40/scale){
                if(click) actions.push({type:"applySP",skill:selectedSkill.id,tree:this.viewTree});
                this.context.fillStyle = 'black';
                this.context.fillRect(x,y,skillSize,40/scale);
                this.context.fillStyle = 'white';
                this.context.fillText("APPLY SP",x+10/scale, y+30/scale);
            }
            else{
                this.context.fillStyle = 'black';
                this.context.strokeStyle = 'black';
                this.context.rect(x,y,skillSize,40/scale);
                this.context.fillText("APPLY SP",x+10/scale, y+30/scale);
                this.context.stroke();
            }
        }


        startX = book.x+lWid+xOffset;
        startY = book.y+skillSize+400/scale;

        //Current Skill
        this.context.fillStyle = '#000';
        this.context.font = "bold "+(40/scale)+"px Arial";
        this.context.fillText("CURRENT", startX+30/scale, startY);
        if(selectedSkill.level == 0){
            //Display None
            this.context.font = ""+(30/scale)+"px Arial";
            this.context.fillText("None", startX+85/scale, startY+=30);
        }
        else{
            this.writeCurrentSkill(player, selectedSkill, startX, startY, scale);
        }


        //dividing Line
        startY = book.y+skillSize+400/scale;
        this.context.fillRect(startX+325/scale,startY-35/scale,3/scale,340/scale);  

        //Next Level
        startX = book.x+lWid+430/scale;
        startY = book.y+skillSize+400/scale;
        this.context.font = "bold "+(40/scale)+"px Arial";
        this.context.fillText("NEXT", startX+60/scale, startY);
        if(selectedSkill.level == 0){
            this.writeCurrentSkill(player, selectedSkill, startX, startY, scale);
        }
        else if(selectedSkill.upgrade != null && selectedSkill.level < selectedSkill.maxLevels){
            //Display Increase
            this.context.font = ""+(23/scale)+"px Arial";
            var keys = Object.keys(selectedSkill.upgrade);
            for(var k in keys){
                var value = selectedSkill.upgrade[""+keys[k]].toFixed(2);
                this.context.fillText(propertyUpgradeLookup(keys[k], value), startX, startY+=24);
            }
        }
        else{
            //No more Upgrades
            this.context.font = ""+(30/scale)+"px Arial";
            this.context.fillText("Maxed out", startX+40/scale, startY+=30);
        }
    }


    //Skill Trees
    startX = book.x+lWid+15/scale;
    startY = book.y+80/scale;
    treeLogoSize = 70/scale;


    this.context.strokeStyle = '#0D0';
    this.context.fillStyle = '#000';
    this.context.font = "bold "+(18/scale)+"px Arial";
    this.context.fillText("IN USE:",startX, startY);
    this.context.fillText("EXTRA :",startX, startY+treeLogoSize+25/scale);
    this.context.font = "bold "+(35/scale)+"px Arial";
    this.context.fillText("SP: "+player.skillPoints,startX+lWid-200/scale, startY);

    var activeCount = 0, addCount = 0;
    startX = book.x+lWid+xOffset*3.2;
    startY = book.y+40/scale;
    for(var t in player.skillTrees){
        var tree = player.skillTrees[t];
        percent = tree.experience / tree.experienceNeed;

        var aOffset, yPlacement;

        //Determine if active or additional
        if((t == player.selectedCombatTree && tree.type=="CombatMain") || (tree.type=="CombatAdd" && tree.appliedSP > 0)){
            //Active
            aOffset = activeCount*(treeLogoSize+20/scale);
            yPlacement = 0;
            activeCount++;
        }
        else{
            //Additional
            aOffset = addCount*(treeLogoSize-10/scale);
            yPlacement = treeLogoSize+25/scale;
            addCount++;
        }
        this.context.beginPath();
        this.context.fillStyle = '#222';
        this.context.arc(startX+aOffset,startY+yPlacement+treeLogoSize/2,treeLogoSize/2+4,0,2*Math.PI);
        this.context.fill();
        this.context.beginPath();
        this.context.fillStyle = '#00DD00';
        this.context.arc(startX+aOffset,startY+yPlacement+treeLogoSize/2,treeLogoSize/2+2,1.5*Math.PI,3.5*Math.PI-(percent*2)*Math.PI,true);
        this.context.lineWidth = 4/scale;
        this.context.stroke();
        this.context.beginPath();
        this.context.drawImage(this.skillTreeImages[t].image,startX+aOffset-treeLogoSize/2,startY+yPlacement,treeLogoSize,treeLogoSize);
    
        //Check hover/click
        if(Util.calculateDistance({x:mouse.x,y:mouse.y},{x:startX+aOffset,y:startY+yPlacement+treeLogoSize/2}) <= treeLogoSize/2){
            this.hoverTree = t;
            if(click)
                this.viewTree = t;

            this.context.beginPath();
            this.context.fillStyle = "rgba(0,0,255,.2)";
            this.context.arc(startX+aOffset,startY+yPlacement+treeLogoSize/2,treeLogoSize/2+4,0,2*Math.PI);
            this.context.fill(); 
        }
    }

    //Actions performed
    return actions;
}

Drawing.prototype.writeCurrentSkill = function(player, skill, startX, startY, scale){
    var write = skill.level == 0?skill.base:skill.curSkill;

    if(skill.type == "attack"){
        this.context.font = ""+(23/scale)+"px Arial";
        this.context.fillText("Damage: "+(write.sequence[0][0].damage*player.damage).toFixed(2), startX, startY+=24);
        this.context.fillText("Cooldown: "+write.sequence[0][0].cooldown.toFixed(2), startX, startY+=24);
        this.context.fillText("Energy Usage: "+write.energyUsage.toFixed(2), startX, startY+=24);
        this.context.fillText("Knockback: "+write.sequence[0][0].knockback.toFixed(0), startX, startY+=24);
        this.context.fillText("Attack Force: "+write.sequence[0][0].attackForce.toFixed(0), startX, startY+=24);
    }
    else if(skill.type == "combo" && skill.subtype == null){
        var cInfo = getComboInformation(write);

        this.context.font = "bold "+(23/scale)+"px Arial";
        this.context.fillText("Sequence: "+cInfo.sequence, startX, startY+=24);
        this.context.font = ""+(23/scale)+"px Arial";
        this.context.fillText("Attacks: "+cInfo.attacks, startX, startY+=24);
        this.context.fillText("Damage: "+(cInfo.damage*player.damage).toFixed(2), startX, startY+=24);
        this.context.fillText("Cooldown: "+cInfo.cooldown.toFixed(2), startX, startY+=24);
        this.context.fillText("Energy Usage: "+cInfo.energyUsage.toFixed(0), startX, startY+=24);
        this.context.fillText("Knockback: "+cInfo.knockback.toFixed(0), startX, startY+=24);
        this.context.fillText("Attack Force: "+cInfo.attackForce.toFixed(0), startX, startY+=24);
    }
    else if(skill.type == "combo" && skill.subtype == "finisher"){
        var starter = "";
        var list = player.skillTrees[player.selectedCombatTree].comboListOpt;
        for(var c in list){
            if(list[c].id == skill.comboID){
                var temp = getComboInformation(list[c]);
                starter = temp.sequence;
            }

        }
        var cInfo = getComboUpgradeInformation(write);

        this.context.font = "bold "+(23/scale)+"px Arial";
        this.context.fillText("Sequence: ["+starter+"]"+cInfo.sequence, startX, startY+=24);
        this.context.font = ""+(23/scale)+"px Arial";
        this.context.fillText("Attacks: "+cInfo.attacks, startX, startY+=24);
        this.context.fillText("Damage: "+(cInfo.damage*player.damage).toFixed(2), startX, startY+=24);
        this.context.fillText("Cooldown: "+cInfo.cooldown.toFixed(2), startX, startY+=24);
        this.context.fillText("Energy Usage: "+cInfo.energyUsage.toFixed(0), startX, startY+=24);
        this.context.fillText("Knockback: "+cInfo.knockback.toFixed(0), startX, startY+=24);
        this.context.fillText("Attack Force: "+cInfo.attackForce.toFixed(0), startX, startY+=24);
    }
    else if(skill.type == "passive" || (skill.type == "active" && skill.subtype == "stance")){
        this.context.font = ""+(23/scale)+"px Arial";
        var keys = Object.keys(write);
        for(var k in keys){
            var value = write[""+keys[k]].toFixed(2);
            this.context.fillText(propertyUpgradeLookup(keys[k], value), startX, startY+=24);
        }
    }     
}

Drawing.prototype.drawText = function(text,x,y) {
    this.context.save();
    this.context.beginPath();
    this.context.fillStyle = 'white';
    this.context.fillRect(x-10,y-10,100,15);
    this.context.fillStyle = 'black';
    this.context.fillText(text,x,y);
    this.context.fill();
    this.context.restore();
}


//Image loading
//**********************************************************************
Drawing.prototype.loadMaps = function(maps, curMap){
    this.maps = [];
    this.curMap = curMap;

    for(var m in maps){
        var topLayer = new Image, bottomLayer = new Image;
        bottomLayer.src = "/images/maps/"+maps[m]+" [layer 1].png";
        topLayer.src = "/images/maps/"+maps[m]+" [layer 2].png";

        this.maps.push({
            name: maps[m],
            topLayer: topLayer,
            bottomLayer: bottomLayer
        });
    }

    // console.log(this.maps);
}

Drawing.prototype.loadSkillImages = function(skillTrees){
    this.skillTreeImages = [];

    var temp = [];
    for(var t in skillTrees){
        var stImage = new Image;
        stImage.src = "/images/skills/"+skillTrees[t].name+".png";

        this.skillTreeImages.push({
            name: skillTrees[t].name,
            image: stImage
        });

        //Collect skills
        for(var tier = 0; tier < 5; tier++){
            for(var s in skillTrees[t].tiers[tier]){
                var sImage = new Image;
                sImage.src = "/images/skills/"+skillTrees[t].tiers[tier][s].id+".png";

                temp.push({
                    id: skillTrees[t].tiers[tier][s].id,
                    image: sImage
                });
            }
        }
    }


    //Order skills in place (for O(1) retrieval)
    this.skillImages = [];
    for(var s in temp){
        this.skillImages[temp[s].id] = temp[s];
    }
}

Drawing.prototype.loadImages = function(){
    //Player images
    this.playerImg = new Image;
    this.playerImg.src = "/images/player.png";
    this.oPlayerImg = new Image;
    this.oPlayerImg.src = "/images/other_player.png";
    this.waterMaskImg = new Image;
    this.waterMaskImg.src = "/images/water_mask.png";

    //Weapon Images
    this.bulletImg = new Image;
    this.bulletImg.src = "/images/bullet.png";
    this.punchImg = new Image;
    this.punchImg.src = "/images/punch.png";
    this.kickImg = new Image;
    this.kickImg.src = "/images/kick.png";
    this.swordImg = new Image;
    this.swordImg.src = "/images/sword.png";
    this.blockImg = new Image;
    this.blockImg.src = "/images/block.png";
    this.blockPunchImg = new Image;
    this.blockPunchImg.src = "/images/block_punch.png";
    this.blockKickImg = new Image;
    this.blockKickImg.src = "/images/block_kick.png";
    this.blockSwordImg = new Image;
    this.blockSwordImg.src = "/images/block_sword.png";

    //Menuing Images
    this.menuBookImg = new Image;
    this.menuBookImg.src = "/images/menu/menu_book.png";
    this.playerTabImg = new Image;
    this.playerTabImg.src = "/images/menu/player_tab.png";
    this.skillsTabImg = new Image;
    this.skillsTabImg.src = "/images/menu/skills_tab.png";
}


//UTIL
//**********************************************************************
Drawing.prototype.changeMap = function(curMap){

    this.curMap = curMap;
}

Drawing.prototype.resize = function(){
    // console.log("HIT");
    const widthToHeight = 1920 / 1080;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    var newWidthToHeight = newWidth / newHeight;

    if(newWidthToHeight > widthToHeight){
        newWidth = newHeight * widthToHeight;
    }
    else{
        newHeight = newWidth / widthToHeight;
    }

    $("#gameArea").css({
        "height":newHeight+"px",
        "width":newWidth+"px",
        "margin-top": (-newHeight / 2) + "px",
        "margin-left": (-newWidth / 2) + "px"
    });

    $("#canvas").attr("width",newWidth+"px");
    $("#canvas").attr("height",newHeight+"px");
}

function mouseCoordsAdjust(mouse){
    var mX,mY;

    var cWid = $("#canvas").width();
    var cHei = $("#canvas").height();
    var wWid = window.innerWidth;
    var wHei = window.innerHeight;

    if(wWid > cWid) mX = mouse[0] - (wWid-cWid)/2; 
    else mX = mouse[0];

    if(wHei > cHei) mY = mouse[1] - (wHei-cHei)/2; 
    else mY = mouse[1];

    return {x:mX,y:mY};
}

function desciptionWrap(context, max_width, desc){
    var lines = [], width, result, text = desc;

    while (text.length) {
        for( i=text.length; context.measureText(text.substr(0,i)).width > max_width; i-- );

        result = text.substr(0,i);

        if ( i !== text.length )
            for( j=0; result.indexOf(" ",j) !== -1; j=result.indexOf(" ",j)+1 );

        lines.push(result.substr(0, j||result.length));
        width = Math.max(width, context.measureText(lines[lines.length-1]).width);
        text  = text.substr(lines[lines.length-1].length, text.length);
    }

    return lines;
}

function propertyUpgradeLookup(property, value){
    var upgrade = "MISSING...";
    
    if      (property == "damage")      upgrade = (value>0?"+":"")+(value*100)+"% Damage";
    else if (property == "cooldown")    upgrade = (value>0?"+":"")+(value)+" Cooldown";
    else if (property == "energyUsage") upgrade = (value>0?"+":"")+(value)+" Energy Usage";
    else if (property == "energyMax")   upgrade = (value>0?"+":"")+(value)+" Maximum Energy";
    else if (property == "blockPower")  upgrade = (value>0?"+":"")+(value)+" Blocking Power";
    else if (property == "hAtk")        upgrade = (value>0?"+":"")+(value*100)+"% Heavy Attack";
    else if (property == "lAtk")        upgrade = (value>0?"+":"")+(value*100)+"% Light Attack";
    else if (property == "cAtk")        upgrade = (value>0?"+":"")+(value*100)+"% Combo Attack";
    else if (property == "speed")       upgrade = (value>0?"+":"")+(value*100)+"% Speed";
    else if (property == "dodgeChance") upgrade = (value>0?"+":"")+(value*100)+"% Dodge Chance";
    else if (property == "debuffChance")    upgrade = (value>0?"+":"")+(value*100)+"% Debuff Chance";
    else if (property == "abilityCooldown") upgrade = (value>0?"+":"")+(value)+" Ability Cooldown";

    return upgrade;
}

function propertyWordLookup(property){
    var word = "MISSING...";
    
    if      (property == "damage")          word = "Damage";
    else if (property == "cooldown")        word = "Cooldown";
    else if (property == "energyUsage")     word = "Energy Usage";
    else if (property == "energyMax")       word = "Maximum Energy";
    else if (property == "blockPower")      word = "Blocking Power";
    else if (property == "hAtk")            word = "Heavy Attack";
    else if (property == "lAtk")            word = "Light Attack";
    else if (property == "cAtk")            word = "Combo Attack";
    else if (property == "speed")           word = "Speed";
    else if (property == "dodgeChance")     word = "Dodge Chance";
    else if (property == "debuffChance")    word = "Debuff Chance";
    else if (property == "abilityCooldown") word = "Ability Cooldown";

    return word;
}

function getComboInformation(combo){
    var cInfo = {
        damage: 0,
        attacks: 0,
        cooldown: 0,
        energyUsage: 0,
        attackForce: 0,
        knockback: 0,
        sequence: ""
    };

    for(var s in combo.steps){
        var step = combo.steps[s];
        cInfo.sequence+=step.input;

        if(step.attack!=null && step.attack.name == combo.name){
            //In main combo
            cInfo.energyUsage = step.attack.energyUsage;

            var lastAttack = null;
            for(var stage in step.attack.sequence){ //phase of attack
                for(var a in step.attack.sequence[stage]){ //Attacks
                    var attack = step.attack.sequence[stage][a];
                    lastAttack = attack;
                    cInfo.damage += attack.damage;
                    cInfo.attacks++;
                    if(cInfo.attackForce < attack.attackForce) cInfo.attackForce = attack.attackForce;
                }
            }

            //Last Attack
            cInfo.knockback = lastAttack.knockback;
            cInfo.cooldown = lastAttack.cooldown;
            
            break;
        }
    }

    return cInfo;
}

function getComboUpgradeInformation(combo){
    var cInfo = {
        damage: 0,
        attacks: 0,
        cooldown: 0,
        energyUsage: combo.attack.energyUsage,
        attackForce: 0,
        knockback: 0,
        sequence: combo.input
    };

    var lastAttack = null;
    for(var stage in combo.attack.sequence){ //phase of attack
        for(var a in combo.attack.sequence[stage]){ //Attacks
            var attack = combo.attack.sequence[stage][a];
            lastAttack = attack;
            cInfo.damage += attack.damage;
            cInfo.attacks++;
            if(cInfo.attackForce < attack.attackForce) cInfo.attackForce = attack.attackForce;
        }
    }

    //Last Attack
    cInfo.knockback = lastAttack.knockback;
    cInfo.cooldown = lastAttack.cooldown;

    return cInfo;
}