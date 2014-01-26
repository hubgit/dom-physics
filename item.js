var Item = function(x, y, energy, mass) {
	this.mass = mass;
	this.energy = energy;
	this.delay = 50;
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
	this.vector[0] += Math.cos(angle) * (this.energy / this.mass);
	this.vector[1] += Math.sin(angle) * (this.energy / this.mass);
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

Item.prototype.die = function() {
	if (this.children.length) {
		return;
	}

	var parent = this.parent;

	if (!parent) {
		return;
	}

	console.log('die');

	parent.energy += this.energy;
	parent.mass += this.mass;

	//this.energy = 0;

	console.log('removing', this.element.parentNode);
	this.element.parentNode.removeChild(this.element);

	var guid = this.guid;

	parent.children.forEach(function(child, index) {
		if (child.guid == guid) {
			delete parent.children[index];
		}
	});
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
}

Item.prototype.move = function() {
	var x = Math.round(this.x);
	var y = Math.round(this.y);

	this.element.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px, 0) \
	scale3d(' + this.mass + ', ' + this.mass + ', 0)';

	this.element.style.backgroundColor = 'rgba(' + this.color.join(',') + ')';

	//this.energy -= this.mass;
	//console.log(this.energy);
}

Item.prototype.spawn = function() {
	console.log('spawn');

	if (Math.random() * 100 > this.mass) {
		return;
	}

	if (this.energy <= 1) {
		this.die();
		return;
	}

	var item = new Item(this.x, this.y);

	item.mass = this.mass / 2;
	this.mass -= item.mass;

	item.energy = this.energy / 2;
	this.energy -= item.energy;

	item.vector = [this.vector[0], this.vector[1]];

	var angle = Math.random() * 360;

	item.propel(angle);
	this.propel(-angle);

	item.parent = this;
	this.children.push(item);

	item.run();
}