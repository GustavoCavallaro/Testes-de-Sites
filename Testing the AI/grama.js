const TEXTURE_SIZE = 128;
const PIXELS = 16;
const CELL_SIZE = TEXTURE_SIZE / PIXELS;

function nextRandom(state) {
	state.value = (state.value * 9301 + 49297) % 233280;
	return state.value / 233280;
}

function createDirtTexture(THREE, seed, withGrassCap = false) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = TEXTURE_SIZE;
	const context = canvas.getContext("2d");
	const random = { value: seed };
	const soilTones = ["#4b3427", "#5c3d2b", "#704a31", "#805737", "#92633e", "#3e2c24", "#a06d45"];
	const stoneTones = ["#766354", "#86715f", "#625143", "#9a806a"];

	context.fillStyle = "#68452f";
	context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

	for (let y = 0; y < PIXELS; y += 1) {
		for (let x = 0; x < PIXELS; x += 1) {
			const tonePool = nextRandom(random) > 0.89 ? stoneTones : soilTones;
			context.fillStyle = tonePool[Math.floor(nextRandom(random) * tonePool.length)];
			context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}
	}

	for (let index = 0; index < 18; index += 1) {
		const x = Math.floor(nextRandom(random) * PIXELS);
		const y = Math.floor(nextRandom(random) * PIXELS);
		const width = nextRandom(random) > 0.65 ? CELL_SIZE * 2 : CELL_SIZE;
		context.fillStyle = nextRandom(random) > 0.5 ? "#382921" : "#b0794c";
		context.fillRect(x * CELL_SIZE, y * CELL_SIZE, width, CELL_SIZE);
	}

	if (withGrassCap) {
		const grassTones = ["#3d7137", "#4f883e", "#609b46", "#78aa4e", "#315d32"];
		for (let x = 0; x < PIXELS; x += 1) {
			const capHeight = 2 + Math.floor(nextRandom(random) * 2);
			for (let y = 0; y < capHeight; y += 1) {
				context.fillStyle = grassTones[Math.floor(nextRandom(random) * grassTones.length)];
				context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
			}
		}
	}

	return toPixelTexture(THREE, canvas);
}

function createGrassTexture(THREE, seed) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = TEXTURE_SIZE;
	const context = canvas.getContext("2d");
	const random = { value: seed };
	const grassTones = ["#3d7137", "#4f883e", "#609b46", "#78aa4e", "#315d32"];

	context.fillStyle = "#4f883e";
	context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

	for (let y = 0; y < PIXELS; y += 1) {
		for (let x = 0; x < PIXELS; x += 1) {
			context.fillStyle = grassTones[Math.floor(nextRandom(random) * grassTones.length)];
			context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}
	}

	return toPixelTexture(THREE, canvas);
}

function createBottomTexture(THREE, seed) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = TEXTURE_SIZE;
	const context = canvas.getContext("2d");
	const random = { value: seed };
	const tones = ["#3e2c24", "#513729", "#67452f", "#795039"];

	for (let y = 0; y < PIXELS; y += 1) {
		for (let x = 0; x < PIXELS; x += 1) {
			context.fillStyle = tones[Math.floor(nextRandom(random) * tones.length)];
			context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}
	}

	return toPixelTexture(THREE, canvas);
}

function toPixelTexture(THREE, canvas) {
	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestFilter;
	return texture;
}

export function createGrassBlock(THREE) {
	const sideTextures = [29, 51, 73, 95].map((seed) => createDirtTexture(THREE, seed, true));
	const grassTexture = createGrassTexture(THREE, 12);
	const bottomTexture = createBottomTexture(THREE, 77);
	const materials = [sideTextures[0], sideTextures[1], grassTexture, bottomTexture, sideTextures[2], sideTextures[3]].map((texture) => new THREE.MeshStandardMaterial({
		map: texture,
		roughness: 0.94,
	}));
	const block = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.7, 2.7), materials);
	block.position.y = 1.42;
	block.castShadow = true;
	block.receiveShadow = true;
	return block;
}
