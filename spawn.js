var universe = {
	width: document.body.offsetWidth,
	height: document.body.offsetHeight,
	depth: 25,
};

console.log(universe);

var item  = new Item(universe.width / 2, universe.height / 2, universe.depth / 2);
item.run();

/* helper functions */

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}