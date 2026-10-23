import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { createDirtBlock } from "./terra.js";
import { createGrassBlock } from "./grama.js";
import { createPlankBlock } from "./tabua.js";
import { createTrunkBlock } from "./tronco.js";
import { createWaterBlock } from "./agua.js";
import { createLeafBlock } from "./folhas.js";
import { createTree } from "./arvore.js";

const container = document.querySelector("#scene");
const scene = new THREE.Scene();
scene.fog = new THREE.Fog("#304d35", 1000, 99999);

const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 99999);
camera.position.set(12.5, 10, 19);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.panSpeed = 1.4;
controls.enableZoom = false;
controls.minDistance = 4.6;
controls.maxDistance = 99999;
controls.target.set(0, 5, 0);
controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;

const blocks = [createDirtBlock(THREE), createGrassBlock(THREE), createPlankBlock(THREE), createTrunkBlock(THREE), createWaterBlock(THREE), createLeafBlock(THREE), createTree(THREE)];
const blockPositions = [-4.8, -3.3, -1.8, -0.3, 1.2, 2.5, 4];
const blockBaseY = [1.42, 1.42, 1.42, 1.42, 1.195, 1.42, 0];
blocks.forEach((block, index) => {
	block.position.x = blockPositions[index];
	block.position.y = blockBaseY[index];
	if (!block.userData.isTree) {
		block.scale.set(0.42, index === 4 ? 0.28 : 0.42, 0.42);
	} else {
		block.scale.setScalar(1.05);
	}
	scene.add(block);
});

const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 64), new THREE.MeshStandardMaterial({ color: "#243a2a", roughness: 1, transparent: true, opacity: .7 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const keyLight = new THREE.DirectionalLight("#e4f2be", 4.1);
keyLight.position.set(-4, 8, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 1;
keyLight.shadow.camera.left = -5;
keyLight.shadow.camera.right = 5;
keyLight.shadow.camera.top = 5;
keyLight.shadow.camera.bottom = -5;
scene.add(keyLight);
scene.add(new THREE.HemisphereLight("#b7d67c", "#183022", 1.4));

const clock = new THREE.Clock();
function resize() {
	const { width, height } = container.getBoundingClientRect();
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height, false);
}
window.addEventListener("resize", resize);
resize();

function zoomCamera(multiplier) {
	const offset = camera.position.clone().sub(controls.target);
	const distance = offset.length();
	const nextDistance = THREE.MathUtils.clamp(distance * multiplier, controls.minDistance, controls.maxDistance);
	camera.position.copy(controls.target).add(offset.normalize().multiplyScalar(nextDistance));
	controls.update();
}

function moveCamera(horizontal, vertical) {
	const movement = new THREE.Vector3();
	const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0).setY(0).normalize();
	const forward = new THREE.Vector3().subVectors(controls.target, camera.position).setY(0).normalize();
	movement.addScaledVector(right, horizontal);
	movement.addScaledVector(forward, vertical);
	camera.position.add(movement);
	controls.update();
}

function moveCameraVertically(amount) {
	const movement = new THREE.Vector3(0, amount, 0);
	camera.position.add(movement);
	controls.update();
}

container.addEventListener("wheel", (event) => {
	event.preventDefault();
	zoomCamera(event.deltaY > 0 ? 1.15 : 0.87);
}, { passive: false });

window.addEventListener("keydown", (event) => {
	if (event.ctrlKey && (event.key === "+" || event.code === "Equal" || event.code === "NumpadAdd")) {
		event.preventDefault();
		zoomCamera(0.75);
		return;
	}
	const movement = {
		w: [0, 0.45],
		arrowup: [0, 0.45],
		s: [0, -0.45],
		arrowdown: [0, -0.45],
		a: [-0.45, 0],
		arrowleft: [-0.45, 0],
		d: [0.45, 0],
		arrowright: [0.45, 0],
	};
	if (event.key.toLowerCase() === "q" || event.key.toLowerCase() === "e") {
		event.preventDefault();
		moveCameraVertically(event.key.toLowerCase() === "q" ? 0.45 : -0.45);
		return;
	}
	const direction = movement[event.key.toLowerCase()];
	if (direction) {
		event.preventDefault();
		moveCamera(direction[0], direction[1]);
	}
});

document.querySelector("#reset-camera").addEventListener("click", () => {
	camera.position.set(12.5, 10, 19);
	controls.target.set(0, 5, 0);
	controls.update();
});

function animate() {
	requestAnimationFrame(animate);
	const elapsed = clock.getElapsedTime();
	blocks.forEach((block, index) => {
		if (block.userData.isTree) {
			block.position.y = Math.sin(elapsed * .9 + index) * .035;
			block.rotation.y = Math.sin(elapsed * .35 + index) * .08;
			return;
		}
		block.position.y = blockBaseY[index] + Math.sin(elapsed * .9 + index) * .035;
		block.rotation.y = Math.sin(elapsed * .35 + index) * .08;
	});
	controls.update();
	renderer.render(scene, camera);
}
animate();
