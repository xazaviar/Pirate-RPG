/**
 * @fileoverview This is a utility class containing utility methods used on the
 * server and client.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */ 

/**
 * Empty constructor for the Util class, all functions will be static.
 */
function Util() {
    throw new Error('Util should not be instantiated!');
}

/**
 * This function takes an object and defines getter and setter methods for
 * it. This is best demonstrated with an example:
 *
 * Util.splitProperties(object, ['x', 'y'], 'position')
 * will assign object.x as the getter/setter for object['position'][0]
 * and object.y as the getter/setter for object['position'][1]
 *
 * Util.splitProperties(object, ['vx', 'vy', 'vz'], 'velocity')
 * will assign object.vx as the getter/setter for object['velocity'][0],
 * object.vy as the getter/setter for object['velocity'][1],
 * and object.vz as the getter/setter for object['velocity'][2].
 * @param {Object} object The object to apply the properties to
 * @param {Array<string>} propertyNames The property names to apply
 * @param {string} propertyFrom The property to split
 */
Util.splitProperties = function(object, propertyNames, propertyFrom) {
    for (var i = 0; i < propertyNames.length; ++i) {
        (function(j) {
        Object.defineProperty(object, propertyNames[j], {
            enumerable: true,
            configurable: true,
            get: function() {
                return this[propertyFrom][j];
            },
            set: function(property) {
                this[propertyFrom][j] = property;
            }
        });
        })(i);
    }
};

/**
 * Allows for ES5 class inheritance by implementing functionality for a
 * child class to inherit from a parent class.
 * @param {Object} child The child object that inherits the parent
 * @param {Object} parent The parent object to inherit from
 */
Util.extend = function (child, parent) {
    child.prototype = Object.create(parent);
    child.prototype.parent = parent.prototype;
};

/**
 * Binds a function to a context, useful for assigning event handlers and
 * function callbacks.
 * @param {Object} context The context to assign the method to.
 * @param {function(?)} method The method to bind the context to.
 * @return {function(?)}
 */
Util.bind = function(context, method) {
    return function() {
        return method.apply(context, arguments);
    }
};

/**
 * This method returns the sign of a number.
 * @param {number} x The number to check.
 * @return {number}
 */
Util.getSign = function(x) {
    if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    }
    return 0;
};

/**
 * This method linearly scales a number from one range to another.
 * @param {number} x The number to scale.
 * @param {number} a1 The lower bound of the range to scale from.
 * @param {number} a2 The upper bound of the range to scale from.
 * @param {number} b1 The lower bound of the range to scale to.
 * @param {number} b2 The upper bound of the range to scale to.
 * @return {number}
 */
Util.linearScale = function(x, a1, a2, b1, b2) {
    return ((x - a1) * (b2 - b1) / (a2 - a1)) + b1;
};

/**
 * Returns the sum of all the elements in an array.
 * @param {Array<number>} array An array to sum.
 * @return {number}
 */
Util.sum = function(array) {
    return array.reduce((total, value) =>  total + value);
}

/**
 * Returns the Manhattan Distance between two points.
 * @param {Array<number>} p1 The first point.
 * @param {Array<number>} p2 The second point.
 * @return {number}
 */
Util.getManhattanDistance = function(p1, p2) {
    if (p1.length != p2.length) {
        throw new Error(`Cannot compute distance between ${p1} and ${p2}`);
    }
    return Util.sum(p1.map((value, index) => {
        return Math.abs(value - p2[index]);
    }));
};

/**
 * Returns the squared Euclidean distance between two points.
 * @param {Array<number>} p1 The first point.
 * @param {Array<number>} p2 The second point.
 * @return {number}
 */
Util.getEuclideanDistance2 = function(p1, p2) {
    if (p1.length != p2.length) {
        throw new Error(`Cannot compute distance between ${p1} and ${p2}`);
    }
    return Util.sum(p1.map((value, index) => {
        return (value - p2[index]) * (value - p2[index]);
    }));
};

/**
 * Returns the true Euclidean distance between two points.
 * @param {Array<number>} p1 The first point.
 * @param {Array<number>} p2 The second point.
 * @return {number}
 */
Util.getEuclideanDistance = function(p1, p2) {
    return Math.sqrt(Util.getEuclideanDistance2(p1, p2));
};

/**
 * Given a value, a minimum, and a maximum, returns true if value is
 * between the minimum and maximum, inclusive of both bounds. This
 * functio will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum bound.
 * @param {number} max The maximum bound.
 * @return {boolean}
 */
Util.inBound = function(val, min, max) {
    if (min > max) {
        return val >= max && val <= min;
    }
    return val >= min && val <= max;
};

/**
 * Bounds a number to the given minimum and maximum, inclusive of both
 * bounds. This function will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum number to bound to.
 * @param {number} max The maximum number to bound to.
 * @return {number}
 */
Util.bound = function(val, min, max) {
    if (min > max) {
        return Math.min(Math.max(val, max), min);
    }
    return Math.min(Math.max(val, min), max);
};

