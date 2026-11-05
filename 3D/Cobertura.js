import * as THREE from 'three';

const canvas = document.querySelector('#scene');
const artwork = document.createElement('canvas');
const ctx = artwork.getContext('2d');
const spriteSize = 192;

function drawPixelSwirl() {
	if (!canvas || !ctx) return;

	artwork.width = spriteSize;
	artwork.height = spriteSize;
	ctx.imageSmoothingEnabled = false;
	ctx.clearRect(0, 0, spriteSize, spriteSize);
	ctx.lineJoin = 'miter';
	ctx.lineCap = 'square';

	const polygon = (points, fill, stroke = null, lineWidth = 1) => {
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
		for (const [x, y] of points.slice(1)) ctx.lineTo(x, y);
		ctx.closePath();
		ctx.fillStyle = fill;
		ctx.fill();
		if (stroke) {
			ctx.strokeStyle = stroke;
			ctx.lineWidth = Math.max(1, Math.round(lineWidth));
			ctx.stroke();
		}
	};

	const pixel = (x, y, width, height, color) => {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);
	};

	const outline = '#111014';
	const dark = '#cb3157';
	const shadow = '#e54e70';
	const pink = '#f58ca5';
	const cream = '#fff5f2';

	polygon([
		[85, 4], [102, 4], [108, 7], [115, 14], [121, 23], [126, 34], [130, 48],
		[137, 51], [144, 58], [150, 68], [154, 81], [155, 94], [152, 105], [147, 114],
		[145, 123], [145, 146], [142, 149], [137, 149], [135, 146], [135, 124],
		[131, 121], [126, 118], [122, 120], [120, 127], [118, 136], [115, 141],
		[111, 143], [107, 140], [105, 135], [105, 121], [100, 118], [95, 117],
		[91, 121], [88, 130], [88, 153], [85, 158], [80, 159], [76, 155],
		[76, 130], [72, 124], [67, 121], [63, 123],
		[58, 120], [57, 143], [54, 149], [49, 149], [46, 146], [46, 139],
		[47, 116], [43, 109], [42, 99], [42, 88], [45, 79], [50, 72], [57, 67],
		[66, 64], [70, 57], [77, 51], [87, 45], [94, 38], [96, 31], [94, 25],
		[90, 21], [87, 25], [84, 21], [84, 12], [87, 7]
	], pink, outline, 1.8);

	polygon([
		[88, 11], [94, 8], [102, 9], [110, 16], [117, 27], [122, 40], [125, 49],
		[121, 56], [112, 63], [99, 69], [82, 75], [66, 81], [59, 87], [59, 93],
		[65, 97], [76, 96], [91, 91], [108, 83], [122, 74], [132, 64], [130, 56],
		[137, 59], [145, 69], [149, 82], [150, 94], [146, 103], [137, 109], [122, 113],
		[104, 115], [83, 114], [65, 111], [53, 106], [47, 99], [45, 90], [47, 81],
		[53, 74], [62, 69], [72, 67], [77, 59], [85, 52], [96, 45], [103, 37],
		[105, 29], [102, 21], [97, 15], [91, 13]
	], '#f18aa2');

	polygon([
		[89, 12], [94, 11], [100, 14], [105, 20], [108, 28], [107, 36], [102, 44],
		[93, 51], [82, 58], [74, 65], [63, 69], [54, 75], [49, 82], [48, 91],
		[52, 99], [61, 104], [77, 106], [97, 106], [117, 103], [134, 98], [145, 91],
		[149, 88], [150, 96], [146, 104], [137, 109], [122, 113], [104, 115], [83, 114],
		[65, 111], [53, 106], [47, 99], [45, 90], [47, 81], [53, 74], [62, 69],
		[72, 67], [77, 59], [85, 52], [96, 45], [103, 37], [105, 29], [102, 21], [97, 15]
	], shadow);

	polygon([
		[91, 14], [96, 15], [101, 20], [104, 27], [103, 34], [99, 41], [91, 48],
		[82, 54], [75, 60], [70, 66], [62, 69], [54, 74], [49, 81], [48, 89],
		[52, 96], [61, 101], [78, 103], [98, 102], [116, 98], [133, 93], [146, 86],
		[148, 92], [145, 100], [136, 106], [122, 110], [104, 112], [83, 111], [65, 108],
		[53, 103], [48, 97], [46, 90], [48, 81], [54, 74], [63, 70], [73, 67],
		[79, 59], [87, 52], [97, 45], [104, 37], [106, 29], [103, 21], [98, 15]
	], pink);

	polygon([
		[131, 56], [139, 61], [146, 72], [150, 84], [150, 94], [146, 102], [138, 108],
		[126, 112], [110, 114], [94, 114], [78, 112], [65, 108], [56, 102], [52, 96],
		[58, 91], [69, 91], [83, 95], [99, 96], [115, 92], [128, 85], [137, 76],
		[139, 68]
	], '#ed708b', dark, 1.1);
	polygon([
		[130, 60], [138, 65], [144, 75], [147, 85], [146, 93], [140, 99], [129, 103],
		[114, 106], [97, 107], [80, 105], [67, 101], [59, 97], [61, 94], [72, 95],
		[86, 99], [102, 99], [119, 95], [132, 88], [140, 80], [140, 72]
	], '#f69aae');

	polygon([
		[52, 76], [62, 70], [72, 67], [78, 59], [88, 52], [99, 45], [105, 37],
		[105, 29], [102, 22], [98, 17], [104, 19], [111, 27], [115, 37], [116, 46],
		[112, 54], [102, 61], [88, 68], [73, 74], [61, 80], [55, 86], [55, 92],
		[61, 96], [71, 97], [84, 93], [99, 87], [115, 78], [128, 68], [131, 62],
		[135, 65], [137, 73], [133, 81], [124, 89], [110, 96], [94, 101], [77, 103],
		[62, 101], [52, 96], [47, 90], [48, 83]
	], '#f7a0b2', dark, 1.2);

	polygon([
		[84, 55], [94, 48], [102, 40], [106, 32], [105, 25], [101, 19], [105, 19],
		[111, 27], [115, 37], [116, 46], [112, 54], [102, 61], [88, 68], [73, 74],
		[61, 80], [55, 86], [55, 92], [61, 96], [71, 97], [84, 93], [99, 87],
		[115, 78], [128, 68], [131, 62], [135, 65], [137, 73], [133, 81], [124, 89],
		[110, 96], [94, 101], [77, 103], [62, 101], [52, 96], [47, 90], [48, 83],
		[54, 75], [64, 70], [75, 66]
	], '#ffc0cb');

	polygon([
		[130, 60], [137, 64], [143, 73], [147, 84], [147, 93], [143, 99], [135, 104],
		[124, 107], [109, 109], [93, 109], [77, 107], [65, 103], [57, 98], [54, 92],
		[60, 88], [70, 88], [84, 92], [100, 92], [116, 88], [129, 81], [137, 73]
	], '#db476b', null);
	polygon([
		[57, 94], [67, 94], [81, 98], [98, 99], [115, 96], [131, 90], [144, 82],
		[147, 87], [144, 95], [136, 101], [123, 105], [108, 107], [91, 107], [75, 104],
		[63, 100]
	], '#f8a2b3');

	polygon([
		[45, 88], [49, 79], [56, 73], [66, 69], [76, 68], [83, 72], [87, 79],
		[84, 87], [75, 93], [63, 97], [54, 96], [48, 93]
	], '#df4b6d', null);
	polygon([
		[47, 86], [52, 78], [60, 73], [69, 72], [77, 75], [80, 80], [77, 86],
		[68, 91], [58, 93], [51, 91], [47, 89]
	], '#ffc0cb');

	polygon([
		[48, 97], [56, 101], [69, 105], [85, 108], [103, 108], [121, 105], [137, 100],
		[147, 93], [151, 97], [148, 106], [142, 113], [139, 120], [139, 145],
		[142, 146], [141, 149], [137, 149], [135, 146], [135, 124],
		[131, 121], [126, 118], [122, 120], [120, 127], [118, 136], [115, 141],
		[111, 143], [107, 140], [105, 135], [105, 121], [100, 118], [95, 117],
		[91, 121], [88, 130], [88, 153], [85, 158], [80, 159], [76, 155],
		[76, 130], [72, 124], [67, 121], [63, 123],
		[57, 118], [56, 143], [53, 148], [49, 148], [47, 145], [47, 139],
		[48, 116], [44, 108], [43, 100]
	], '#e94768');
	polygon([
		[48, 98], [57, 103], [71, 107], [87, 109], [104, 109], [122, 106], [138, 101],
		[148, 95], [149, 101], [143, 110], [140, 118], [140, 144], [138, 146],
		[137, 143], [137, 120], [133, 119], [130, 117], [126, 119], [124, 126],
		[122, 136], [119, 140], [115, 141], [111, 138], [110, 133], [110, 120],
		[104, 117], [99, 116], [95, 120], [93, 129], [93, 153], [89, 156],
		[82, 157], [79, 153], [79, 129], [74, 123], [69, 120], [64, 121],
		[56, 116], [55, 142], [52, 146], [49, 145], [49, 139], [50, 116],
		[45, 107], [44, 100]
	], '#f36a7f');

	polygon([[52, 75], [60, 71], [70, 69], [76, 71], [69, 73], [61, 77], [55, 83], [52, 90], [49, 88], [50, 81]], cream);
	polygon([[82, 70], [91, 65], [102, 60], [111, 54], [115, 47], [114, 41], [118, 47], [118, 54], [114, 61], [104, 67], [91, 73]], cream);
	polygon([[70, 88], [78, 86], [83, 86], [80, 89], [73, 91], [68, 91]], cream);
	polygon([[91, 96], [102, 93], [111, 90], [118, 86], [123, 86], [119, 90], [108, 95], [97, 98]], cream);
	polygon([[126, 68], [131, 70], [134, 76], [133, 81], [130, 77]], '#ffb6c2');
	polygon([
		[88, 9], [97, 10], [105, 14], [111, 22], [115, 32], [116, 40],
		[112, 37], [110, 29], [105, 22], [99, 17], [92, 15]
	], '#db476b');
	polygon([[44, 90], [47, 83], [54, 77], [62, 73], [68, 72], [62, 77], [54, 81], [49, 87], [48, 96]], '#d94465');
	polygon([[46, 94], [52, 98], [63, 102], [77, 105], [94, 106], [111, 104], [127, 100], [140, 94], [148, 87], [146, 96], [139, 104], [126, 109], [108, 112], [89, 112], [71, 109], [56, 104], [48, 99]], '#e85b79');
	polygon([[51, 99], [61, 103], [76, 106], [93, 108], [109, 106], [125, 102], [138, 97], [134, 103], [121, 108], [104, 110], [87, 109], [71, 107], [58, 103]], '#f696a7');
	polygon([[137, 94], [146, 87], [149, 91], [146, 100], [141, 105], [139, 115], [136, 118], [136, 105]], '#d94465');

	const sprinkles = [
		[82, 40, '#159f91'], [94, 43, '#e65b35'], [72, 50, '#e5ca39'], [85, 48, '#308dc0'],
		[66, 53, '#dd5383'], [101, 55, '#e9bd32'], [112, 61, '#278fbc'], [127, 68, '#91b84d'],
		[118, 74, '#edbd38'], [135, 78, '#138f72'], [112, 88, '#218fb5'], [95, 96, '#ebbf32'],
		[83, 104, '#299957'], [60, 98, '#298e50'], [70, 101, '#8e5bac'], [117, 101, '#e9ba30'],
		[129, 96, '#278fb9'], [138, 91, '#e8b735'], [62, 111, '#198fae'], [103, 110, '#ed9a32'],
		[126, 112, '#eac33c'], [140, 105, '#da4d76']
	];
	for (const [x, y, color] of sprinkles) pixel(x, y, 2, 3, color);

	pixel(50, 141, 2, 4, '#ff9eb0');
	pixel(79, 146, 2, 8, '#ff9eb0');
	pixel(112, 132, 2, 5, '#ff9eb0');
	pixel(137, 138, 2, 5, '#ff9eb0');
	pixel(48, 138, 1, 5, '#fff2ef');
	pixel(78, 145, 1, 8, '#fff2ef');
	pixel(111, 130, 1, 5, '#fff2ef');
	pixel(136, 136, 1, 6, '#fff2ef');

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(85, 4);
	for (const [x, y] of [
		[102, 4], [108, 7], [115, 14], [121, 23], [126, 34], [130, 48], [137, 51], [144, 58],
		[150, 68], [154, 81], [155, 94], [152, 105], [147, 114], [145, 123], [145, 146],
		[142, 149], [137, 149], [135, 146], [135, 124], [131, 121], [126, 118], [122, 120],
		[120, 127], [118, 136], [115, 141], [111, 143], [107, 140], [105, 135], [105, 121],
		[100, 118], [95, 117], [91, 121], [88, 130], [88, 153], [85, 158], [80, 159], [76, 155],
		[76, 130], [72, 124], [67, 121], [63, 123], [58, 120], [57, 143], [54, 149], [49, 149],
		[46, 146], [46, 139], [47, 116], [43, 109], [42, 99], [42, 88], [45, 79], [50, 72],
		[57, 67], [66, 64], [70, 57], [77, 51], [87, 45], [94, 38], [96, 31], [94, 25], [90, 21],
		[87, 25], [84, 21], [84, 12], [87, 7]
	]) ctx.lineTo(x, y);
	ctx.closePath();
	ctx.clip();
	polygon([[95, 22], [101, 28], [100, 34], [96, 39], [91, 44], [85, 48], [79, 52], [74, 57], [70, 60], [66, 57], [71, 51], [77, 47], [83, 43], [89, 39], [93, 34], [95, 29]], '#ffffff');
	polygon([[57, 120], [63, 121], [69, 125], [74, 131], [75, 143], [72, 149], [68, 145], [66, 138], [61, 134], [57, 132]], '#ffffff');
	polygon([[89, 122], [94, 120], [101, 121], [106, 126], [106, 139], [103, 145], [99, 139], [97, 132], [92, 129]], '#ffffff');
	polygon([[118, 120], [124, 119], [131, 122], [136, 128], [136, 142], [133, 148], [130, 142], [128, 135], [123, 130]], '#ffffff');
	ctx.restore();

	polygon([
		[85, 4], [102, 4], [108, 7], [115, 14], [121, 23], [126, 34], [130, 48],
		[137, 51], [144, 58], [150, 68], [154, 81], [155, 94], [152, 105], [147, 114],
		[145, 123], [145, 146], [142, 149], [137, 149], [135, 146], [135, 124],
		[131, 121], [126, 118], [122, 120], [120, 127], [118, 136], [115, 141],
		[111, 143], [107, 140], [105, 135], [105, 121], [100, 118], [95, 117],
		[91, 121], [88, 130], [88, 153], [85, 158], [80, 159], [76, 155],
		[76, 130], [72, 124], [67, 121], [63, 123], [58, 120], [57, 143],
		[54, 149], [49, 149], [46, 146], [46, 139], [47, 116], [43, 109],
		[42, 99], [42, 88], [45, 79], [50, 72], [57, 67], [66, 64], [70, 57],
		[77, 51], [87, 45], [94, 38], [96, 31], [94, 25], [90, 21], [87, 25],
		[84, 21], [84, 12], [87, 7]
	], 'rgba(0, 0, 0, 0)', outline, 1.8);
}

