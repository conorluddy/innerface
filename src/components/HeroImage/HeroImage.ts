import css from "./HeroImage.styles";

const template = document.createElement("template");

template.innerHTML = `
  <style>${css}</style><slot/>
`;

class HeroImage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

export default () => {
  window.customElements.define("hero-image", HeroImage);
};
