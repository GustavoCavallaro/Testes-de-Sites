const TEXTURE_SIZE = 128;
const BARK_COLUMNS = 8;
const COLUMN_WIDTH = TEXTURE_SIZE / BARK_COLUMNS;

function nextRandom(state) {
	state.value = (state.value * 9301 + 49297) % 233280;
	return state.value / 233280;
}

function toPixelTexture(THREE, canvas) {
	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestFilter;
	return texture;
}

function createBarkTexture(THREE, seed) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = TEXTURE_SIZE;
	const context = canvas.getContext("2d");
	const random = { value: seed };
	const barkTones = ["#120c09", "#1b100c", "#25150e", "#2f1b11", "#392012", "#442615"];

	context.fillStyle = "#160e0b";
	context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

	for (let column = 0; column < BARK_COLUMNS; column += 1) {
		const x = column * COLUMN_WIDTH;
		context.fillStyle = barkTones[Math.floor(nextRandom(random) * barkTones.length)];
		context.fillRect(x + 1, 0, COLUMN_WIDTH - 2, TEXTURE_SIZE);
		for (let grain = 0; grain < 5; grain += 1) {
			const grainX = x + 2 + Math.floor(nextRandom(random) * Math.max(1, COLUMN_WIDTH - 4));
			context.fillStyle = nextRandom(random) > 0.45 ? "rgba(111, 68, 33, 0.38)" : "rgba(6, 4, 3, 0.72)";
			context.fillRect(grainX, Math.floor(nextRandom(random) * 12), 2, 20 + Math.floor(nextRandom(random) * 42));
		}
		if (nextRandom(random) > 0.35) {
			context.fillStyle = "rgba(18, 12, 9, 0.75)";
			context.fillRect(x + Math.floor(COLUMN_WIDTH / 2), 12 + Math.floor(nextRandom(random) * 70), 2, 18);
		}
	}

	return toPixelTexture(THREE, canvas);
}

function createCutTexture(THREE, seed) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = TEXTURE_SIZE;
	const context = canvas.getContext("2d");
	const random = { value: seed };
	const woodTones = ["#694823", "#7c572c", "#5a3b20", "#8d6537"];

	context.fillStyle = "#604020";
	context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

	for (let size = 116; size >= 10; size -= 13) {
		const offset = (TEXTURE_SIZE - size) / 2;
		context.strokeStyle = nextRandom(random) > 0.3 ? "#382115" : "#835c2e";
		context.lineWidth = 4;
		context.strokeRect(offset, offset, size, size);
	}

	context.fillStyle = "#382216";
	context.fillRect(57, 57, 14, 14);
	context.fillStyle = "rgba(193, 143, 71, 0.38)";
	context.fillRect(25, 19, 4, 18);
	context.fillRect(92, 78, 4, 20);

	return toPixelTexture(THREE, canvas);
}

export function createTrunkBlock(THREE) {
	const sideTextures = [17, 29, 41, 53].map((seed) => createBarkTexture(THREE, seed));
	const cutTexture = createCutTexture(THREE, 71);
	const materials = [sideTextures[0], sideTextures[1], cutTexture, cutTexture, sideTextures[2], sideTextures[3]].map((texture) => new THREE.MeshStandardMaterial({
		map: texture,
		roughness: 0.98,
	}));
	const block = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.7, 2.7), materials);
	block.position.y = 1.42;
	block.castShadow = true;
	block.receiveShadow = true;
	return block;
}
