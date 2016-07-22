// Global id for canceling the animation
window.Game = function() {
	var animationId;
	var canvas;
	var context;

	this.load = function(c) {
		canvas = c;
		context = canvas.getContext('2d');
		return context;
	}

	this.Sprite = function(name, xPos, yPos, width, height) {
		this.name = name;
		this.states = [];
		this.xPos = xPos;
		this.yPos = yPos;
		this.width = width;
		this.height = height;
	}

	this.Sprite.animation = function(parent, state, imageRef, width, height, frameCount, currentFrame, frameX, frameY, maxTicks, fWidth, fHeight, infinite) {
	
		this.parent = parent;
		this.oticks = this.ticks = 0;
		this.maxTicks = maxTicks;
		this.imageRef = imageRef;
		this.image = new Image();
		this.frameCount = frameCount;
		this.ocurrentFrame = this.currentFrame = currentFrame;
		this.oframeX = this.frameX = frameX;
		this.oframeY = this.frameY = frameY;
		this.fWidth = fWidth;
		this.fHeight = fHeight;
		this.width = width;
		this.height = height;
		this.xPos = parent.xPos;
		this.yPos = parent.yPos;
		this.infinite = infinite;
		this.active = false;
		
		// load the image
		this.image.src = this.imageRef;

		this.reset = function() {
			this.ticks = this.oticks;
			this.currentFrame = this.ocurrentFrame;
			this.frameX = this.oframeX;
			this.frameY = this.oframeY;
		}

		// DRAW FUNCTION
		this.draw = function() {
			if (this.frameCount == undefined) {
				context.drawImage(this.image, this.xPos, this.yPos, this.width, this.height);
				return;
			}
			if (!this.active) return;
			context.clearRect(0,0,canvas.width,canvas.height);
			this.frameX = this.fWidth * this.currentFrame;
			context.drawImage(this.image, this.frameX, this.frameY, this.fWidth, this.fHeight, this.xPos, this.yPos, this.width, this.height);
			console.log('ticks: ' + this.ticks + ' Frame: ' + this.currentFrame)
			if (this.ticks > this.maxTicks) {
				this.ticks = 0;
				this.currentFrame++;
			}
			this.ticks++;
			if (this.currentFrame == this.frameCount - 1) {
				this.currentFrame = 0;
				this.frameX = 0;
				//If we just want one iteration;
				context.clearRect(0,0,canvas.width,canvas.height);
				if (!this.infinite) {
					this.active = false;
					return;
				}
			}
			// animationId = requestAnimationFrame(this.draw.bind(this));
		
	  };

		this.stopDraw = function() {
			cancelAnimationFrame(animationId);
		}

	}
}