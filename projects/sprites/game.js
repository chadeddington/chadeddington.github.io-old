window.onload = function() {
	var G = new Game();
	var canvas = document.getElementById('canvas');
	var context = G.load(canvas);
	
	// Create character
	var link = new G.Sprite('Link', 150, 100);

	// Character states
	link.fight = new G.Sprite.animation(link, 'fight', 'linkSprites.png', 105, 105, 7, 0, 0, 0, 3, 35, 35, false);
	link.standDown = new G.Sprite.animation(link, 'link-standing-down', 'link_stand_down.png', 45, 45)

	var animate = function() {
		if (link.fight.active) { 
			link.fight.draw()
		} else {
			link.standDown.draw()
		}
		animationId = requestAnimationFrame(animate);
	}

  // START GAME ANIMATION 
	animate();

	// KEY LISTENERS
	document.addEventListener('keyup', function(e) {
		if (e.key == 'f') {
			link.fight.reset();
			link.fight.active = true;
		}
	})
	// DEGBUG PURPOSES
	// window.setInterval(function() { link.draw() }, 200)
}
