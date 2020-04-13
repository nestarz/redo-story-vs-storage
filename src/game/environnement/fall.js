import * as THREE from "three";
import * as CANNON from "cannon-es";

import { computeBodyFromMesh } from "../physics/computeBody.js";

import getImages from "utils/martina.js";

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async () => {
  const N = 240;
  const myGeom = new THREE.BoxGeometry(300, 300, 300);
  const objects = [];

  const images = shuffle(await getImages());

  const random = () => 5000 - Math.random() * 10000;
  for (let i = 0; i < N; i++) {
    const myMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(images[i % images.length]),
    });
    const mesh = new THREE.Mesh(myGeom, myMaterial);
    mesh.position.set(random(), 400 + Math.random() * 1000, random());

    const body = computeBodyFromMesh(mesh, CANNON.Sphere, {
      fixedRotation: false,
      mass: 0,
      position: mesh.position,
      material: new CANNON.Material({
        friction: 100,
        restitution: 100,
      }),
    });

    objects.push({ name: "Fall" + i, mesh, body });
  }

  return {
    manager: {
      objects,
      update: (t) => {
        for (let i = 0; i < objects.length; i++) {
          const { mesh, body } = objects[i];
          // body.velocity.x += 10 - Math.random() * 20;
          mesh.position.copy(body.position);
          mesh.quaternion.copy(body.quaternion);
          mesh.rotation.y = i + Math.sin(t / 1000);
        }
      },
    },
  };
};
