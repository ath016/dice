/* VARIABLES **************************************************** */
// canvas setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

// object array
var diceArray = [];
var buttonArray = [];

// button setup
var buttonWidth = 40;
var buttonRange = 45;
var buttonSpace = buttonWidth + buttonRange;
var buttonNum = 9;

// mouse location
var mouse = {x:undefined, y:undefined};

// dice setup
var diceNum = 2;
var roll = 5;
var delay = 250;

// gravity
var gravity = 1;

// speed decay
var elasticFric = .96;
var staticFric = .9
var kineticFric = .85;

// rebounce
var bounceFactor = .1;
var bounceFloor = 10;

// animate setup
var colorWrong = 'rgba(255, 0, 0, .25)';
var colorRight = 'rgba(0, 255, 0, .25)';
var colorTest = 'rgba(0, 0, 255, .25)';

/* OBJECT ******************************************************* */

function Dice(x, y, dx, dy, diameter, mass) {
	// internal variables
	this.x = x;
	this.y = y;
	this.velocity = {x:dx, y:dy};
	this.diameter = diameter;
	this.radius = diameter/7;
	this.mass = mass
	this.color = randColor();
	this.numb = Math.ceil(Math.random() * 6);
	this.count = 0;
	this.tau = Math.PI * 2;
	
	// draw function
	this.draw = function() {
		// calculate horizontal allignment
		this.left = this.x + this.diameter/5;
		this.middle = this.x + this.diameter/2;
		this.right = this.x + this.diameter*4/5;
	
		// calculate virtucal allignment
		this.top = this.y + this.diameter/5;
		this.center = this.y + this.diameter/2;
		this.bottom = this.y + this.diameter*4/5;
		
		// fill background
		c.fillRect(this.x, this.y, this.diameter, this.diameter);
		// set color
		c.fillStyle = this.color;
		
		// center
		if(this.numb % 2 == 1) {
			c.beginPath();
			c.arc(this.middle, this.center, this.radius, 0, this.tau, 0);
			c.fill();
		} // end of if
		
		// top left
		if(1 < this.numb) {
			c.beginPath();
			c.arc(this.left, this.top, this.radius, 0, this.tau, 0);
			c.fill();
		} // end of if
		
		// bottom right
		if(1 < this.numb) {
			c.beginPath();
			c.arc(this.right, this.bottom, this.radius, 0, this.tau, 0);
			c.fill();
		} // end of if
		
		// bottom left
		if(3 < this.numb) {
			c.beginPath();
			c.arc(this.left, this.bottom, this.radius, 0, this.tau, 0);
			c.fill();
		} // end of if		
		
		
		// top right
		if(3 < this.numb) {
			c.beginPath();
			c.arc(this.right, this.top, this.radius, 0, this.tau, 0);
			c.fill();
		} // end of if
		
		// middle left
		if(5 < this.numb) {
			c.beginPath();
			c.arc(this.left, this.center, this.radius, 0, this.tau, 0);
			c.fill();
		} // end of if
		
		// middle right
		if(5 < this.numb) {
			c.beginPath();
			c.arc(this.right, this.center, this.radius, 0, this.tau, 0);
			c.fill();
		} // end of if
		
		// reset default
		c.fillStyle = 'black';
	} // end of draw
		
	this.update = function() {
		// dice bounce
		for(var i = 0; i < diceArray.length; i++) {
			// self check
			if(this === diceArray[i]) continue;
			
			// calculate new velocity
			if(collision(this, diceArray[i]))
				resolveCollision(this, diceArray[i]);
		} // end of for
		
		// wall bounce
		if (canvas.width <= this.x + this.velocity.x + this.diameter
			|| this.x + this.velocity.x <= buttonSpace) {
			this.velocity.x = -this.velocity.x * kineticFric;
			this.velocity.y *= staticFric;
		} // end of if
	
		// floor and ceiling bounce
		if (canvas.height <= this.y + this.velocity.y +
			this.diameter || this.y + this.velocity.y <= 0) {
			this.velocity.y = -this.velocity.y * kineticFric;
			this.velocity.x *= staticFric;
		} // end of if */
		
		// gravity
		else {
			this.velocity.y += gravity;
		} // end of else */
		
		// check velocity
		if(Math.abs(this.velocity.x) < 1)
			this.velocity.x = 0;
		if(Math.abs(this.velocity.y) < 1)
			this.velocity.y = 0;
		
		// update posistion
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		
		// check move
		if(this.velocity.x != 0 || this.velocity.y != 0) {
			this.count = 0;
		} // end of if
		
		// draw */
		this.draw();
	} // end of update
} // end of class circle

