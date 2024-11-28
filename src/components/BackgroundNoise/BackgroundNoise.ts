import css from "./BackgroundNoise.css?raw";

const template = document.createElement("template");

template.innerHTML = `
  <style>${css}</style>
  <slot />
`;

class BackgroundNoise extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }
}

export default () => {
  window.customElements.define("background-noise", BackgroundNoise);
};
