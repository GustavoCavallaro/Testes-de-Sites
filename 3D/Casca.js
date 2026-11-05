import * as THREE from 'three';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#f7f4ee');

const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 40);
camera.position.set(0, 1.5, 6.7);
camera.lookAt(0, 0.12, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(0.45);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

scene.add(new THREE.HemisphereLight('#fff3dc', '#65351f', 2.3));
const keyLight = new THREE.DirectionalLight('#fff3dc', 2.8);
keyLight.position.set(-3.5, 5, 4.5);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight('#f5a95c', 1.15);
fillLight.position.set(4, 1.5, -3);
scene.add(fillLight);

const shellModel = new THREE.Group();
scene.add(shellModel);

const topY = 1.12;
const bottomY = -1.93;
const coneHeight = topY - bottomY;
const topRadius = 1.03;
const tipRadius = 0.14;
const radialSegments = 24;
const heightSegments = 34;

function makeConeGeometry(radiusScale = 1) {
	const positions = [];
	const indices = [];
	for (let row = 0; row <= heightSegments; row += 1) {
		const t = row / heightSegments;
		const radius = THREE.MathUtils.lerp(tipRadius, topRadius, t) * radiusScale;
		const y = THREE.MathUtils.lerp(bottomY, topY, t);
		for (let segment = 0; segment < radialSegments; segment += 1) {
			const angle = (segment / radialSegments) * Math.PI * 2;
			positions.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
		}
	}

	for (let row = 0; row < heightSegments; row += 1) {
		for (let segment = 0; segment < radialSegments; segment += 1) {
			const next = (segment + 1) % radialSegments;
			const lowerLeft = row * radialSegments + segment;
			const lowerRight = row * radialSegments + next;
			const upperLeft = (row + 1) * radialSegments + segment;
			const upperRight = (row + 1) * radialSegments + next;
			indices.push(lowerLeft, upperLeft, upperRight, lowerLeft, upperRight, lowerRight);
		}
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setIndex(indices);
	geometry.computeVertexNormals();
	return geometry;
}

const outline = new THREE.Mesh(
	makeConeGeometry(1.055),
	new THREE.MeshBasicMaterial({ color: '#171516', side: THREE.BackSide, depthTest: false, depthWrite: false }),
);
outline.renderOrder = 0;
shellModel.add(outline);

const coneMaterial = new THREE.MeshStandardMaterial({ color: '#d78a2d', roughness: 1, flatShading: true, side: THREE.DoubleSide });
const coneBody = new THREE.Mesh(makeConeGeometry(), coneMaterial);
coneBody.renderOrder = 1;
shellModel.add(coneBody);

const waffleShadowMaterial = new THREE.MeshStandardMaterial({ color: '#bf7127', roughness: 1, flatShading: true });
const waffleLineMaterial = new THREE.MeshBasicMaterial({ color: '#f7c56a' });
const waffleLineCount = 12;
const waffleTurns = 1.0;

function addWaffleLine(startAngle, direction) {
	const points = [];
	const lineSteps = 52;
	for (let step = 0; step <= lineSteps; step += 1) {
		const t = step / lineSteps;
		const radius = THREE.MathUtils.lerp(tipRadius, topRadius, t);
		const angle = startAngle + direction * (t - 0.5) * Math.PI * 2 * waffleTurns;
		points.push(new THREE.Vector3(
			Math.cos(angle) * (radius + 0.008),
			THREE.MathUtils.lerp(bottomY, topY, t),
			Math.sin(angle) * (radius + 0.008),
		));
	}

	const curve = new THREE.CatmullRomCurve3(points);
	const shadow = new THREE.Mesh(new THREE.TubeGeometry(curve, 52, 0.024, 4, false), waffleShadowMaterial);
	shadow.renderOrder = 2;
	shellModel.add(shadow);

	const highlightPoints = points.map((point) => {
		const outward = new THREE.Vector3(point.x, 0, point.z).normalize();
		return point.clone().add(outward.multiplyScalar(0.025));
	});
	const highlightCurve = new THREE.CatmullRomCurve3(highlightPoints);
	const highlight = new THREE.Mesh(new THREE.TubeGeometry(highlightCurve, 52, 0.016, 4, false), waffleLineMaterial);
	highlight.renderOrder = 3;
	shellModel.add(highlight);
}

for (let index = 0; index < waffleLineCount; index += 1) {
	const angle = (index / waffleLineCount) * Math.PI * 2;
	addWaffleLine(angle, 1);
	addWaffleLine(angle, -1);
}

const rimOutline = new THREE.Mesh(
	new THREE.TorusGeometry(0.97, 0.055, 6, 36),
	new THREE.MeshBasicMaterial({ color: '#171516' }),
);
rimOutline.rotation.x = Math.PI / 2;
rimOutline.position.y = topY - 0.02;
rimOutline.renderOrder = 4;
shellModel.add(rimOutline);

const rim = new THREE.Mesh(
	new THREE.TorusGeometry(0.95, 0.032, 6, 36),
	new THREE.MeshStandardMaterial({ color: '#f2b15e', roughness: 1, flatShading: true }),
);
rim.rotation.x = Math.PI / 2;
rim.position.y = topY + 0.01;
rim.renderOrder = 6;
shellModel.add(rim);

const interiorGeometry = new THREE.CircleGeometry(0.82, 32);
interiorGeometry.rotateX(-Math.PI / 2);
const interior = new THREE.Mesh(
	interiorGeometry,
	new THREE.MeshBasicMaterial({ color: '#6a3417', side: THREE.DoubleSide, depthTest: true, depthWrite: true }),
);
interior.position.y = topY - 0.09;
interior.renderOrder = 5;
shellModel.add(interior);

shellModel.rotation.x = -0.16;
shellModel.rotation.y = 0.12;

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
	shellModel.rotation.y += (event.clientX - previousX) * 0.012;
	shellModel.rotation.x = THREE.MathUtils.clamp(shellModel.rotation.x + (event.clientY - previousY) * 0.008, -1.35, 1.35);
	previousX = event.clientX;
	previousY = event.clientY;
});

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
	const elapsed = performance.now() * 0.001;
	if (!dragging) {
		shellModel.rotation.y += 0.0035;
	}
	shellModel.rotation.z = Math.sin(elapsed * 1.4) * 0.06;
	shellModel.position.y = Math.sin(elapsed * 1.8) * 0.08;
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
animate();
