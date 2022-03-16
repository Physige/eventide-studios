import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// reload the page if resized
window.onresize = () => {
  location.reload();
};

// how far the camera is away from the origin
const startingZ = 5000;

// speed camera moves with scroll
const speed = .5;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.1, 950);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

// enables camera controls
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(-startingZ);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// main light in hanger
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(-3, -3, -startingZ-50)
pointLight.castShadow = true;
scene.add(pointLight);

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({color:0x4287f5});
// const torus = new THREE.Mesh(geometry, material);
// torus.position.set(-40, 0, -3980)
// scene.add(torus);

// allows gltf models to be loaded
const gltfLoader = new GLTFLoader();

// loads hanger model
gltfLoader.load('models/Hanger.gltf', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.position.set(-50, -4.5, -startingZ)
})

// loads ship model
var ship;
var shipAnimation;
gltfLoader.load('models/Ship.gltf', (gltf) => {
  ship = gltf.scene;
  scene.add(ship);
  ship.position.set(-50, -15,-4930);

  // loads ship's animations
  shipAnimation = new THREE.AnimationMixer(ship);
  var shipClip1 = gltf.animations[0];
  var shipAction1 = shipAnimation.clipAction(shipClip1);
  shipAction1.play();
})

// loads logo model
var logo;
var logoAnimation;
gltfLoader.load('models/Logo.gltf', (gltf) => {
  logo = gltf.scene;
  scene.add(logo);
  logo.position.set(-10, 0, -4040);

  // loads logo animations
  logoAnimation = new THREE.AnimationMixer(logo);
  var logoClip1 = gltf.animations[0];
  var logoAction1 = logoAnimation.clipAction(logoClip1);
  logoAction1.play();
})

// loads space station model
var station;
gltfLoader.load('models/Station.gltf', (gltf) => {
  station = gltf.scene;
  scene.add(station);
  station.position.set(-220, -100, -1900);
})

// extra scene models which i removed cause i felt it made things too cluttered
// var halo;
// gltfLoader.load('models/Halo.gltf', (gltf) => {
//   halo = gltf.scene;
//   scene.add(halo);
//   halo.position.set(500, 0, -3040);
// })

// var fortyk;
// gltfLoader.load('models/40k.gltf', (gltf) => {
//   fortyk = gltf.scene;
//   scene.add(fortyk);
//   fortyk.position.set(400, -200, -startingZ+800);
// })

// const geometry2 = new THREE.BoxGeometry(10, 10, 20);
// const cube = new THREE.Mesh( geometry2, material );
// cube.position.set(-40, -20,-4950);
// scene.add(cube);

// adds grid to scene
//const gridHelper = new THREE.GridHelper(200, 50)
//scene.add(gridHelper);

// creates stars and randomly places them around scene
const starGeometry = new THREE.SphereGeometry(.75, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({color:0xffffff});

function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);

  // generates random cords for stars
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(3000));

  star.position.set(x, y, z - 2500);
  scene.add(star);
}
// creates stars
Array(500).fill().forEach(addStar);

// display gallery functionality
const galleryButton = document.getElementById("galleryButton");
var galleryEnd = -6269; 
var galleryButtonClicked = false;
galleryButton.onclick = () => {
  const galleryViewport = document.getElementById("galleryViewport");
  if (!galleryButtonClicked) {
    // increases gallery div size and makes images visible
    galleryButtonClicked = true;
    galleryButton.innerHTML = "TERMINATE CONNECTION:";

    galleryViewport.style.height = "280vh";
    // changes the position of the end of the gallery depending on if the gallery is being displayed or not
    galleryEnd = -8130;

    const images = document.getElementsByClassName("gallery-image");
    for (var i = 0; i < images.length; i++) {
      images[i].style.opacity = '1';
    }
  } else {
    // shrinks gallery div size and makes images invisible
    galleryButtonClicked = false;
    galleryButton.innerHTML = "INITIALIZE CONNECTION:";

    galleryViewport.style.height = "100vh";
    // changes the position of the end of the gallery depending on if the gallery is being displayed or not
    galleryEnd = -6269;
    
    const images = document.getElementsByClassName("gallery-image");
    for (var i = 0; i < images.length; i++) {
      images[i].style.opacity = '0';
    }
  }
}

document.body.onscroll = scrollAnimation;

