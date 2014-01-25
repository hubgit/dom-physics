var Item = function(x, y) {
	this.mass = 100;
	this.energy = 20;
	this.delay = 100;
	this.size = 200;
	this.interval = null;
	this.velocity = 10;
	this.color = [255, 255, 255, 1];

	this.x = x;
	this.y = y;

	this.instructions = [
		['sense'],
		['move'],
		['spawn'],
	];

	this.element = document.createElement('i');
	document.body.appendChild(this.element);
}

Item.prototype.propel = function(angle) {
	this.vector = [
		Math.cos(angle) * this.velocity,
		Math.sin(angle) * this.velocity,
	];

	this.element.style.backgroundColor = 'rgba(' + this.color.join(',') + ')'; // TODO: move
}

Item.prototype.run = function() {
	this.instructions.forEach(function(instruction) {
		var method = instruction[0];
		var args = instruction[1];

		if (typeof this[method] !== 'function') {
			return;
		}

		this[method].apply(this, args);
	}, this);

	var item = this;
	window.setTimeout(function() { item.run() }, this.delay);
}

/*
Item.prototype.set = function(position, value) {
	this.memory[position] = value;
}
*/

Item.prototype.sense = function() {
	if (this.energy <= 0) {
		return;
	}

	if (this.x <= 0 || this.x >= universe.width) {
		this.x = universe.width - this.x;
		//this.vector[0] = this.vector[0] * -1; // bounce
	}

	if (this.y <= 0 || this.y >= universe.height) {
		this.y = universe.height - this.y;
		//this.vector[1] = this.vector[1] * -1; // bounce
	}

	this.x += this.vector[0];
	this.y += this.vector[1];
}

Item.prototype.move = function() {
	var x = Math.round(this.x);
	var y = Math.round(this.y);

	this.element.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px, 0) \
	scale3d(' + this.size + ', ' + this.size + ', 0)';

	//this.element.style.backgroundColor = 'rgba(' + this.color.join(',') + ')';

	//this.energy -= this.mass;
	//console.log(this.energy);
}

Item.prototype.spawn = function() {
	if (this.energy <= 1) {
		return;
	}

	if (Math.random() < 0.9) {
		return;
	}

	console.log('spawn');

	var angle = Math.random() * 360;

	var mass = Math.max(50, this.mass / 4);
	var energy = this.energy / 4;
	var size = Math.max(1, this.size / 4);

	var item = new Item(this.x, this.y);
	item.mass = mass;
	item.energy = energy;
	item.size = size;
	item.propel(angle);
	item.run();

	var item  = new Item(x, y);
	item.mass = mass;
	item.energy = energy;
	item.size = size;
	item.propel((180 + angle) % 360);
	item.run();

	this.energy -= energy;
	this.mass -= mass;
	this.size = this.size / 2;
}