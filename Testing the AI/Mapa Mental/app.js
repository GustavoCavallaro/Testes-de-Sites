const canvas = document.getElementById('mindCanvas');
const context = canvas.getContext('2d');
const mapTitle = document.getElementById('mapTitle');
const nodeInput = document.getElementById('nodeInput');
const nodeHeading = document.getElementById('nodeHeading');
const saveStatus = document.getElementById('saveStatus');
const colors = { coral: '#f47761', blue: '#91c8df', green: '#96c9a7', lilac: '#c5b6da' };
const sizes = { small: 68, medium: 86, large: 106 };

let nodes = [
	{ id: 'root', text: 'Meu mapa mental', x: 0, y: 0, color: 'coral', size: 'large', parent: null },
	{ id: 'ideas', text: 'Ideias', x: -250, y: -145, color: 'coral', size: 'medium', parent: 'root' },
	{ id: 'projects', text: 'Projetos', x: 250, y: -145, color: 'blue', size: 'medium', parent: 'root' },
	{ id: 'steps', text: 'Próximos passos', x: 250, y: 155, color: 'green', size: 'medium', parent: 'root' },
	{ id: 'references', text: 'Referências', x: -250, y: 155, color: 'lilac', size: 'medium', parent: 'root' }
];
let selectedId = 'root';
let zoom = 1;
let pan = { x: 0, y: 0 };
let drag = null;
let history = [];
let historyIndex = -1;
let viewportInitialized = false;