drawPixelSwirl();

const scene = new THREE.Scene();
scene.background = new THREE.Color('#ffffff');

const camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 20);
camera.position.set(0, 0.25, 5.3);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

scene.add(new THREE.HemisphereLight('#ffffff', '#f7d7dd', 2.2));
const keyLight = new THREE.DirectionalLight('#fffdfb', 2.6);
keyLight.position.set(-2.5, 3.5, 5.2);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight('#ffc8d4', 1.2);
fillLight.position.set(3.5, 1.8, -3.8);
scene.add(fillLight);
const rimLight = new THREE.DirectionalLight('#ffdfe4', 1.1);
rimLight.position.set(-2.3, -1.2, -4.6);
scene.add(rimLight);

const shadow = new THREE.Mesh(
	new THREE.CircleGeometry(2.5, 48),
	new THREE.MeshBasicMaterial({ color: '#f2dfe4', transparent: true, opacity: 0.8 })
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.set(0, -1.8, -1.1);
scene.add(shadow);

const cover = new THREE.Group();
cover.position.set(0, -0.15, 0);
cover.rotation.set(0.18, -0.78, 0);
const scale = 0.0125;
const pixelData = ctx.getImageData(0, 0, spriteSize, spriteSize).data;
const voxelGroups = new Map();
for (let row = 0; row < spriteSize; row += 1) {
	for (let column = 0; column < spriteSize; column += 1) {
		const pixelIndex = (row * spriteSize + column) * 4;
	const alpha = pixelData[pixelIndex + 3];
		if (alpha < 96) continue;
		const red = Math.round(pixelData[pixelIndex] / 32) * 32;
		const green = Math.round(pixelData[pixelIndex + 1] / 32) * 32;
		const blue = Math.round(pixelData[pixelIndex + 2] / 32) * 32;
		const color = `#${[red, green, blue].map((channel) => Math.min(255, channel).toString(16).padStart(2, '0')).join('')}`;
		if (!voxelGroups.has(color)) voxelGroups.set(color, []);
		voxelGroups.get(color).push({ column, row });
	}
}

const distances = new Float32Array(spriteSize * spriteSize);
for (let index = 0; index < distances.length; index += 1) {
	distances[index] = pixelData[index * 4 + 3] >= 96 ? 64 : 0;
}
for (let row = 0; row < spriteSize; row += 1) {
	for (let column = 0; column < spriteSize; column += 1) {
		const index = row * spriteSize + column;
		if (distances[index] === 0) continue;
		const left = column > 0 ? distances[index - 1] + 1 : 1;
		const above = row > 0 ? distances[index - spriteSize] + 1 : 1;
		const aboveLeft = row > 0 && column > 0 ? distances[index - spriteSize - 1] + 1.4 : 1.4;
		const aboveRight = row > 0 && column < spriteSize - 1 ? distances[index - spriteSize + 1] + 1.4 : 1.4;
		distances[index] = Math.min(distances[index], left, above, aboveLeft, aboveRight);
	}
}
for (let row = spriteSize - 1; row >= 0; row -= 1) {
	for (let column = spriteSize - 1; column >= 0; column -= 1) {
		const index = row * spriteSize + column;
		if (distances[index] === 0) continue;
		const right = column < spriteSize - 1 ? distances[index + 1] + 1 : 1;
		const below = row < spriteSize - 1 ? distances[index + spriteSize] + 1 : 1;
		const belowRight = row < spriteSize - 1 && column < spriteSize - 1 ? distances[index + spriteSize + 1] + 1.4 : 1.4;
		const belowLeft = row < spriteSize - 1 && column > 0 ? distances[index + spriteSize - 1] + 1.4 : 1.4;
		distances[index] = Math.min(distances[index], right, below, belowRight, belowLeft);
	}
}

const voxelSize = scale;
const voxelGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, 1);
const frontMaterial = new THREE.MeshStandardMaterial({
	color: '#ff7aa4',
	roughness: 0.9,
	metalness: 0.02,
	flatShading: true,
	toneMapped: true
});
const sideMaterial = new THREE.MeshStandardMaterial({
	color: '#cb3157',
	roughness: 1,
	metalness: 0,
	flatShading: true
});
const voxel = new THREE.Object3D();
for (const [color, pixels] of voxelGroups) {
	const front = frontMaterial.clone();
	front.color.set(color);
	const side = sideMaterial.clone();
	side.color.set(color).multiplyScalar(0.8);
	const instances = new THREE.InstancedMesh(voxelGeometry, [side, side, side, side, front, front], pixels.length);
	for (let index = 0; index < pixels.length; index += 1) {
		const { column, row } = pixels[index];
		const pixelOffset = (row * spriteSize + column) * 4;
		const isOutline = pixelData[pixelOffset] < 48 && pixelData[pixelOffset + 1] < 48 && pixelData[pixelOffset + 2] < 48;
		const depth = isOutline ? 0.16 : 0.07 + Math.min(distances[row * spriteSize + column], 7) * 0.018;
		voxel.position.set(
			(column + 0.5 - spriteSize / 2) * scale,
			(spriteSize / 2 - row - 0.5) * scale,
			-depth * 0.55
		);
		voxel.scale.set(1, 1, depth);
		voxel.updateMatrix();
		instances.setMatrixAt(index, voxel.matrix);
	}
	instances.instanceMatrix.needsUpdate = true;
	cover.add(instances);
}

scene.add(cover);

let dragging = false;
let previousX = 0;
let previousY = 0;
canvas.addEventListener('pointerdown', (event) => {
	dragging = true;
	previousX = event.clientX;
	previousY = event.clientY;
	canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointerup', () => { dragging = false; });
canvas.addEventListener('pointercancel', () => { dragging = false; });
canvas.addEventListener('pointermove', (event) => {
	if (!dragging) return;
	cover.rotation.y += (event.clientX - previousX) * 0.009;
	cover.rotation.x = THREE.MathUtils.clamp(cover.rotation.x + (event.clientY - previousY) * 0.009, -0.8, 0.8);
	previousX = event.clientX;
	previousY = event.clientY;
});

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
animate();
