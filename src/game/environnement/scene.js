import * as THREE from "three";

const diff = (a, b) => new Set([...a].filter((x) => !new Set(b).has(x)));

export default () => {
  const scene = new THREE.Scene();

  scene.background = new THREE.Color( "grey" );
  const color = "grey";
  const density = 0.001;
  scene.fog = new THREE.FogExp2(color, density);

  let currentObjects = [];
  return {
    scene,
    updateObjects: (objects) => {
      const toAdd = diff(objects, currentObjects);
      const toRemove = diff(currentObjects, objects);
      toAdd.forEach((object) => scene.add(object));
      toRemove.forEach((object) => scene.remove(object));
      currentObjects = objects;
      //console.clear();
      //currentObjects.map(object => object.__group__name === "DebugLine" && console.log(object.geometry));
    },
    manager: {}
  };
};
