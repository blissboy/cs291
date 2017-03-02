"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Drinking Bird Model exercise                                               //
// Your task is to complete the model for the drinking bird                   //
// Please work from the formal blueprint dimensions and positions shown at    //
// https://www.udacity.com/wiki/cs291/notes                                   //
//                                                                            //
// The following materials should be used:                                    //
// Hat and spine: cylinderMaterial (blue)                                     //
// Head and bottom body: sphereMaterial (red)                                 //
// Rest of body: cubeMaterial (orange)                                        //
//                                                                            //
// So that the exercise passes, and the spheres and cylinders look good,      //
// all SphereGeometry calls should be of the form:                            //
//     SphereGeometry( radius, 32, 16 );                                      //
// and CylinderGeometry calls should be of the form:                          //
//     CylinderGeometry( radiusTop, radiusBottom, height, 32 );               //
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, $, document, window, dat*/

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = true;

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	var devicePixelRatio = window.devicePixelRatio || 1; // Evaluates to 2 if Retina
	renderer.setSize(canvasWidth / devicePixelRatio, canvasHeight / devicePixelRatio);
	renderer.setClearColorHex(0xAAAAAA, 1.0);

	// CAMERA
	camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 40000);
	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);

	camera.position.set(-480, 659, -619);
	cameraControls.target.set(4, 301, 92);

	fillScene();
}

// bird definition 
const body_length = 390;
const body_elevation = 160;
const bulb_diameter = 116;
const brim_diameter = 142;
const brim_thickness = 10;
const hat_diameter = 80;
const hat_height = 70;
const head_diameter = 104;
var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xA00000 });
var cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0x0000D0 });



// Supporting frame for the bird - base + legs + feet
function createSupport() {

	const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xF07020 });
	// base
	let base = new THREE.Mesh(
		new THREE.CubeGeometry(20 + 64 + 110, 4, 2 * 77), cubeMaterial);
	base.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	base.position.y = 4 / 2;	// half of height
	base.position.z = 0;	// centered at origin
	scene.add(base);

	// left foot
	let foot = new THREE.CubeGeometry(20 + 64 + 110, 52, 6);
	let leftFoot = new THREE.Mesh(foot, cubeMaterial);
	leftFoot.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	leftFoot.position.y = 52 / 2;	// half of height
	leftFoot.position.z = 77 + 6 / 2;	// offset 77 + half of depth 6/2
	scene.add(leftFoot);

	// left leg
	let leg = new THREE.CubeGeometry(64, 334 + 52, 6);
	let leftLeg = new THREE.Mesh(leg, cubeMaterial);
	leftLeg.position.x = 0;	// centered on origin along X
	leftLeg.position.y = (334 + 52) / 2;
	leftLeg.position.z = 77 + 6 / 2;	// offset 77 + half of depth 6/2
	scene.add(leftLeg);

	// right foot
	let rightFoot = new THREE.Mesh(foot, cubeMaterial);
	rightFoot.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	rightFoot.position.y = 52 / 2;	// half of height
	rightFoot.position.z = -1 * (77 + 6 / 2);	// offset 77 + half of depth 6/2
	scene.add(rightFoot);

	// right leg
	let rightLeg = new THREE.Mesh(leg, cubeMaterial);
	rightLeg.position.x = 0;	// centered on origin along X
	rightLeg.position.y = (334 + 52) / 2;
	rightLeg.position.z = -1 * (77 + 6 / 2);	// offset 77 + half of depth 6/2
	scene.add(rightLeg);

}

// Body of the bird - body and the connector of body and head
function createBody() {

	// body
	let body = new THREE.Mesh(
		new THREE.CylinderGeometry(24, 24, body_length, 32), cylinderMaterial);
	body.position.x = 0;
	body.position.y = body_length / 2 + body_elevation;	// half of height
	body.position.z = 0;
	scene.add(body);

	// bulb
	let bulb = new THREE.Mesh(
		new THREE.SphereGeometry(bulb_diameter / 2, 32, 16), sphereMaterial);
	bulb.position.x = 0;
	bulb.position.y = body_elevation;	// half of height
	bulb.position.z = 0;
	scene.add(bulb);

}

// Head of the bird - head + hat
function createHead() {
	// head
	let head = new THREE.Mesh(
		new THREE.SphereGeometry(head_diameter / 2, 32, 16), sphereMaterial);
	head.position.x = 0;
	head.position.y = body_length + body_elevation;
	head.position.z = 0;
	scene.add(head);

	// hat brim
	let brim = new THREE.Mesh(
		new THREE.CylinderGeometry(brim_diameter / 2, brim_diameter / 2, brim_thickness, 32), cylinderMaterial);
	brim.position.x = 0;
	brim.position.y = body_length + body_elevation + 40 + brim_thickness / 2;
	brim.position.z = 0;
	scene.add(brim);

	// hat 
	let hat = new THREE.Mesh(
		new THREE.CylinderGeometry(hat_diameter / 2, hat_diameter / 2, hat_height, 32), cylinderMaterial);
	hat.position.x = 0;
	hat.position.y = body_length + body_elevation + 40 + brim_thickness + hat_height / 2;
	hat.position.z = 0;
	scene.add(hat);

}

function createDrinkingBird() {

	// MODELS
	// base + legs + feet
	createSupport();

	// body + body/head connector
	createBody();

	// head + hat
	createHead();
}

function fillScene() {
	// SCENE
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x808080, 3000, 6000);
	// LIGHTS
	var ambientLight = new THREE.AmbientLight(0x222222);
	var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
	light.position.set(200, 400, 500);

	var light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
	light2.position.set(-400, 200, -300);

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	if (ground) {
		Coordinates.drawGround({ size: 1000 });
	}
	if (gridX) {
		Coordinates.drawGrid({ size: 1000, scale: 0.01 });
	}
	if (gridY) {
		Coordinates.drawGrid({ size: 1000, scale: 0.01, orientation: "y" });
	}
	if (gridZ) {
		Coordinates.drawGrid({ size: 1000, scale: 0.01, orientation: "z" });
	}
	if (axes) {
		Coordinates.drawAllAxes({ axisLength: 300, axisRadius: 2, axisTess: 50 });
	}
	createDrinkingBird();
}
//
function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length > 0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild(renderer.domElement);
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	if (effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes) {
		gridX = effectController.newGridX;
		gridY = effectController.newGridY;
		gridZ = effectController.newGridZ;
		ground = effectController.newGround;
		axes = effectController.newAxes;

		fillScene();
	}
	renderer.render(scene, camera);
}

function setupGui() {

	effectController = {

		newGridX: gridX,
		newGridY: gridY,
		newGridZ: gridZ,
		newGround: ground,
		newAxes: axes
	};

	var gui = new dat.GUI();
	gui.add(effectController, "newGridX").name("Show XZ grid");
	gui.add(effectController, "newGridY").name("Show YZ grid");
	gui.add(effectController, "newGridZ").name("Show XY grid");
	gui.add(effectController, "newGround").name("Show ground");
	gui.add(effectController, "newAxes").name("Show axes");
}

try {
	init();
	setupGui();
	addToDOM();
	animate();
} catch (e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport + e);
}
