/**
 * Creates a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @constructor
 */
function Drawing(context) {
    this.context = context;
    this.scale = 3;

    this.loadImages();
}

/**
 * This is a factory method for creating a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @return {Drawing}
 */
Drawing.create = function(context) {
    
    return new Drawing(context);
};

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
};

/**
 * Clears the canvas context.
 */
Drawing.prototype.clear = function() {
    var canvas = this.context.canvas;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
};

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
};

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
};

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

Drawing.prototype.setScale = function(scale){
    
    this.scale = scale;
}


//UTIL
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

Drawing.prototype.changeMap = function(curMap){

    this.curMap = curMap;
}

Drawing.prototype.resize = function(){
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

Drawing.prototype.loadImages = function(){
    this.playerImg = new Image;
    this.playerImg.src = "/images/player.png";

    this.oPlayerImg = new Image;
    this.oPlayerImg.src = "/images/other_player.png";

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

    this.waterMaskImg = new Image;
    this.waterMaskImg.src = "/images/water_mask.png";
}