// button
function Button(x, y, width, height, data) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.data = data;
	
	this.draw = function() {
		c.fillRect(this.x + 3, this.y + 3,
			this.width - 6, this.height - 6);
	} // end of draw
	
	
	
	this.update = function(data) {
		// update data
		this.data = data;
		
		// draw
		this.draw();
	} // end of update
	
	this.check = function() {
		// check if element if click
		if(this.x <= mouse.x && mouse.x <= this.x + this.width &&
		   this.y <= mouse.y && mouse.y <= this.y + this.height) {
			return diceNum = this.data;
		} // end of if
		
		// default return
		return 0;
	} // end of check
} // end of class button



/* FUNCTIONS **************************************************** */

// collision check
function collision(dice, otherDice) {
	if(Math.abs(dice.x - otherDice.x) <= dice.diameter &&
	   Math.abs(dice.y - otherDice.y) <= dice.diameter) {
		return 1;
	} // end of if
	
	return 0;
} // end of check



// rotate velocity
function rotate(velocity, angle) {
	const rotatedVelocities = {
		x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
		y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
	};

	return rotatedVelocities;
} // end of rotate



// resolve collision
function resolveCollision(particle, otherParticle) {
	const xVelocityDiff = particle.velocity.x -
		otherParticle.velocity.x;
	const yVelocityDiff = particle.velocity.y +
		otherParticle.velocity.y;

	const xDist = otherParticle.x - particle.x;
	const yDist = otherParticle.y - particle.y;

	// Prevent accidental overlap of particles
	if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

		// Grab angle between the two colliding particles
		const angle = -Math.atan2(otherParticle.y -
			particle.y, otherParticle.x - particle.x);

			// Store mass in var for better readability in collision equation
		const m1 = particle.mass;
		const m2 = otherParticle.mass;

		// Velocity before equation
		const u1 = rotate(particle.velocity, angle);
		const u2 = rotate(otherParticle.velocity, angle);

		// Velocity after 1d collision equation
		const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) +
			u2.x * 2 * m2 / (m1 + m2), y: u1.y };
		const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) +
			u1.x * 2 * m2 / (m1 + m2), y: u2.y };

		// Final velocity after rotating axis back to original location
		const vFinal1 = rotate(v1, -angle);
		const vFinal2 = rotate(v2, -angle);

		// Swap particle velocities for realistic bounce effect   
		/*
		particle.velocity.x = vFinal1.x * elasticFric;
		particle.velocity.y = vFinal1.y * elasticFric;

		otherParticle.velocity.x = vFinal2.x * elasticFric;
		otherParticle.velocity.y = vFinal2.y * elasticFric;
		*/
		
		particle.velocity.x = vFinal1.x;
		particle.velocity.y = vFinal1.y;

		otherParticle.velocity.x = vFinal2.x;
		otherParticle.velocity.y = vFinal2.y;
	} // end of if
} // end of resolve collision



// check if all dices are done
function done() {
	for(var i = 0; i < diceArray.length; i++) {
		// check not done
		if(diceArray[i].count < roll) {
			return 0
		} // end of if
	} // end of for
	
	// default return
	return 1;
} // end of done



// random color function
function randColor() {
	var colorArray = [
		'#3B568C',
		'#508365',
		'#ECA414',
		'#D91A1A'
	];
	
	return colorArray[Math.floor(Math.random()*colorArray.length)];
} // end of random color



