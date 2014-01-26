var Item = function(x, y, energy, mass) {
	this.mass = mass;
	this.energy = energy;
	this.delay = 50;
	this.size = mass;
	this.interval = null;
	this.velocity = 5;
	this.vector = [0, 0];
	this.children = [];
	this.parent = null;
	this.guid = guid();

	//this.delay = Math.random() * 100 + 10;

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
	this.vector[0] += Math.cos(angle) * this.velocity;
	this.vector[1] += Math.sin(angle) * this.velocity;
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

	if (this.parent && !this.children.length) {
		if (Math.abs(this.vector[0] - this.parent.vector[0]) < 0.01 &&
			Math.abs(this.vector[1] - this.parent.vector[1]) < 0.01) {
			console.log('confluence');
			this.die();
			return;
		};
	}

	if (this.parent && !this.children.length && (this.vector[0] < 0.0005 && this.vector[1] < 0.0005)) {
		console.log('too slow');
		this.die();
		return;
	}

	var item = this;
	window.setTimeout(function() { item.run() }, this.delay);
}

Item.prototype.die = function() {
	var parent = this.parent;

	parent.energy += this.energy;
	parent.mass += this.mass;
	parent.size += this.size;

	//this.parent.velocity[0] -= this.velocity[0];
	//this.parent.velocity[1] -= this.velocity[1];
	this.energy = 0;
	this.size = 0;
	console.log('removing');
	this.element.parentNode.removeChild(this.element);

	if (parent.children.length) {
		var guid = this.guid;
		parent.children.forEach(function(child, index) {
			if (child.guid == guid) {
				delete parent.children[index];
			}
		});
	}
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
		//return this.die();
		//this.vector[0] = this.vector[0] * -1; // bounce
	}

	if (this.y <= 0 || this.y >= universe.height) {
		this.y = universe.height - this.y;
		// return this.die();
		//this.vector[1] = this.vector[1] * -1; // bounce
	}

	this.x += this.vector[0];
	this.y += this.vector[1];

	if (this.parent) {
		this.vector[0] = (this.vector[0] * 49 + this.parent.vector[0]) / 50;
		this.vector[1] = (this.vector[1] * 49 + this.parent.vector[1]) / 50;
	}

	if (this.children.length) {
		this.vector[0] = (this.children.reduce(function(previousValue, child) {
			return child.vector[0] + previousValue;
		}, 0) + this.vector[0] * 4) / (this.children.length + 5);

		this.vector[1] = (this.children.reduce(function(previousValue, child) {
			return child.vector[1] + previousValue;
		}, 0) + this.vector[1] * 4) / (this.children.length + 5);
	}
}

Item.prototype.move = function() {
	var x = Math.round(this.x);
	var y = Math.round(this.y);

	this.element.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px, 0) \
	scale3d(' + this.size + ', ' + this.size + ', 0)';

	this.element.style.backgroundColor = 'rgba(' + this.color.join(',') + ')';

	//this.energy -= this.mass;
	//console.log(this.energy);
}

Item.prototype.spawn = function() {
	if (this.energy <= 1) {
		return;
	}

	if (Math.random() * 100 > this.mass) {
		return;
	}

	console.log('spawn');

	var angle = Math.random() * 360;

	var pieces = Math.round(Math.random() * 5);

	var mass = this.mass / pieces;
	var energy = mass;
	var size = this.size / pieces;

	if (energy < 1) {
		return;
	}

	for (var i = 0; i < pieces; i++) {
		var item = new Item(this.x, this.y);

		item.mass = mass;
		this.mass -= mass;

		item.energy = energy;
		this.energy -= energy;

		item.size = size;
		this.size -= size;

		angle = Math.random() * 360

		item.propel(angle);
		this.propel(-angle);

		console.log(item.mass, item.energy)

		item.parent = this;
		this.children.push(item);

		item.run();
	}
}