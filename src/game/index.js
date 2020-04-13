import * as THREE from "three";

import World from "./physics/world.js";
import Scene from "./environnement/scene.js";
import Field from "./environnement/field.js";
import Lights from "./environnement/lights.js";
import Fall from "./environnement/fall.js";
import BloomRenderer from "./renderer/bloom.js";
// import BasicRenderer from "./renderer/basic.js";
import { Player } from "./player/player.js";
import { TPSCameraControl } from "./camera/tps.js";

import Group from "./utils/group.js";

const FPS = 50;
const FOV = 45;

export default async () => {
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 6000);

  const scene = await Scene();
  // const renderer = await BasicRenderer({ scene: scene.scene, camera });
  const renderer = await BloomRenderer({ scene: scene.scene, camera });
  const control = await TPSCameraControl({ camera });
  const world = await World({ scene: scene.scene, fps: FPS, debug: false });
  const lights = await Lights();
  const field = await Field();
  const fall = await Fall();
  const player = await Player();
  const group = Group({
    renderer,
    scene,
    world,
    lights,
    control,
    player,
    field,
    fall,
  });

  const offset = new THREE.Vector3(0, 15, 0);
  let parent;
  const texts = [
    "Put your headphones and...",
    "Use your mouse to watch around...",
    "While my mind is trying to remember...",
    "Here inside...",
    "Somewhere in my mind...",
    "my mind...",
    "So much light...",
    "Why do they attract me ?",
    "I want the same",
    "Is it my ideal ?",
    "Why it seems so far ?",
    "Some of their memories...",
    "None of my memories...",
    "it's night...",
    "I sometime lose myself into one of them... for it seems forever...",
    "Or I just escape, where nothing is like this...",
    "There is a link, I should keep trying",
    "I should keep trying",
    "keep trying",
    "trying",
  ];
  return {
    start: () => {
      let t = 0;
      group.start();
      setTimeout(function update() {
        group.update(t++);

        scene.updateObjects(group.objects);
        world.updateBodies(group.bodies);

        control.setCollideObjects(group.objects);
        control.setTarget(player.position.add(offset));

        if (player.inUserMovement()) {
          control.setAzimuthIfNotDragging(player.spherical.theta);
        }

        setTimeout(update, 1000 / FPS);
      }, 1000 / FPS);

      let i = 0;
      const random = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      setInterval(() => {
        const span = parent.appendChild(
          Object.assign(document.createElement("div"), {
            innerText: texts[i % texts.length],
          })
        );

        Object.assign(span.style, {
          position: "fixed",
          top: `calc(${random(10, 90)}% - 1rem)`,
          left: `calc(${random(10, 90)}% - 1rem)`,
          filter: "blur(1px)",
          padding: "1rem",
          mixBlendMode: "exclusion",
          pointerEvents: "none",
        });

        setTimeout(() => span.remove(), 7000);
        i++;
      }, 5000);
    },
    attach: async (element, listener = element) => {
      parent = element;
      element.appendChild(renderer.domElement);

      const audio = await new Promise(function (resolve, reject) {
        const audio = Object.assign(document.createElement("audio"), {
          src:
            Math.random() > 0.6
              ? "assets/sounds/sigh-of-relief.mp3"
              : "assets/sounds/searching-the-past.mp3",
          autoplay: true,
          loop: true,
          onerror: reject,
          oncanplaythrough: () => resolve(audio),
          preload: "auto",
        });
      });
      Object.assign(audio.style, { position: "absolute" });
      element.appendChild(audio);
      element.addEventListener("click", () => {
        if (audio.paused) audio.play();
      });

      if (window.ResizeObserver)
        new window.ResizeObserver(group.resize).observe(element);
      else window.addEventListener("resize", group.resize);

      console.log("ok")
      group.events.forEach((type) =>
        listener.addEventListener(type, group.eventsCallbacks(type), true)
      );
    },
  };
};
