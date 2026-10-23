const TEXTURE_SIZE = 128;
const PLANK_COUNT = 8;
const PLANK_HEIGHT = TEXTURE_SIZE / PLANK_COUNT;

function nextRandom(state) {
	state.value = (state.value * 9301 + 49297) % 233280;
	return state.value / 233280;
}

function createPlankTexture(THREE, seed, top = false) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = TEXTURE_SIZE;
	const context = canvas.getContext("2d");
	const random = { value: seed };
	const woodTones = ["#a98655", "#b99661", "#c5a873", "#987542", "#d0b67e"];

	context.fillStyle = "#785b35";
	context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

	if (top) {
		for (let plank = 0; plank < PLANK_COUNT; plank += 1) {
			const y = plank * PLANK_HEIGHT;
			context.fillStyle = woodTones[Math.floor(nextRandom(random) * woodTones.length)];
			context.fillRect(0, y + 2, TEXTURE_SIZE, PLANK_HEIGHT - 3);
			context.fillStyle = "#684c2d";
			context.fillRect(0, y, TEXTURE_SIZE, 2);
			context.fillStyle = "rgba(255, 231, 173, 0.26)";
			context.fillRect(0, y + 3, TEXTURE_SIZE, 1);
			for (let grain = 0; grain < 4; grain += 1) {
				const grainY = y + 5 + Math.floor(nextRandom(random) * Math.max(1, PLANK_HEIGHT - 7));
				const start = Math.floor(nextRandom(random) * 24);
				const length = 18 + Math.floor(nextRandom(random) * 48);
				context.fillStyle = nextRandom(random) > 0.45 ? "rgba(103, 73, 38, 0.3)" : "rgba(245, 215, 157, 0.24)";
				context.fillRect(start, grainY, length, 1);
			}
		}
	} else {
		for (let plank = 0; plank < PLANK_COUNT; plank += 1) {
			const y = plank * PLANK_HEIGHT;
			context.fillStyle = woodTones[Math.floor(nextRandom(random) * woodTones.length)];
			context.fillRect(0, y + 2, TEXTURE_SIZE, PLANK_HEIGHT - 3);
			context.fillStyle = "#684c2d";
			context.fillRect(0, y, TEXTURE_SIZE, 2);
			context.fillStyle = "rgba(255, 231, 173, 0.26)";
			context.fillRect(0, y + 3, TEXTURE_SIZE, 1);
			for (let grain = 0; grain < 4; grain += 1) {
				const grainY = y + 5 + Math.floor(nextRandom(random) * Math.max(1, PLANK_HEIGHT - 7));
				const start = Math.floor(nextRandom(random) * 24);
				const length = 18 + Math.floor(nextRandom(random) * 48);
				context.fillStyle = nextRandom(random) > 0.45 ? "rgba(103, 73, 38, 0.3)" : "rgba(245, 215, 157, 0.24)";
				context.fillRect(start, grainY, length, 1);
			}

			if (nextRandom(random) > 0.35) {
			const knotX = 12 + Math.floor(nextRandom(random) * 100);
			const knotY = y + PLANK_HEIGHT / 2;
			context.fillStyle = "rgba(91, 61, 31, 0.55)";
			context.fillRect(knotX, knotY, 5, 2);
			context.fillStyle = "rgba(229, 193, 126, 0.35)";
			context.fillRect(knotX - 4, knotY + 1, 13, 1);
			}
		}
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestFilter;
	return texture;
}

export function createPlankBlock(THREE) {
	const sideTextures = [31, 47, 63, 79].map((seed) => createPlankTexture(THREE, seed));
	const topTexture = createPlankTexture(THREE, 101, true);
	const bottomTexture = createPlankTexture(THREE, 113);
	const materials = [sideTextures[0], sideTextures[1], topTexture, bottomTexture, sideTextures[2], sideTextures[3]].map((texture) => new THREE.MeshStandardMaterial({
		map: texture,
		roughness: 0.9,
	}));
	const block = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.7, 2.7), materials);
	block.position.y = 1.42;
	block.castShadow = true;
	block.receiveShadow = true;
	return block;
}