/**
 * Returns a random floating-point number between the given min and max
 * values, exclusive of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 * @return {number}
 */
Util.randRange = function(min, max) {
    if (min >= max) {
        var swap = min;
    min = max;
        max = swap;
    }
    return (Math.random() * (max - min)) + min;
};

/**
 * Returns a random integer between the given min and max values, exclusive
 * of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 * @return {number}
 */
Util.randRangeInt = function(min, max) {
    if (min >= max) {
        var swap = min;
        min = max;
        max = swap;
    }
    return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Returns a random element in a given array.
 * @param {Array<*>} array The array from which to select a random
 *   element from.
 * @return {*}
 */
Util.choiceArray = function(array) {
    return array[Util.randRangeInt(0, array.length)];
};

if (typeof module === 'object') {
    module.exports = Util;
} else {
    window.Util = Util;
}


Util.calculateAngle = function(p1,p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)+Math.PI/2;
}

Util.calculateDistance = function(p1,p2){
    return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
}



Util.calculateCorners = function(center,wid,hei,theta){
    var corners = {};
    var cos = Math.cos(theta);
    var sin = Math.sin(theta);

    var transformedX = center.x * cos - center.y * sin;
    var transformedY = center.x * sin + center.y * cos;

    //top left corner
    var hw = -wid/2;
    var hh = -hei/2;
    corners["tl"] = [(hw*cos-hh*sin)+transformedX,(hw*sin+hh*cos)+transformedY];

    //top right corner
    hw = wid/2;
    hh = -hei/2;
    corners["tr"] = [(hw*cos-hh*sin)+transformedX,(hw*sin+hh*cos)+transformedY];

    //bottom left corner
    hw = -wid/2;
    hh = hei/2;
    corners["bl"] = [(hw*cos-hh*sin)+transformedX,(hw*sin+hh*cos)+transformedY];

    //bottom right corner
    hw = wid/2;
    hh = hei/2;
    corners["br"] = [(hw*cos-hh*sin)+transformedX,(hw*sin+hh*cos)+transformedY];

    return corners;
}

/*
 * Rect {x,y,wid,hei,theta}
 * circle {x,y,radius}
 * ***ref: https://codepen.io/JChehe/pen/dWmYjO?editors=0010
 * ***ref: https://yal.cc/rectangle-circle-intersection-test/s
 */
Util.rectCircleCollision = function(rect,circle){
    var cx, cy;
    var angleOfRad = rect.deg;
    var rectCenterX = rect.x;
    var rectCenterY = rect.y;

    var rotateCircleX = Math.cos(angleOfRad) * (circle.x - rectCenterX) - Math.sin(angleOfRad) * (circle.y - rectCenterY) + rectCenterX
    var rotateCircleY = Math.sin(angleOfRad) * (circle.x - rectCenterX) + Math.cos(angleOfRad) * (circle.y - rectCenterY) + rectCenterY


    if (rotateCircleX < rect.x - rect.w / 2) {
        cx = rect.x - rect.w / 2;
    } else if (rotateCircleX > rect.x + rect.w / 2) {
        cx = rect.x + rect.w / 2;
    } else {
        cx = rotateCircleX;
    }

    if (rotateCircleY < rect.y - rect.h / 2) {
        cy = rect.y - rect.h / 2;
    } else if (rotateCircleY > rect.y + rect.h / 2) {
        cy = rect.y + rect.h / 2;
    } else {
        cy = rotateCircleY;
    }

    if(Util.calculateDistance({x:rotateCircleX, y:rotateCircleY}, {x:cx, y:cy}) < circle.r){
        var cVec = {x:circle.r*Math.sin(circle.orient),y:circle.r*Math.cos(circle.orient)};
        var rVec = {x:rect.x-circle.x,y:rect.y-circle.y};
        var angle = (Math.atan2(cVec.y,cVec.x) + (Math.atan2(rVec.y,rVec.x) ) * 180 / Math.PI)+90;

        if(angle > circle.orient*180/Math.PI-90 && angle < circle.orient*180/Math.PI+90){
        return "front";
        }

        return "back";
    }

    return false;
}

Util.rectCircleCollision2 = function(rect,circle){
    var unrotatedCircleX = Math.cos(rect.theta) * (circle.x - rect.x) - Math.sin(rect.theta) * (circle.y - rect.y) + rect.x;
    var unrotatedCircleY = Math.sin(rect.theta) * (circle.x - rect.x) + Math.cos(rect.theta) * (circle.y - rect.y) + rect.y;
    var DeltaX = unrotatedCircleX - Math.max(rect.x-rect.wid/2, Math.min(unrotatedCircleX, rect.x-rect.wid/2 + rect.wid));
    var DeltaY = unrotatedCircleY - Math.max(rect.y-rect.hei/2, Math.min(unrotatedCircleY, rect.y-rect.hei/2 + rect.hei));
    return (DeltaX * DeltaX + DeltaY * DeltaY) <= (circle.radius * circle.radius);
}


