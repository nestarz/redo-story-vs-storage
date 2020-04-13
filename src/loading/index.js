import EventListener from "utils/event.js";

const id = "loading";
Object.assign(document.head.appendChild(document.createElement("style")), {
  innerHTML: `
    #${id} {
      width: 100%;
      height: 100%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
});

export default async () => {
  const container = Object.assign(document.createElement("div"), { id });
  const content = Object.assign(document.createElement("div"), { innerText: "Loading..." });
  const eventListener = EventListener();

  container.appendChild(content);
  return {
    attach: (parent) => parent.appendChild(container),
    start: () => {
      content.innerText = "Press Any Button"
      container.addEventListener("click", () => eventListener.emit());
      container.addEventListener("keydown", () => eventListener.emit());
      setTimeout(eventListener.emit, 1500);
      return new Promise((resolve) => eventListener.on(resolve));
    },
    remove: () => container.remove(),
  };
};
