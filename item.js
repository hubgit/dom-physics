var Item = function(x, y) {
	this.mass = 0;
	this.energy = 1000;
	this.delay = 10;
	this.size = 1;
	this.interval = null;
	this.velocity = 1;
	this.color = [255, 255, 255, 1];

	this.x = x;
	this.y = y;

	this.instructions = [
		['sense'],
		['move']
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
	var item = this;

	item.instructions.forEach(function(instruction) {
		var method = instruction[0];
		var args = instruction[1];

		if (typeof item[method] !== 'function') {
			return;
		}

		item[method].apply(item, args);
	});

	window.setTimeout(function() {
		item.run();
	}, item.delay);
}

Item.prototype.set = function(position, value) {
	this.memory[position] = value;
}

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

	var potential = {
		x: this.x + this.vector[0],
		y: this.y + this.vector[1]
	};

	var item = document.elementFromPoint(potential.x, potential.y);

	if (item && item.nodeName == 'I' && !item.isEqualNode(this.element)) {
		console.log('collision');
		//var average = (this.energy + item.energy) / 2;
		//this.energy = average;
		//item.energy = average;
	}

	this.x = potential.x;
	this.y = potential.y;
}

Item.prototype.move = function() {
	this.element.style.webkitTransform = [
		'translate(' + Math.round(this.x) + 'px, ' + Math.round(this.y) + 'px)',
		'scale(' + this.size + ', ' + this.size + ')', // TODO: needs to use width + height for node detection?
	].join(' ');

	//this.element.style.backgroundColor = 'rgba(' + this.color.join(',') + ')';

	//this.energy -= this.mass;
	//console.log(this.energy);
}