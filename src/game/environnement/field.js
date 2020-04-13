import * as THREE from "three";
import * as CANNON from "cannon-es";

import perlin from "../utils/perlin.js";
import { createGeometryFromCannonShape } from "../utils/cannon-utils.js";

export default () => {
  const K = 1;
  const elementSize = 250 * K;
  const size = new CANNON.Vec3(30 * K, 1900 * K, 30 * K);
  const matrix = Array.from({ length: size.x }, () => new Float32Array(size.z));
  for (let i = 0; i < size.x; i++) {
    for (let j = 0; j < size.z; j++) {
      const height =
        perlin((i / size.x) * 4, (j / size.z) * 4, i / size.x) * size.y;
      matrix[i][j] = height;
    }
  }

  const shape = new CANNON.Heightfield(matrix, {
    elementSize,
  });

  const material = new CANNON.Material("groundMaterial");
  const ground_ground_cm = new CANNON.ContactMaterial(material, material, {
    friction: 0,
    restitution: 0,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3,
  });

  const body = new CANNON.Body({ mass: 0, material, shape });
  body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  body.position.set(
    (-size.x * shape.elementSize) / 2,
    -shape.minValue,
    (size.z * shape.elementSize) / 2
  );

  const geometry = createGeometryFromCannonShape(shape);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: "black" })
  );

  mesh.position.copy(body.position.vadd(new CANNON.Vec3(0, 0.2, 0)));
  mesh.quaternion.copy(body.quaternion);
  mesh.visible = false;

  return {
    manager: {
      objects: [
        { name: "Mountains", body, mesh },
        { contactMaterial: ground_ground_cm },
      ],
      update: (t) => {
        // body.velocity.x += Math.sin(t / 10) * 1;
        // mesh.position.copy(body.position);
      },
    },
  };
};
