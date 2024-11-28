import css from "./GridBase.styles";

const template = document.createElement("template");

template.innerHTML = `
  <style>${css}</style>
  <main>
    <slot/>
  </main>
`;

class GridBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

export default () => {
  window.customElements.define("grid-base", GridBase);
};
