import * as THREE from "three";
import * as CANNON from "cannon-es";

import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

import { computeBodyFromMesh } from "../physics/computeBody.js";
import InputControls from "./input.js";

import { directionMesh } from "../utils/debug.js";

const safeHack = new CANNON.Vec3(0, 1, 0);
const vToGround = new CANNON.Vec3(0, -1, 0);

const temp0 = new THREE.Vector3();
const isGrounded = (groundMesh, body, direction = vToGround) => {
  const raycaster = new THREE.Raycaster(
    temp0.copy(body.position.vadd(safeHack)),
    direction,
    0,
    +Infinity
  );
  const intersects = raycaster.intersectObjects([groundMesh]);
  return intersects && intersects[0];
};

export const Player = async () => {
  const speed = new CANNON.Vec3(340, 340, 280);
  const controls = InputControls();

  const path = "assets/models/girl/girl.stl";
  const geometry = await new Promise((r) => new STLLoader().load(path, r));
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(1, 520, 1);
  mesh.scale.set(22, 22, 22);

  const body = computeBodyFromMesh(mesh, CANNON.Sphere, {
    fixedRotation: false,
    mass: 50,
    material: new CANNON.Material({
      friction: 0,
      restitution: 0,
    }),
  });

  let ground = null;
  let direction2;
  body.addEventListener("collide", ({ contact }) => {
    direction2 = new THREE.Vector3()
      .copy(body.position.vadd(safeHack))
      .applyQuaternion(new THREE.Quaternion().copy(body.quaternion))
      .normalize()
      .cross(contact.ni)
      .multiplyScalar(-1);

    const { bi, bj } = contact;
    if (!ground) {
      const ray = new CANNON.Ray(body.position.vadd(safeHack), vToGround);
      const result1 = new CANNON.RaycastResult();
      const result2 = new CANNON.RaycastResult();
      ray.intersectBody(bi, result1);
      ray.intersectBody(bj, result2);
      if (result1.hasHit || result2.hasHit) {
        ground = bi === body ? bj : bi;
      }
    }
  });

  const spherical = new THREE.Spherical();
  const direction = new THREE.Vector3();
  const prevPosition = new CANNON.Vec3();

  let line = new THREE.Mesh();
  return {
    get position() {
      return new THREE.Vector3().copy(body.position);
    },
    get spherical() {
      return spherical;
    },
    inUserMovement: () => controls.rotation.x || controls.direction.length(),
    manager: {
      objects: [
        { name: "Player", mesh, body },
        { name: "Debug", mesh: line },
      ],
      DOMEvents: {
        keydown: (e) => controls.trigger(e.code),
        keyup: (e) => controls.release(e.code),
        blur: () => controls.reset(),
        focus: () => controls.reset(),
      },
      update: () => {
        if (ground && direction2 && controls.direction.length()) {
          // Move Player relatively to his facing direction and his state
          const direction = controls
            .fromTransformMatrix(body.position, body.quaternion)
            .clone()
            .multiply(speed)
            .multiplyScalar(ground ? 1 : 0.5);

          console.log(body.velocity);
        }

        if (direction2) {
          line.children = [directionMesh(body.position, direction2, 1000)];

          body.velocity.set(
            direction2.x * 300,
            Math.min(direction2.y, body.velocity.y),
            direction2.z * 300
          );
        }

        // Rotate Player based on Input State
        if (controls.rotation.length()) {
          const quaternion = new CANNON.Quaternion();
          quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            -controls.rotation.x * 0.1
          );
          body.quaternion = body.quaternion.mult(quaternion);
        }

        // Match visual with physics
        prevPosition.copy(body.position);
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);

        // Update Player Spherical from Mesh Direction
        mesh.getWorldDirection(direction).multiplyScalar(-1);
        spherical.setFromVector3(direction);
      },
    },
  };
};