/*
 * Reference: https://stackoverflow.com/questions/37224912/circle-line-segment-collision
 */
Util.cirlcleDistFromLine = function(circle, rect, line){
    //Determine which rectangle line
    var l;
    if(line=="top"){
        l = {
            p1: {
                x:rect.x,
                y:rect.y
            },
            p2: {
                x:rect.x+rect.width,
                y:rect.y
            }
        }
    }
    else if(line=="bottom"){
        l = {
            p1: {
                x:rect.x,
                y:rect.y+rect.height
            },
            p2: {
                x:rect.x+rect.width,
                y:rect.y+rect.height
            }
        }
    }
    else if(line=="left"){
        l = {
            p1: {
                x:rect.x,
                y:rect.y
            },
            p2: {
                x:rect.x,
                y:rect.y+rect.height
            }
        }
    }
    else if(line=="right"){
        l = {
            p1: {
                x:rect.x+rect.width,
                y:rect.y
            },
            p2: {
                x:rect.x+rect.width,
                y:rect.y+rect.height
            }
        }
    }

    var v1, v2, v3, u;
    v1 = {};
    v2 = {};
    v3 = {};
    v1.x = l.p2.x - l.p1.x;
    v1.y = l.p2.y - l.p1.y;
    v2.x = circle.x - l.p1.x;
    v2.y = circle.y - l.p1.y;
    u = (v2.x * v1.x + v2.y * v1.y) / (v1.y * v1.y + v1.x * v1.x); // unit dist of point on line
    if(u >= 0 && u <= 1){
        v3.x = (v1.x * u + l.p1.x) - circle.x;
        v3.y = (v1.y * u + l.p1.y) - circle.y;
        v3.x *= v3.x;
        v3.y *= v3.y;
        return Math.sqrt(v3.y + v3.x); // return distance from line
    } 
    // get distance from end points
    v3.x = circle.x - l.p2.x;
    v3.y = circle.y - l.p2.y;
    v3.x *= v3.x;  // square vectors
    v3.y *= v3.y;    
    v2.x *= v2.x;
    v2.y *= v2.y;
    return Math.min(Math.sqrt(v2.y + v2.x), Math.sqrt(v3.y + v3.x)); // return smaller of two distances as the result
}


Util.rectangleRectangleCollision = function(entity, rect, line){
    var l;
    if(line=="top"){
        l = {
            p1: {
                x:rect.x,
                y:rect.y
            },
            p2: {
                x:rect.x+rect.width,
                y:rect.y
            }
        }
    }
    else if(line=="bottom"){
        l = {
            p1: {
                x:rect.x,
                y:rect.y+rect.height
            },
            p2: {
                x:rect.x+rect.width,
                y:rect.y+rect.height
            }
        }
    }
    else if(line=="left"){
        l = {
            p1: {
                x:rect.x,
                y:rect.y
            },
            p2: {
                x:rect.x,
                y:rect.y+rect.height
            }
        }
    }
    else if(line=="right"){
        l = {
            p1: {
                x:rect.x+rect.width,
                y:rect.y
            },
            p2: {
                x:rect.x+rect.width,
                y:rect.y+rect.height
            }
        }
    }

    var top     = Util.lineLineCollision({
                        p1: {
                            x:entity.x,
                            y:entity.y
                        },
                        p2: {
                            x:entity.x+entity.width,
                            y:entity.y
                        }
                    },l);
    var bottom  = Util.lineLineCollision({
                        p1: {
                            x:entity.x,
                            y:entity.y+entity.height
                        },
                        p2: {
                            x:entity.x+entity.width,
                            y:entity.y+entity.height
                        }
                    },l);
    var left    = Util.lineLineCollision({
                        p1: {
                            x:entity.x,
                            y:entity.y
                        },
                        p2: {
                            x:entity.x,
                            y:entity.y+entity.height
                        }
                    },l);
    var right   = Util.lineLineCollision({
                        p1: {
                            x:entity.x+entity.width,
                            y:entity.y
                        },
                        p2: {
                            x:entity.x+entity.width,
                            y:entity.y+entity.height
                        }
                    },l);

    return left || right || top || bottom;
}

Util.lineLineCollision = function(line1,line2){
    //Check entity against line collision
    var uA = ((line2.p2.x-line2.p1.x)*(line1.p1.y-line2.p1.y) - (line2.p2.y-line2.p1.y)*(line1.p1.x-line2.p1.x)) / ((line2.p2.y-line2.p1.y)*(line1.p2.x-line1.p1.x) - (line2.p2.x-line2.p1.x)*(line1.p2.y-line1.p1.y));
    var uB = ((line1.p2.x-line1.p1.x)*(line1.p1.y-line2.p1.y) - (line1.p2.y-line1.p1.y)*(line1.p1.x-line2.p1.x)) / ((line2.p2.y-line2.p1.y)*(line1.p2.x-line1.p1.x) - (line2.p2.x-line2.p1.x)*(line1.p2.y-line1.p1.y));

    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}
