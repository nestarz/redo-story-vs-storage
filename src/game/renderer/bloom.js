import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

var params = {
  exposure: 2,
  bloomStrength: 0.9,
  bloomThreshold: 0.7,
  bloomRadius: 0.3,
};

const resize = (camera, renderer) => {
  const canvas = renderer.domElement;
  if (!canvas.parentNode) return;
  const { width, height } = canvas.parentNode.getBoundingClientRect();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

export default async ({ scene, camera }) => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.Uncharted2ToneMapping;

  const renderScene = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    params.bloomStrength,
    params.bloomRadius,
    params.bloomThreshold
  );
  const color = new THREE.Color();
  bloomPass.basic = new THREE.MeshBasicMaterial({ color });

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  return {
    domElement: renderer.domElement,
    manager: {
      resize: () => resize(camera, renderer),
      start: () => {
        resize(camera, renderer);
        let i = 0;
        function animate() {
          i++;
          requestAnimationFrame(animate);
          composer.render();
          color.setHSL(0, 0, Math.min(0.1, i / 5000));
          bloomPass.basic.color = color;
        }
        animate();
      },
    },
  };
};
