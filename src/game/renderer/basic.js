import * as THREE from "three";

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
  renderer.setPixelRatio(window.devicePixelRatio / 1);

  return {
    domElement: renderer.domElement,
    manager: {
      resize: () => resize(camera, renderer),
      start: () => {
        resize(camera, renderer);
        function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }
        animate();
      },
    },
  };
};
