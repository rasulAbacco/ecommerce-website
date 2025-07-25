import * as THREE from '../libs/three.module.js';
import { GLTFLoader } from '../libs/GLTFLoader.js';

const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 2;
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

// Load product model
const loader = new GLTFLoader();
loader.load('../assets/product.glb', gltf => {
    const model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);

    // Animate on scroll (linked with GSAP/ScrollTrigger later)
    gsap.to(model.rotation, {
        y: Math.PI * 2,
        scrollTrigger: {
            trigger: ".product-info",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    });
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
