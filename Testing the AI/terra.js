const TEXTURE_SIZE = 128;
const PIXELS = 16;
const CELL_SIZE = TEXTURE_SIZE / PIXELS;

function nextRandom(state) {
	state.value = (state.value * 9301 + 49297) % 233280;
	return state.value / 233280;
}

function createSoilTexture(THREE, seed) {
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

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestFilter;
	return texture;
}

export function createDirtBlock(THREE) {
	const textures = [29, 51, 73, 95, 117, 139].map((seed) => createSoilTexture(THREE, seed));
	const materials = textures.map((texture) => new THREE.MeshStandardMaterial({
		map: texture,
		roughness: 0.96,
	}));
	const block = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.7, 2.7), materials);
	block.position.y = 1.42;
	block.castShadow = true;
	block.receiveShadow = true;
	return block;
}
