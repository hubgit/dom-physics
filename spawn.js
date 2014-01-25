var universe = {
	width: document.body.offsetWidth,
	height: document.body.offsetHeight,
};

console.log(universe);

var x = Math.random() * universe.width;
var y = Math.random() * universe.height;

var angle = Math.random() * 360;

var item  = new Item(x, y);
item.propel(angle);
item.run();

var item  = new Item(x, y);
item.propel((180 + angle) % 360);
item.run();
