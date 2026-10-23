const TEXTURE_SIZE = 128;
const PIXELS = 16;
const CELL_SIZE = TEXTURE_SIZE / PIXELS;

function nextRandom(state) {
	state.value = (state.value * 9301 + 49297) % 233280;
	return state.value / 233280;
}

function createLeafTexture(THREE, seed, top = false) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = TEXTURE_SIZE;
	const context = canvas.getContext("2d");
	const random = { value: seed };
	const leafTones = top
		? ["#06170a", "#0a2610", "#103715", "#17451c"]
		: ["#041008", "#071d0c", "#0c2d12", "#123a18"];

	context.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

	for (let y = 0; y < PIXELS; y += 1) {
		for (let x = 0; x < PIXELS; x += 1) {
			if (nextRandom(random) > (top ? 0.16 : 0.2)) {
				context.fillStyle = leafTones[Math.floor(nextRandom(random) * leafTones.length)];
				context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
			}
		}
	}

	for (let cluster = 0; cluster < (top ? 24 : 20); cluster += 1) {
		const x = Math.floor(nextRandom(random) * PIXELS);
		const y = Math.floor(nextRandom(random) * PIXELS);
		const width = 1 + Math.floor(nextRandom(random) * 3);
		const height = 1 + Math.floor(nextRandom(random) * 2);
		context.fillStyle = leafTones[Math.floor(nextRandom(random) * leafTones.length)];
		context.fillRect(x * CELL_SIZE, y * CELL_SIZE, width * CELL_SIZE, height * CELL_SIZE);
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestFilter;
	return texture;
}

export function createLeafBlock(THREE) {
	const sideTextures = [19, 31, 43, 55].map((seed) => createLeafTexture(THREE, seed));
	const topTexture = createLeafTexture(THREE, 67, true);
	const bottomTexture = createLeafTexture(THREE, 79);
	const materials = [sideTextures[0], sideTextures[1], topTexture, bottomTexture, sideTextures[2], sideTextures[3]].map((texture) => new THREE.MeshStandardMaterial({
		map: texture,
		roughness: 1,
		transparent: true,
		alphaTest: 0.08,
		depthWrite: false,
		opacity: 0.96,
	}));
	const block = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.7, 2.7), materials);
	block.position.y = 1.42;
	block.castShadow = true;
	block.receiveShadow = true;
	return block;
}
