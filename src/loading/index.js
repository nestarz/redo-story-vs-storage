import EventListener from "utils/event.js";

const id = "loading";
Object.assign(document.head.appendChild(document.createElement("style")), {
  innerHTML: `
    #${id} {
      width: 100%;
      height: 100%;
      cursor: pointer;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      padding: 1rem;
    }

    #note {
      display: block;
      color: grey;
    }

    #note a {
      color: #b5b5b5;
    }
  `,
});

const interval = (fn, t) => {
  let i = 0;
  fn(0);
  return setInterval(() => fn(++i), t);
};

export default async () => {
  const container = Object.assign(document.createElement("div"), { id });
  const content = Object.assign(document.createElement("div"), {
    innerText: "Loading...",
  });
  let loadingString = "Loading";
  const ids = [
    interval((t) => {
      content.innerHTML =
        loadingString
          .split("")
          // .map((l, i) => (i === t % 7 ? `<em>${l}</em>` : l))
          .join("") + ".".repeat((t % 4) + 1);
    }, 1000),
  ];
  const note = Object.assign(document.createElement("div"), {
    id: "note",
    innerHTML: `
      <i>Recall</i> is a city of the mind, where buildings are memories. They are
      massive and moving at such a speed that soon, it is said, light itself
      will not escape its gravitational pull. Akin to
      <a href="http://www.paulbushfilms.com/babeldom.html">Babeldom</a>, this
      experience portrait a city and the journey of a conflicted self rambling
      around foreign memories. How can another human experience my first
      encounter with foreign memories ? How can we represent the reflective
      mind, thoughts, when one have to deal with foreign images of memories.
      Recall, empathy, mirror neuron, echolalia.... cognitive science have been
      studying on how memories are created and controlled such that we are able
      to remember the past. See
      <a
        href="https://www.researchgate.net/publication/265212392_Empathy_and_Autobiographical_Memory_Are_They_Linked"
        >Empathy and Autobiographical Memory: Are They Linked?
      </a>
      <p>This work is done using web technologies. Are used, Cannon as the physics engine and WebGL and THREE.js for the rendering system.
      The source code is <a href="https://github.com/nestarz/redo-story-vs-storage">publicly available</a> and hosted on Git.</p>

      <p>Thought to be played online, this work use the screen as a virtual space. 
      Each visit is a new run with new images and a different path is taken. Refresh the page for a new journey...</p>
    `,
  });

  const eventListener = EventListener();

  container.appendChild(content);
  container.appendChild(note);
  return {
    attach: (parent) => parent.appendChild(container),
    start: () => {
      ids.forEach(window.clearInterval);
      content.innerText = "Press Any Button";
      container.addEventListener("click", () => eventListener.emit());
      container.addEventListener("keydown", () => eventListener.emit());
      // setTimeout(eventListener.emit, 1500);
      return new Promise((resolve) => eventListener.on(resolve));
    },
    remove: () => {
      container.remove();
    },
  };
};
