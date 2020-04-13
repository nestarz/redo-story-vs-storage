import * as CANNON from "cannon-es";
import CannonDebugRenderer from "./debugger.js";

const diff = (a, b) => new Set([...a].filter((x) => !new Set(b).has(x)));

export default ({ scene, fps, debug = false }) => {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -10, 0),
    broadphase: new CANNON.SAPBroadphase(),
    allowSleep: true,
  });

  world.broadphase.axisIndex = 0;
  world.defaultContactMaterial.contactEquationStiffness = 1e6;
  world.defaultContactMaterial.contactEquationRelaxation = 5;
  world.solver.tolerance = 0.001;
  world.solver.iterations = 5;

  const shape = new CANNON.Plane();
  const body = new CANNON.Body({ mass: 0, shape });
  body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  body.position.y -= 1;

  const cannonDebugRenderer = debug
    ? new CannonDebugRenderer(scene, world)
    : null;

  let currentBodies = [];
  return {
    updateBodies: (bodies) => {
      const toAdd = diff(bodies, currentBodies);
      const toRemove = diff(currentBodies, bodies);
      toAdd.forEach((body) => world.add(body));
      toRemove.forEach((body) => world.remove(body));
      currentBodies = bodies;
    },
    manager: {
      objects: [{ name: "WorldFloor", body }],
      update: () => {
        if (cannonDebugRenderer) cannonDebugRenderer.update();
        world.step(1 / fps);
      },
    },
  };
};
