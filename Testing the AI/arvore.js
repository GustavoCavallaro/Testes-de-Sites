import { createTrunkBlock } from "./tronco.js";
import { createLeafBlock } from "./folhas.js";

export function createTree(THREE) {
	const tree = new THREE.Group();
	const trunk = [createTrunkBlock(THREE), createTrunkBlock(THREE), createTrunkBlock(THREE), createTrunkBlock(THREE), createTrunkBlock(THREE)];
	const foliage = [
		{ position: [0, 2.8, 0], scale: [1.45, 0.55, 1.45] },
		{ position: [0, 4.25, 0], scale: [1.22, 0.55, 1.22] },
		{ position: [0, 5.8, 0], scale: [1, 0.52, 1] },
		{ position: [0, 7.35, 0], scale: [0.76, 0.48, 0.76] },
		{ position: [0, 8.9, 0], scale: [0.52, 0.4, 0.52] },
	];

	trunk.forEach((block, index) => {
		block.position.set(0, 1.35 + index * 1.72, 0);
		block.scale.set(0.38, 0.64, 0.38);
		tree.add(block);
	});

	foliage.forEach(({ position, scale }) => {
		const block = createLeafBlock(THREE);
		block.position.set(...position);
		block.scale.set(...scale);
		tree.add(block);
	});

	tree.userData.isTree = true;
	return tree;
}
