var universe = {
	width: document.body.offsetWidth,
	height: document.body.offsetHeight,
};

console.log(universe);

var item  = new Item(universe.width / 2, universe.height / 2, 100, 100);
item.run();

/* helper functions */

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}