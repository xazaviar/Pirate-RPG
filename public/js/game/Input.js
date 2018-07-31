

/**
 * Empty constructor for the Input object.
 */
function Input() {
  throw new Error('Input should not be instantiated!');
}
Input.LAST_INPUT_RECEIVED = new Date();

Input.LEFT_CLICK  = false;
Input.RIGHT_CLICK = false;
Input.MOUSE       = [0, 0];

Input.LEFT        = false;
Input.UP          = false;
Input.RIGHT       = false;
Input.DOWN        = false;
Input.DODGE       = false;
Input.BLOCK       = false;
Input.RESPAWN     = false;
Input.MENU        = false;
                    //1,2,3,4,5,6,7,8,9,0,-,=
Input.ACTION_KEYS = [false,false,false,false,
                     false,false,false,false,
                     false,false,false,false];
Input.MISC_KEYS   = {};

/**
 * This method is a callback bound to the onmousedown event
 * and updates the state of the mouse click stored in the Input class.
 * @param {Event} event The event passed to this function
 */
Input.onMouseDown = function(event) {
  if (event.which == 1) {
    Input.LEFT_CLICK = true;
  } else if (event.which == 2) {
    Input.BLOCK = true;
  } else if (event.which == 3) {
    Input.RIGHT_CLICK = true;
  }
  Input.LAST_INPUT_RECEIVED = new Date();
};

/**
 * This method is a callback bound to the onmouseup event on and
 * updates the state of the mouse click stored in the Input class.
 * @param {Event} event The event passed to this function.
 */
Input.onMouseUp = function(event) {
  if (event.which == 1) {
    Input.LEFT_CLICK = false;
  } else if (event.which == 2) {
    Input.BLOCK = false;
  } else if (event.which == 3) {
    Input.RIGHT_CLICK = false;
  }
  Input.LAST_INPUT_RECEIVED = new Date();
};

/**
 * This method is a callback bound to the onkeydown event on the document and
 * @param {Event} event The event passed to this function.
 * updates the state of the keys stored in the Input class.
 */
Input.onKeyDown = function(event) {
  switch (event.keyCode) {
    case 37:
    case 65:
      Input.LEFT = true;
      break;
    case 38:
    case 87:
      Input.UP = true;
      break;
    case 39:
    case 68:
      Input.RIGHT = true;
      break;
    case 40:
    case 83:
      Input.DOWN = true;
      break;
    case 32:
      Input.DODGE = true;
      break;
    case 89:
      Input.RESPAWN = true;
      break;
    case 27:
      Input.MENU = true;
      break;
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      Input.ACTION_KEYS[event.keyCode-49] = true;
      break;
    case 48:
      Input.ACTION_KEYS[9] = true;
      break;
    case 189:
      Input.ACTION_KEYS[10] = true;
      break;
    case 187:
      Input.ACTION_KEYS[11] = true;
      break;
    default:
      Input.MISC_KEYS[event.keyCode] = true;
      break;
  }
  Input.LAST_INPUT_RECEIVED = new Date();
};

/**
 * This method is a callback bound to the onkeyup event on the document and
 * updates the state of the keys stored in the Input class.
 * @param {Event} event The event passed to this function.
 */
Input.onKeyUp = function(event) {
  switch (event.keyCode) {
    case 37:
    case 65:
      Input.LEFT = false;
      break;
    case 38:
    case 87:
      Input.UP = false;
      break;
    case 39:
    case 68:
      Input.RIGHT = false;
      break;
    case 40:
    case 83:
      Input.DOWN = false;
      break;
    case 32:
      Input.DODGE = false;
      break;
    case 89:
      Input.RESPAWN = false;
      break;
    case 27:
      Input.MENU = false;
      break;
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      Input.ACTION_KEYS[event.keyCode-49] = false;
      break;
    case 48:
      Input.ACTION_KEYS[9] = false;
      break;
    case 189:
      Input.ACTION_KEYS[10] = false;
      break;
    case 187:
      Input.ACTION_KEYS[11] = false;
      break;
    default:
      Input.MISC_KEYS[event.keyCode] = false;
  }
  Input.LAST_INPUT_RECEIVED = new Date();
};

/**
 * This should be called during initialization to allow the Input
 * class to track user input.
 * @param {Element} element The element to apply the event listener to.
 */
Input.applyEventHandlers = function() {
  document.addEventListener('mousedown', Input.onMouseDown);
  document.addEventListener('mouseup', Input.onMouseUp);
  document.addEventListener('keyup', Input.onKeyUp);
  document.addEventListener('keydown', Input.onKeyDown);
};

/**
 * This should be called any time an element needs to track mouse coordinates
 * over it. The event listener will be applied to the entire document, but the
 * the coordinates will be taken relative to the given element (using the given
 * element's top left as [0, 0]).
 * @param {Element} element The element to take the coordinates relative to.
 */
Input.addMouseTracker = function(element) {
  document.addEventListener('mousemove', (event) => {
    Input.MOUSE = [event.pageX - element.offsetLeft,
                   event.pageY - element.offsetTop];
    Input.LAST_INPUT_RECEIVED = new Date();
  });
};
