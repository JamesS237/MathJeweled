var seed = '333dfsafds';
Math.seedrandom(seed);

function getRandomInt(low, high) {
	return parseInt(Math.random() * (high - low + 1) + low);
}

total = 0;

for (i = 0; i < 100; i++) {
	random = getRandomInt(1, 50);
	total += random;
}

total /= 100;
console.log(total);