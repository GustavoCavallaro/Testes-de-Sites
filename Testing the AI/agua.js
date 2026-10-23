const TEXTURE_SIZE = 128;
const PIXELS = 16;
const CELL_SIZE = TEXTURE_SIZE / PIXELS;

function nextRandom(state) {
	state.value = (state.value * 9301 + 49297) % 233280;
	return state.value / 233280;
}

function createWaterTexture(THREE, seed, top = false) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = TEXTURE_SIZE;
	const context = canvas.getContext("2d");
	const random = { value: seed };
	const waterTones = top
		? ["#10469a", "#1553ad", "#1b5fba", "#0d3d8b", "#2468c4"]
		: ["#073078", "#093985", "#0b428f", "#0a347d", "#0e4898"];

	context.fillStyle = top ? "#10489f" : "#08357f";
	context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

	for (let y = 0; y < PIXELS; y += 1) {
		for (let x = 0; x < PIXELS; x += 1) {
			if (nextRandom(random) > 0.5) {
				context.fillStyle = waterTones[Math.floor(nextRandom(random) * waterTones.length)];
				context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
			}
		}
	}

	for (let highlight = 0; highlight < 8; highlight += 1) {
		const x = Math.floor(nextRandom(random) * (PIXELS - 3));
		const y = Math.floor(nextRandom(random) * PIXELS);
		const width = (1 + Math.floor(nextRandom(random) * 3)) * CELL_SIZE;
		context.fillStyle = top ? "rgba(72, 132, 211, 0.3)" : "rgba(35, 91, 174, 0.24)";
		context.fillRect(x * CELL_SIZE, y * CELL_SIZE, width, CELL_SIZE);
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestFilter;
	return texture;
}

export function createWaterBlock(THREE) {
	const sideTextures = [13, 27, 41, 55].map((seed) => createWaterTexture(THREE, seed));
	const topTexture = createWaterTexture(THREE, 69, true);
	const bottomTexture = createWaterTexture(THREE, 83);
	const materials = [sideTextures[0], sideTextures[1], topTexture, bottomTexture, sideTextures[2], sideTextures[3]].map((texture) => new THREE.MeshStandardMaterial({
		map: texture,
		roughness: 0.72,
		transparent: 0,
		opacity: 0.9,
	}));
	const block = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.7, 2.7), materials);
	block.position.y = 1.42;
	block.castShadow = true;
	block.receiveShadow = true;
	return block;
}
