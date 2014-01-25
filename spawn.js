var universe = {
	energy: 1000,
	width: document.body.offsetWidth,
	height: document.body.offsetHeight,
};

console.log(universe);

window.setInterval(function() {
	if (universe.energy > 0) {
		var x = Math.random() * universe.width;
		var y = Math.random() * universe.height;

		var angle = Math.random() * 359;

		var item  = new Item(x, y);
		item.propel(angle);
		item.run();

		var item  = new Item(x, y);
		item.mass = -item.mass;
		item.propel(180 + angle);
		item.run();

		universe.energy--;
	}
}, 100);

window.setInterval(function() {
	if (universe.energy > 1000) {
		var x = Math.random() * universe.width;
		var y = Math.random() * universe.height;

		var angle = Math.random() * 359;

		var item  = new Item(x, y);
		item.mass = 100;
		item.size = 4;
		item.color = [255, 0, 0, 1];
		item.velocity = 0.1;
		item.propel(angle);
		item.run();

		var item  = new Item(x, y);
		item.mass = 100;
		item.size = 4;
		item.color = [255, 0, 0, 1];
		item.velocity = 0.1;
		item.propel(180 + angle);
		item.run();

		universe.energy -= 1000;
	}
}, 100);


window.setInterval(function() {
	console.log('total-energy', universe.energy);
}, 1000);