// t is distance from top of page for controlling camera and ship movement
var t = document.body.getBoundingClientRect().top;

// win scroll is how much page has scrolled for page scroll progress bar
var winScroll = document.body.scrollTop || document.documentElement.scrollTop;

// total height of document
var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

function scrollAnimation() {
  // updates values
  t = document.body.getBoundingClientRect().top;
  winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

  // controls camera and ship movement with scroll
  camera.position.z = t * -speed - startingZ;
  ship.position.z = t * -speed - (startingZ - 70);

  // updates scroll progress position
  document.getElementById("progressBar").style.height = (winScroll / height) * 100 + "%";

  // changes overlay color and visiblity depending on how much page has scrolled
  const overlay = document.getElementById("overlay");
  const progressBar = document.getElementById("progressBar");
  // if scrolled past the hero page
  if (t < -179) {
    overlay.style.filter = "invert(100%)";
    progressBar.style.filter = "invert(100%)";
    // if scrolled to end of page, disappear
    if (t < galleryEnd - 1582) {
      overlay.style.opacity = '0';
      progressBar.style.opacity = '0';
    } else {
      overlay.style.opacity = '1';
      progressBar.style.opacity = '1';
    }
  } else {
    overlay.style.filter = "invert(0%)";
    progressBar.style.filter = "invert(0%)";
  }

  // controls fade of elements
  // intro/thats no moon elements
  const introTitle = document.getElementById("introTitle");
  const introSubtitle = document.getElementById("introSubtitle");
  const introBody = document.getElementById("introBody");

  // meet the crew/team page
  const teamPage = document.getElementById("teamPage");
  const teamTitle = document.getElementById("teamTitle");
  const leftLine = document.getElementById("leftLine");
  
  // if scrolled to team page
  if (t < -3446 && t > -4482) {
    teamPage.style.opacity = '1';
    teamTitle.style.opacity = '1';
    overlay.style.opacity = '0';
    progressBar.style.opacity = '0';
    leftLine.style.left = '-1%'
  } else {
    teamPage.style.opacity = '0';
    teamTitle.style.opacity = '0';

    // if not on the team page and is scrolled to intro/moon/logo page
    if (t < -1380 && t > -2000) {
      introTitle.style.opacity = '1';
      introSubtitle.style.opacity = '1';
      introBody.style.opacity = '1';
    } else {
      introTitle.style.opacity = '0';
      introSubtitle.style.opacity = '0';
      introBody.style.opacity = '0';
    }
    leftLine.style.left = '-11%'
  }

  // controls gallery fade
  const galleryTitle = document.getElementById("galleryTitle");
  const galleryText = document.getElementById("galleryText");
  const galleryButton = document.getElementById("galleryButton");
  const galleryImages = document.getElementsByClassName("gallery-image");
  // if scrolled to the gallery page
  if (t < -5334 && t > galleryEnd) {
    galleryTitle.style.opacity = '1';
    galleryText.style.opacity = '1';
    galleryButton.style.opacity = '1';
    
    // display gallery images if the button had been clicked
    if (galleryButtonClicked) {
      for (var i = 0; i < galleryImages.length; i++) {
        galleryImages[i].style.opacity = '1';
      }
    }
  } else {
    galleryTitle.style.opacity = '0';
    galleryText.style.opacity = '0';
    galleryButton.style.opacity = '0';

    // hides gallery images if the button had been clicked and scrolled past gallery page
    if (galleryButtonClicked) {
      for (var i = 0; i < galleryImages.length; i++) {
        galleryImages[i].style.opacity = '0';
      }
    }
  }

  // points where ship strafes
  if (t < -250 && t > -1923) {
    ship.position.x = t * -0.025 - 56.25;
  }
  
  if (t < -2576 && t > -3840) {
    
    ship.position.x = t * 0.04 + 94.84;
  }

  if (t < -4173 && t > -5330) {
    
    ship.position.x = t * -0.04 - 225.64;
  }
}

// adds time for animations to play
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // updates animation frames
  var dt = clock.getDelta()

  shipAnimation.update(dt);
  logoAnimation.update(dt);

  // rotates the space station on every animation frame
  station.rotation.y += 0.0002;

  // allows camera controls to be updated and display
  controls.update();

  // updates frames
  renderer.render(scene, camera);
}

// starts animation loop
animate();