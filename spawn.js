var universe = {
	energy: 2020,
	width: document.body.offsetWidth,
	height: document.body.offsetHeight,
};

console.log(universe);

window.setInterval(function() {
	if (universe.energy > 0) {
		var x = Math.random() * universe.width;
		var y = Math.random() * universe.height;

		var light  = new Item(x, y);
		light.propel(Math.random() * 360);
		light.run();

		universe.energy--;
	}
}, 100);

window.setInterval(function() {
	if (universe.energy > 1000) {
		var x = Math.random() * universe.width;
		var y = Math.random() * universe.height;

		var item  = new Item(x, y);
		item.mass = 100;
		item.size = 4;
		item.color = [255, 0, 0, 1];
		item.velocity = 0.1;
		item.propel(Math.random() * 360);
		item.run();

		universe.energy -= 1000;
	}
}, 100);

window.setInterval(function() {
	console.log('total-energy', universe.energy);
}, 1000);