function currentNode() { return nodes.find((node) => node.id === selectedId); }
function snapshot() { return JSON.stringify(nodes); }
function saveHistory() { history = history.slice(0, historyIndex + 1); history.push(snapshot()); historyIndex++; localStorage.setItem('clareira-canvas-map', snapshot()); saveStatus.textContent = 'salvo agora'; }
function restore(data) { nodes = JSON.parse(data); selectedId = nodes[0]?.id || 'root'; render(); updateInspector(); }
function newId() { return `node-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function radius(node) { return (node.id === 'root' ? 1.08 : 0.8) * sizes[node.size]; }
function mobilePan() { return canvas.clientWidth < 900 ? -Math.min(120, canvas.clientWidth * 0.17) : 0; }
function mobileZoom() { return canvas.clientWidth < 900 ? 0.72 : 1; }
function resizeCanvas() { const box = canvas.getBoundingClientRect(); const ratio = window.devicePixelRatio || 1; canvas.width = box.width * ratio; canvas.height = box.height * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0); if (!drag && !viewportInitialized) { pan.x = mobilePan(); zoom = mobileZoom(); document.getElementById('zoomValue').textContent = `${Math.round(zoom * 100)}%`; viewportInitialized = true; } render(); }
function screenPoint(event) { const box = canvas.getBoundingClientRect(); return { x: event.clientX - box.left, y: event.clientY - box.top }; }
function worldPoint(point) { return { x: (point.x - canvas.clientWidth / 2 - pan.x) / zoom, y: (point.y - canvas.clientHeight / 2 - pan.y) / zoom }; }
function canvasPoint(node) { return { x: canvas.clientWidth / 2 + pan.x + node.x * zoom, y: canvas.clientHeight / 2 + pan.y + node.y * zoom }; }
function nodeAt(point) { const world = worldPoint(point); return [...nodes].reverse().find((node) => Math.abs(world.x - node.x) < radius(node) * 1.15 && Math.abs(world.y - node.y) < (node.id === 'root' ? 38 : 27)); }
function nodeLabelLines(text, maxCharacters = 18) {

	const words = text.split(' ');
	const lines = [];
	let line = '';

	words.forEach((word) => {
		const candidate = line ? `${line} ${word}` : word;
		if (candidate.length > maxCharacters && line) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	});

	if (line) lines.push(line);
	return lines.slice(0, 2);
}

function roundedRect(x, y, width, height, radiusValue) { context.beginPath(); context.roundRect(x, y, width, height, radiusValue); }
function render() {
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	context.clearRect(0, 0, width, height);
	context.save();
	context.lineWidth = 2;
	context.lineCap = 'round';
	nodes.filter((node) => node.parent).forEach((node) => {
		const parent = nodes.find((item) => item.id === node.parent);
		const from = canvasPoint(parent);
		const to = canvasPoint(node);
		const curve = Math.max(45, Math.abs(to.x - from.x) * 0.42);
		const direction = to.x >= from.x ? 1 : -1;
		context.beginPath();
		context.moveTo(from.x, from.y);
		context.bezierCurveTo(from.x + curve * direction, from.y, to.x - curve * direction, to.y, to.x, to.y);
		context.strokeStyle = '#d5d0c7';
		context.stroke();
	});
	nodes.forEach((node) => {
		const point = canvasPoint(node);
		const nodeWidth = radius(node) * 2.15 * zoom;
		const nodeHeight = (node.id === 'root' ? 76 : 55) * zoom;
		const isSelected = node.id === selectedId;
		context.save();
		context.shadowColor = isSelected ? 'rgba(45, 38, 30, .16)' : 'transparent';
		context.shadowBlur = isSelected ? 12 : 0;
		roundedRect(point.x - nodeWidth / 2, point.y - nodeHeight / 2, nodeWidth, nodeHeight, (node.id === 'root' ? 16 : 11) * zoom);
		context.fillStyle = colors[node.color] || colors.coral;
		context.fill();
		context.shadowColor = 'transparent';
		if (isSelected) { context.lineWidth = 2; context.strokeStyle = '#292725'; context.stroke(); }
		context.fillStyle = '#292929';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.font = `${node.id === 'root' ? 700 : 700} ${Math.max(11, (node.id === 'root' ? 15 : 12) * zoom)}px Manrope`;
		const lines = nodeLabelLines(node.text, node.id === 'root' ? 22 : 17);
		const lineHeight = Math.max(13, 15 * zoom);
		const labelOffset = node.id === 'root' ? -8 : lines.length > 1 ? -7 : 1;
		lines.forEach((line, index) => context.fillText(line, point.x, point.y + labelOffset * zoom + index * lineHeight));
		if (node.id === 'root') { context.fillStyle = 'rgba(42,42,42,.5)'; context.font = `${Math.max(8, 9 * zoom)}px DM Mono`; context.fillText(`${nodes.length - 1} ramificações`, point.x, point.y + 18 * zoom); }
		context.restore();
	});
	context.restore();
}

function updateInspector() {
	const node = currentNode();
	if (!node) return;
	nodeHeading.textContent = node.text;
	nodeInput.value = node.text;
	document.querySelectorAll('.swatch').forEach((button) => button.classList.toggle('active', button.dataset.color === node.color));
	document.querySelectorAll('.sizes button').forEach((button) => button.classList.toggle('active', button.dataset.size === node.size));
}
function selectNode(node) { selectedId = node.id; render(); updateInspector(); }
function addNode(parentId = selectedId) {
	const parent = nodes.find((node) => node.id === parentId) || nodes[0];
	const siblings = nodes.filter((node) => node.parent === parent.id).length;
	const side = siblings % 2 === 0 ? -1 : 1;
	nodes.push({ id: newId(), text: 'Nova ideia', x: parent.x + side * (145 + siblings * 12), y: parent.y + (siblings % 2 === 0 ? -1 : 1) * (120 + siblings * 10), color: ['coral', 'blue', 'green', 'lilac'][nodes.length % 4], size: 'medium', parent: parent.id });
	selectedId = nodes[nodes.length - 1].id;
	saveHistory(); render(); updateInspector(); nodeInput.focus(); nodeInput.select();
}
function deleteNode() { if (selectedId === 'root') return; const remove = new Set([selectedId]); let changed = true; while (changed) { changed = false; nodes.forEach((node) => { if (remove.has(node.parent) && !remove.has(node.id)) { remove.add(node.id); changed = true; } }); } nodes = nodes.filter((node) => !remove.has(node.id)); selectedId = 'root'; saveHistory(); render(); updateInspector(); }
function setZoom(next) { zoom = Math.max(0.65, Math.min(1.45, next)); document.getElementById('zoomValue').textContent = `${Math.round(zoom * 100)}%`; render(); }
function centerMap() { pan = { x: mobilePan(), y: 0 }; setZoom(mobileZoom()); }
function exportPng() { const link = document.createElement('a'); link.download = `${mapTitle.value || 'mapa-mental'}.png`; link.href = canvas.toDataURL('image/png'); link.click(); }

canvas.addEventListener('pointerdown', (event) => { const point = screenPoint(event); const node = nodeAt(point); if (node) { selectNode(node); drag = { type: 'node', node, start: point, original: { x: node.x, y: node.y } }; } else { drag = { type: 'pan', start: point, original: { ...pan } }; } canvas.setPointerCapture(event.pointerId); });
canvas.addEventListener('pointermove', (event) => { if (!drag) return; const point = screenPoint(event); const dx = (point.x - drag.start.x); const dy = (point.y - drag.start.y); if (drag.type === 'node') { const worldDelta = { x: dx / zoom, y: dy / zoom }; drag.node.x = drag.original.x + worldDelta.x; drag.node.y = drag.original.y + worldDelta.y; } else { pan.x = drag.original.x + dx; pan.y = drag.original.y + dy; } render(); });
canvas.addEventListener('pointerup', () => { if (drag?.type === 'node') saveHistory(); drag = null; });
canvas.addEventListener('dblclick', (event) => { const node = nodeAt(screenPoint(event)); if (node) { selectNode(node); nodeInput.focus(); nodeInput.select(); } });
canvas.addEventListener('wheel', (event) => { event.preventDefault(); setZoom(zoom + (event.deltaY < 0 ? 0.08 : -0.08)); }, { passive: false });

nodeInput.addEventListener('input', () => { const node = currentNode(); if (!node) return; node.text = nodeInput.value || 'Sem título'; nodeHeading.textContent = node.text; if (node.id === 'root') mapTitle.value = node.text; render(); clearTimeout(window.saveTimer); window.saveTimer = setTimeout(saveHistory, 450); });
mapTitle.addEventListener('input', () => { const root = nodes.find((node) => node.id === 'root'); root.text = mapTitle.value || 'Meu mapa mental'; if (selectedId === 'root') updateInspector(); render(); clearTimeout(window.titleTimer); window.titleTimer = setTimeout(saveHistory, 450); });
document.getElementById('addButton').addEventListener('click', () => addNode('root'));
document.getElementById('childButton').addEventListener('click', () => addNode());
document.getElementById('deleteButton').addEventListener('click', deleteNode);
document.getElementById('zoomIn').addEventListener('click', () => setZoom(zoom + 0.1));
document.getElementById('zoomOut').addEventListener('click', () => setZoom(zoom - 0.1));
document.getElementById('centerButton').addEventListener('click', centerMap);
document.getElementById('exportButton').addEventListener('click', exportPng);
document.getElementById('hideInspector').addEventListener('click', () => document.querySelector('.inspector').classList.toggle('hidden'));
document.getElementById('undoButton').addEventListener('click', () => { if (historyIndex > 0) { historyIndex--; restore(history[historyIndex]); } });
document.getElementById('redoButton').addEventListener('click', () => { if (historyIndex < history.length - 1) { historyIndex++; restore(history[historyIndex]); } });
document.getElementById('newMapButton').addEventListener('click', () => { if (!confirm('Começar um novo mapa?')) return; nodes = [{ id: 'root', text: 'Meu mapa mental', x: 0, y: 0, color: 'coral', size: 'large', parent: null }]; selectedId = 'root'; mapTitle.value = 'Meu mapa mental'; centerMap(); saveHistory(); updateInspector(); });
document.querySelectorAll('.swatch').forEach((button) => button.addEventListener('click', () => { currentNode().color = button.dataset.color; saveHistory(); render(); updateInspector(); }));
document.querySelectorAll('.sizes button').forEach((button) => button.addEventListener('click', () => { currentNode().size = button.dataset.size; saveHistory(); render(); updateInspector(); }));
document.addEventListener('keydown', (event) => { if (event.key === 'Tab') { event.preventDefault(); addNode(); } if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); document.getElementById('undoButton').click(); } });
window.addEventListener('resize', resizeCanvas);

const stored = localStorage.getItem('clareira-canvas-map');
if (stored) { try { nodes = JSON.parse(stored); } catch (error) { localStorage.removeItem('clareira-canvas-map'); } }
mapTitle.value = nodes.find((node) => node.id === 'root')?.text || 'Meu mapa mental';
history = [snapshot()]; historyIndex = 0; resizeCanvas(); updateInspector();
