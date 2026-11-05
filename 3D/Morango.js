import * as THREE from 'three';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#f8f6ef');

const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 40);
camera.position.set(0, 0.8, 5.3);
camera.lookAt(0, -0.05, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(0.48);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

scene.add(new THREE.HemisphereLight('#fff5dc', '#6b332d', 2.25));
const keyLight = new THREE.DirectionalLight('#ffffff', 2.6);
keyLight.position.set(-3, 5, 5);
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight('#ffb0a2', 1.1);
rimLight.position.set(4, 1, -3);
scene.add(rimLight);

const strawberry = new THREE.Group();
scene.add(strawberry);

function updateStrawberryScale() {
	const aspect = window.innerWidth / window.innerHeight;
	const squareReduction = THREE.MathUtils.clamp((1.05 - aspect) / 0.05, 0, 1) * 0.11;
	const portraitReduction = THREE.MathUtils.clamp((1 - aspect) / 0.46, 0, 1) * 0.03;
	strawberry.scale.setScalar(1 - squareReduction - portraitReduction);
}

updateStrawberryScale();

const profile = [
	{ y: -1.05, radius: 0 },
	{ y: -1.04, radius: 0.075 },
	{ y: -0.99, radius: 0.17 },
	{ y: -0.9, radius: 0.29 },
	{ y: -0.73, radius: 0.39 },
	{ y: -0.43, radius: 0.5 },
	{ y: -0.08, radius: 0.55 },
	{ y: 0.22, radius: 0.55 },
	{ y: 0.43, radius: 0.46 },
	{ y: 0.57, radius: 0.27 },
	{ y: 0.64, radius: 0 },
];

function makeBerryGeometry(radiusScale) {
	const positions = [];
	const indices = [];
	const rings = [];
	const radialSegments = 28;
	const samplesPerSection = 5;

	for (let section = 0; section < profile.length - 1; section += 1) {
		const previous = profile[Math.max(0, section - 1)];
		const start = profile[section];
		const end = profile[section + 1];
		const next = profile[Math.min(profile.length - 1, section + 2)];
		for (let sample = 0; sample < samplesPerSection; sample += 1) {
			const t = sample / samplesPerSection;
			const tSquared = t * t;
			const tCubed = tSquared * t;
			const radius = 0.5 * (
				2 * start.radius
				+ (-previous.radius + end.radius) * t
				+ (2 * previous.radius - 5 * start.radius + 4 * end.radius - next.radius) * tSquared
				+ (-previous.radius + 3 * start.radius - 3 * end.radius + next.radius) * tCubed
			);
			rings.push({
				y: THREE.MathUtils.lerp(start.y, end.y, t),
				radius: Math.max(0, radius),
			});
		}
	}
	rings.push(profile[profile.length - 1]);

	for (const ring of rings) {
		for (let segment = 0; segment < radialSegments; segment += 1) {
			const angle = (segment / radialSegments) * Math.PI * 2;
			const lobe = 1 + Math.cos(angle * 3 + 0.35) * 0.008;
			const radius = ring.radius * radiusScale * lobe;
			positions.push(Math.cos(angle) * radius, ring.y, Math.sin(angle) * radius);
		}
	}

	for (let ring = 0; ring < rings.length - 1; ring += 1) {
		for (let segment = 0; segment < radialSegments; segment += 1) {
			const next = (segment + 1) % radialSegments;
			const lowerLeft = ring * radialSegments + segment;
			const lowerRight = ring * radialSegments + next;
			const upperLeft = (ring + 1) * radialSegments + segment;
			const upperRight = (ring + 1) * radialSegments + next;
			indices.push(lowerLeft, upperRight, lowerRight, lowerLeft, upperLeft, upperRight);
		}
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setIndex(indices);
	geometry.computeVertexNormals();
	return geometry;
}

const berryMaterial = new THREE.MeshStandardMaterial({
	color: '#fa1428',
	roughness: 0.95,
});
const outline = new THREE.Mesh(
	makeBerryGeometry(1.05),
	new THREE.MeshBasicMaterial({ color: '#241b20', side: THREE.BackSide, depthTest: false, depthWrite: false }),
);
outline.renderOrder = 0;
strawberry.add(outline);

const berryBody = new THREE.Mesh(makeBerryGeometry(1), berryMaterial);
berryBody.renderOrder = 1;
strawberry.add(berryBody);

const seedMaterial = new THREE.MeshStandardMaterial({ color: '#ffe044', roughness: 1 });
const seedGeometry = new THREE.SphereGeometry(1, 10, 8);
let seedRandomState = 317;
function nextSeedRandom() {
	seedRandomState = (seedRandomState * 16807) % 2147483647;
	return (seedRandomState - 1) / 2147483646;
}

const seedLocations = [];
for (let attempt = 0; seedLocations.length < 54 && attempt < 1800; attempt += 1) {
	const y = THREE.MathUtils.lerp(-0.94, 0.46, nextSeedRandom());
	const radius = radiusAt(y);
	if (radius < 0.15 || nextSeedRandom() > radius / 0.55) continue;

	const angle = nextSeedRandom() * Math.PI * 2;
	const cosine = Math.cos(angle);
	const sine = Math.sin(angle);
	const position = new THREE.Vector3(cosine * radius, y, sine * radius);
	if (seedLocations.some((placed) => placed.distanceToSquared(position) < 0.018)) continue;
	seedLocations.push(position);

	const radialSlope = (radiusAt(y + 0.01) - radiusAt(y - 0.01)) / 0.02;
	const normal = new THREE.Vector3(cosine, -radialSlope, sine).normalize();
	const seed = new THREE.Mesh(seedGeometry, seedMaterial);
	const size = 0.78 + nextSeedRandom() * 0.44;
	seed.scale.set(0.028 * size, 0.044 * size, 0.018 * size);
	seed.position.copy(position).add(normal.clone().multiplyScalar(0.012));
	seed.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
	seed.renderOrder = 2;
	strawberry.add(seed);
}

function radiusAt(y) {
	for (let index = 0; index < profile.length - 1; index += 1) {
		const lower = profile[index];
		const upper = profile[index + 1];
		if (y >= lower.y && y <= upper.y) {
			const amount = (y - lower.y) / (upper.y - lower.y);
			return THREE.MathUtils.lerp(lower.radius, upper.radius, amount);
		}
	}
	return 0.1;
}

const leafMaterial = new THREE.MeshStandardMaterial({ color: '#258f35', side: THREE.DoubleSide, roughness: 1 });
const leafLightMaterial = new THREE.MeshStandardMaterial({ color: '#61c73c', side: THREE.DoubleSide, roughness: 1 });

function upperSurfaceYAtRadius(radius) {
	for (let index = profile.length - 1; index > 0; index -= 1) {
		const upper = profile[index];
		const lower = profile[index - 1];
		if (radius >= Math.min(upper.radius, lower.radius) && radius <= Math.max(upper.radius, lower.radius)) {
			const fraction = (radius - lower.radius) / (upper.radius - lower.radius);
			return THREE.MathUtils.lerp(lower.y, upper.y, fraction);
		}
	}
	return 0.22;
}

function addLeaf(angle, length, width, material) {
	const direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
	const across = new THREE.Vector3(-direction.z, 0, direction.x);
	const root = new THREE.Vector3(direction.x * 0.04, 0, direction.z * 0.04);
	const positions = [];
	const indices = [];
	const segments = 10;
	for (let segment = 0; segment <= segments; segment += 1) {
		const t = segment / segments;
		const fullness = Math.pow(Math.sin(Math.PI * t), 0.78);
		const center = root.clone().add(direction.clone().multiplyScalar(length * t));
		center.y = upperSurfaceYAtRadius(length * t) + 0.025 + Math.sin(Math.PI * t) * 0.045;
		const halfWidth = width * fullness;
		const left = center.clone().add(across.clone().multiplyScalar(halfWidth));
		const right = center.clone().add(across.clone().multiplyScalar(-halfWidth));
		left.y -= 0.018 * fullness;
		right.y -= 0.018 * fullness;
		positions.push(left.x, left.y, left.z, center.x, center.y + 0.012 * fullness, center.z, right.x, right.y, right.z);
	}
	for (let segment = 0; segment < segments; segment += 1) {
		const current = segment * 3;
		const next = current + 3;
		indices.push(current, next, current + 1, current + 1, next, next + 1);
		indices.push(current + 1, next + 1, current + 2, current + 2, next + 1, next + 2);
	}
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setIndex(indices);
	geometry.computeVertexNormals();
	const leaf = new THREE.Mesh(geometry, material);
	leaf.renderOrder = 3;
	strawberry.add(leaf);
}

const calyx = new THREE.Mesh(
	new THREE.SphereGeometry(0.075, 12, 8),
	leafMaterial,
);
calyx.position.y = 0.6;
strawberry.add(calyx);

for (let index = 0; index < 6; index += 1) {
	const angle = (index / 6) * Math.PI * 2 + 0.17;
	const length = index % 2 === 0 ? 0.47 : 0.43;
	addLeaf(angle, length, index % 2 === 0 ? 0.16 : 0.14, index % 2 === 0 ? leafMaterial : leafLightMaterial);
}

const stem = new THREE.Mesh(
	new THREE.CylinderGeometry(0.03, 0.038, 0.09, 10),
	new THREE.MeshStandardMaterial({ color: '#477638', flatShading: true, roughness: 1 }),
);
stem.position.set(0, 0.63, 0);
stem.rotation.z = -0.12;
strawberry.add(stem);

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
	strawberry.rotation.y += (event.clientX - previousX) * 0.012;
	strawberry.rotation.x = THREE.MathUtils.clamp(strawberry.rotation.x + (event.clientY - previousY) * 0.008, -1.35, 1.35);
	previousX = event.clientX;
	previousY = event.clientY;
});

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	updateStrawberryScale();
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
animate();