// bounce
function bounce() {
	// temparary velocity
	var velocity = undefined;
	
	diceArray.forEach(dice => {
		// initial velocity
		velocity = {
			x:Math.random() * bounceFactor * canvas.height + bounceFloor,
			y:0
		};
		
		// randomize velocity
		velocity = rotate(velocity, Math.random() * Math.PI * 2);
		
		// assign velocity
		dice.velocity.x = velocity.x;
		dice.velocity.y = velocity.y;
	}); // end of for each
} // end of bounce



// initiation
function init() {
	// update canvas dimension
	canvas.width = window.innerWidth - 20;
	canvas.height = window.innerHeight - 20;
	
	// clear button array
	buttonArray = [];
	// temparary button
	var button = undefined;
	// fix button height
	var buttonHeight = canvas.height / buttonNum;
	
	// clear dice array
	diceArray = [];
	// temparary dice
	var dice = undefined;
	// dice diameter
	var diameter = (canvas.width - buttonSpace)/diceNum/2;
	diameter = Math.min(diameter, canvas.height * .95);
	
	
	
	// fill dice array
	for(var i = 0, j = 0; i < diceNum; i++) {
		var x = Math.random() *
			(canvas.width - diameter - buttonSpace ) + buttonSpace;
		var y = Math.random() * (canvas.height - diameter);
		
		dice = new Dice(x, y, 0, 0, diameter, 1);
		
		for(j = 0; j < diceArray.length; j++) {
			if(collision(diceArray[j], dice)) {
				i--;
				break;
			} // end of if
		} // end of for
	
		if(j == diceArray.length)
			diceArray.push(dice);
	} // end of for
	
	
	
	// full button array
	for(var i = -0; i < buttonNum; i++) {
		button = new Button(0, buttonHeight * i, buttonWidth +
			buttonRange / buttonNum * i, buttonHeight, i + 1);
		buttonArray.push(button);
	} // end of for
} // end of init



// animation function
function animate() {
	// call animation
	requestAnimationFrame(animate);
	// clear screen
	c.clearRect(0, 0, canvas.width, canvas.height);
	
	// check done
	if(done()) {
		c.fillStyle = colorRight;
	} // end of if
	else {
		c.fillStyle = colorWrong;
	} // end of else
	
	// fill background
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = 'black';
	
	// update dice
	diceArray.forEach(dice => {
		dice.update();
	}); // end of for each
	
	// update button
	buttonArray.forEach(button => {
		button.draw();
	}); // end of for each */	
} // end of animate



/* EVENT ******************************************************** */


var interval = setInterval(function() {
	diceArray.forEach(dice => {
		// check moving
		if(dice.count < roll) {
			dice.count = dice.count + 1;
			dice.numb = (dice.numb + Math.ceil(Math.random() * 6))%6 + 1;
		} // end of if
	}); // end of for each
}, delay); // end of set interval

//window.clearInterval(interval);

window.addEventListener('click', function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
	
	buttonArray.forEach(button => {
		if(button.check()) {
			init();
		} // end of if
	}); // end of for each */
	
	bounce();
}) // end of mouse event listener */

window.addEventListener('touchstart', function(event) {
	var touch = event.touches[0];
	mouse.x = touch.clientX;
	mouse.y = touch.clientY;
	
	buttonArray.forEach(button => {
		if(button.check()) {
			init();
		} // end of if
	}); // end of for each */
	
	bounce();
}) // end of mouse event listener */

window.addEventListener('resize', function() {
	init();
	bounce();
}) // end of resize event listener

window.addEventListener('keydown', function(event) {
	// check key
	if(0 < event.key - '0' && event.key - '0' < 10) {
		diceNum = event.key - '0';
		init();
	} // end of if
	
	bounce();
}) // end of keydown event listener



/* START UP ***************************************************** */

init();
bounce();
animate();