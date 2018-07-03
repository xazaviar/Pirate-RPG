const Util = require('../shared/Util');

const DIMENSIONS = 2;

/**
 * Constructor for an Entity2D.
 * @constructor
 * @param {Array<number>} position The position of the Entity2D
 * @param {Array<number>} velocity The velocity of the Entity2D
 * @param {Array<number>} acceleration The acceleration of the Entity2D
 * @param {number} orientation The orientation of the Entity2D (radians)
 * @param {number} mass The mass of the Entity2D
 * @param {number} hitbox The radius of the Entity2D's circular hitbox
 */
function Entity2D(position, velocity, acceleration, orientation, mass, hitbox) {
  this.position = position || [0, 0];
  this.velocity = velocity || [0, 0];
  this.acceleration = acceleration || [0, 0];
  this.orientation = orientation || 0;
  this.mass = mass || 1;
  this.hitbox = hitbox || 0;

  this.lastUpdateTime = 0;
  this.deltaTime = 0;
  this.distanceTravelled = 0;

  Util.splitProperties(this, ['x', 'y'], 'position');
  Util.splitProperties(this, ['vx', 'vy'], 'velocity');
  Util.splitProperties(this, ['ax', 'ay'], 'acceleration');
}

/**
 * Applies a force to the Entity2D.
 * @param {Array<number>} force The force to apply
 */
Entity2D.prototype.applyForce = function(force) {
  for (var i = 0; i < DIMENSIONS; ++i) {
    this.acceleration[i] += force[i] / this.mass;
  }
};

/**
 * Returns true if this Entity2D is contact with or intersecting another
 * Entity2D.
 * @param {Entity2D} other The other Entity2D to check against
 * @return {boolean}
 */
Entity2D.prototype.isCollidedWith = function(other) {
  var minDistance = (this.hitbox/2 + other.hitbox/2);

  var distance = Util.calculateDistance({x:this.x,y:this.y},{x:other.x,y:other.y});

  // console.log(distance,minDistance,(distance <= minDistance));

  return (distance <= minDistance);
};

/**
 * Steps this Entity2D forward in time and updates the position, velocity,
 * and acceleration.
 * @param {?number=} deltaTime An optional deltaTime to update with
 */
Entity2D.prototype.update = function(deltaTime) {
  var currentTime = (new Date()).getTime();
  if (deltaTime) {
    this.deltaTime = deltaTime;
  } else if (this.lastUpdateTime === 0) {
    this.deltaTime = 0;
  } else {
    this.deltaTime = (currentTime - this.lastUpdateTime) / 1000;
  }
  
  this.distanceTravelled += Util.calculateDistance({x:this.velocity[0],y:this.velocity[1]},{x:0,y:0}) * this.deltaTime;

  for (var i = 0; i < DIMENSIONS; ++i) {
    this.position[i] += this.velocity[i] * this.deltaTime;
    this.velocity[i] += this.acceleration[i] * this.deltaTime;
    this.acceleration[i] = 0;

  }
  this.lastUpdateTime = currentTime;
};

module.exports = Entity2D;
