var Item = function(x, y, z) {
	this.mass = 1;
	this.energy = 1;
	this.delay = 20;
	this.vector = [0, 0, 0];
	this.children = [];
	this.parent = null;
	this.guid = guid();

	//this.delay = Math.random() * 100 + 10;

	this.color = [255, 255, 255, 0.25];

	this.x = x;
	this.y = y;
	this.z = z;

	this.instructions = [
		['sense'],
		['move'],
		['spawn'],
	];

	this.element = document.createElement('i');
	document.body.appendChild(this.element);
}

Item.prototype.propel = function(angle) {
	this.vector[0] += Math.cos(angle) * 10 * this.mass;
	this.vector[1] += Math.sin(angle) * 10 * this.mass;
	this.vector[2] += Math.tan(angle) * 10 * this.mass;
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

	parent.energy += this.energy / 2;
	parent.mass += this.mass / 2;

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
		this.x = universe.width / 2;
		this.y = universe.height / 2;
		//this.x = universe.width - this.x;
		return this.die();
		//this.vector[0] = this.vector[0] * -1; // bounce
	}

	if (this.y <= 0 || this.y >= universe.height) {
		this.x = universe.width / 2;
		this.y = universe.height / 2;
		//this.y = universe.height - this.y;
		return this.die();
		//this.vector[1] = this.vector[1] * -1; // bounce
	}

	if (this.z <= 0 || this.z >= universe.depth) {
		//this.z = universe.depth - this.z;
		//return this.die();
		//this.vector[2] = this.vector[2] * -1; // bounce
	}


	this.x += this.vector[0];
	this.y += this.vector[1];
	this.z += this.vector[2];
}

Item.prototype.move = function() {
	//console.log(this.x, this.y, this.z);
	var x = Math.round(this.x);
	var y = Math.round(this.y);
	var z = Math.round(this.z);

	this.element.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px, ' + 0 + 'px)' +
		'scale3d(' + this.mass * 400 + ', ' + this.mass * 400 + ', ' + 1 + ')';

	this.element.style.backgroundColor = 'rgba(' + this.color.join(',') + ')';

	//this.energy -= this.mass;
	//console.log(this.energy);
}

Item.prototype.spawn = function() {
	console.log('spawn');

	if (Math.random() > this.mass) {
		return;
	}

	if (this.energy < 0.02) {
		if (Math.random() > 0.2) {
			this.die();
		}

		return;
	}

	var item = new Item(this.x, this.y, this.z);

	item.mass = this.mass / 2;
	this.mass -= item.mass;

	item.energy = this.energy / 2;
	this.energy -= item.energy;

	var angle = Math.random() * 360;

	item.propel(angle);
	this.propel(-angle);

	item.parent = this;
	this.children.push(item);

	item.run();
}