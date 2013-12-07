var seed = '333dfsafds';
Math.seedrandom(seed);

function getRandomInt(low, high) {
	return parseInt(Math.random() * (high - low + 1) + low);
}

function test() {
	total = 0;

	for (i = 0; i < 1000000; i++) {
		random = getRandomInt(1, 50);
		total += random;
	}

	total /= 1000000;
	console.log(total);
}

$(document).ready(function() {
	test();
});