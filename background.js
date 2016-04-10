var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var element = document.body.appendChild(renderer.domElement);
element.id = "canvas";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

var composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));

var hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
composer.addPass(hblur);

var vblur = new THREE.ShaderPass(THREE.VerticalBlurShader);
vblur.renderToScreen = true;
composer.addPass(vblur);

THREEx.WindowResize(renderer, camera);

var pmat = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0xffffff
});
var pgeo = new THREE.DodecahedronGeometry(2, 1);
var planet = new THREE.Mesh(pgeo, pmat);
scene.add(planet);

var mmat = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0xffffff
});
var mgeo = new THREE.DodecahedronGeometry(1, 1);
var moon = new THREE.Mesh(mgeo, mmat);
moon.position.y = 4;
planet.add(moon);

function render() {
  requestAnimationFrame(render);
  planet.rotation.x += 0.01;
  planet.rotation.z += 0.01;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.05;
  moon.rotation.z += 0.05;
  renderer.render(scene, camera);
  composer.render();
}

render();