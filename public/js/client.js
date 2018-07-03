$(document).ready(function() {
  	var socket = io();
  	var canvas = document.getElementById('canvas');

  	Input.applyEventHandlers();
  	Input.addMouseTracker(canvas);

  	var game = Game.create(socket, canvas);
  	game.init();
  	game.animate();

  	$('#canvas').bind('contextmenu', function(e){
    	return false;
	}); 
});
