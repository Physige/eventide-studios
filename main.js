import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.onresize = () => {
  location.reload();
};

const startingZ = 5000;
const speed = .5;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(-startingZ);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color:0x4287f5});
const torus = new THREE.Mesh(geometry, material);
torus.position.set(-40, 0, -3980)
scene.add(torus);

const geometry2 = new THREE.BoxGeometry(10, 10, 20);
const cube = new THREE.Mesh( geometry2, material );
cube.position.set(-40, -20,-4950);
scene.add(cube);

// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(5, 5, 500)
// scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

//const gridHelper = new THREE.GridHelper(200, 50)
//scene.add(gridHelper);
const starGeometry = new THREE.SphereGeometry(.75, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({color:0xffffff});

function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(3000));

  star.position.set(x, y, z - 2500);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

const galleryButton = document.getElementById("gallery-button");
var galleryButtonClicked = false;
galleryButton.onclick = () => {
  
  if (!galleryButtonClicked) {
    galleryButtonClicked = true;
    galleryButton.innerHTML = "TERMINATE CONNECTION:";
    const images = document.getElementsByClassName("gallery-image");
    for (var i = 0; i < images.length; i++) {
      images[i].style.opacity = '1';
    }
  } else {
    galleryButtonClicked = false;
    galleryButton.innerHTML = "INITIALIZE CONNECTION:";
    const images = document.getElementsByClassName("gallery-image");
    for (var i = 0; i < images.length; i++) {
      images[i].style.opacity = '0';
    }
  }
}
function scrollAnimation() {
  const t = document.body.getBoundingClientRect().top;
  console.log(t);
  camera.position.z = t * -speed - startingZ;
  
  cube.position.z = t * -speed - 4950;

  if (t < -1380) {
    // const square1 = document.getElementById("square1");
    // const square2 = document.getElementById("square2");
    // const square3 = document.getElementById("square3");
    
    // square1.style.opacity = '1';
    // square2.style.opacity = '1';
    // square3.style.opacity = '1';
    //const collection = document.getElementsByClassName("square");
    
    // for (var i = 0; i < collection.length; i++) {
    //   collection[i].style.opacity = '1';
    // }
  }

  if (t < -250 && t > -1923) {
    cube.position.x = t * -0.04 - 40
  }
  
  if (t < -2576 && t > -3840) {
    
    cube.position.x = t * 0.04 + 140
  }

  if (t < -2464) {
    // const left = document.getElementById("left-bar");
    // const right = document.getElementById("right-bar");

    // left.style.left = '-1%'
    // right.style.right = '0'
  }

  if (t < -4173 && t > -5000) {
    
    cube.position.x = t * -0.04 - 180
  }
  //console.log(cube.position.x);
}

document.body.onscroll = scrollAnimation;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();