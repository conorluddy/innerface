import css from "./NumberSlide.css?raw";

const template = document.createElement("template");

template.innerHTML = `
  <style>${css}</style>
  <div class="number-container"></div>
`;

class NumberSlide extends HTMLElement {
  private min: number = 0;
  private max: number = 10;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.updateMinMax();
    this.renderNumbers();
  }

  static get observedAttributes() {
    return ["min", "max"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log({ name });
    if (oldValue !== newValue) {
      this.updateMinMax();
      this.renderNumbers();
    }
  }

  private updateMinMax() {
    this.min = parseInt(this.getAttribute("min") || "0", 10);
    this.max = parseInt(this.getAttribute("max") || "9", 10);
  }

  private renderNumbers() {
    const container = this.shadowRoot?.querySelector(".number-container");
    const innerElement = document.createElement("div");
    const innerSpacerLeft = document.createElement("div");
    const innerSpacerRight = document.createElement("div");
    innerElement.classList.add("inner");
    if (container) {
      container.innerHTML = "";
      container.appendChild(innerElement);
      innerElement.appendChild(innerSpacerLeft);
      innerSpacerLeft.classList.add("spacer");
      for (let i = this.min; i <= this.max; i++) {
        const numberElement = document.createElement("div");
        numberElement.textContent = i.toString();
        numberElement.classList.add("number-item");
        numberElement.addEventListener("click", () => this.onNumberClick(i));
        innerElement.appendChild(numberElement);
      }
      innerElement.appendChild(innerSpacerRight);
      innerSpacerRight.classList.add("spacer");
    }
  }

  private onNumberClick(number: number) {
    const event = new CustomEvent("number-selected", {
      detail: number,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

export default () => {
  window.customElements.define("number-slide", NumberSlide);
};
