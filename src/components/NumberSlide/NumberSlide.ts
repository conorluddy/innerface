import css from "./NumberSlide.css?raw";

const template = document.createElement("template");

template.innerHTML = `
  <style>${css}</style>
  <label><span>KG</span></label>
  <div class="number-container"></div>
`;

class NumberSlide extends HTMLElement {
  private label: string = "Number";
  private min: number = 1;
  private max: number = 10;
  private step: number = 1;
  private _value: number = 1;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }

  get value(): number {
    return this._value;
  }

  set value(newValue: number) {
    if (newValue >= this.min && newValue <= this.max) {
      this._value = newValue;
      this.setAttribute("value", newValue.toString());
      this.updateScrollPosition();
      this.dispatchEvent(new Event("change"));
    }
  }

  connectedCallback() {
    this.updateAttributes();
    this.renderNumbers();
  }

  static get observedAttributes() {
    return ["min", "max", "value", "label", "step"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === "value") {
        this.value = parseInt(newValue, 10);
      } else {
        this.updateAttributes();
        this.renderNumbers();
      }
      this.setupEventListeners();
    }
  }

  private updateScrollPosition() {
    const container = this.shadowRoot?.querySelector(".number-container");
    if (container) {
      container.scrollLeft = (this._value - this.min) * 80;
    }
  }

  private updateAttributes() {
    this.min = parseFloat(this.getAttribute("min") || "1");
    this.max = parseFloat(this.getAttribute("max") || "5");
    this.step = parseFloat(this.getAttribute("step") || "1");
    this.label = this.getAttribute("label") || "Number";
  }

  private renderNumbers() {
    const container = this.shadowRoot?.querySelector(".number-container");
    const innerElement = document.createElement("div");
    const innerSpacerLeft = document.createElement("div");
    const innerSpacerRight = document.createElement("div");
    const selectionBox = document.createElement("div");
    const label = this.shadowRoot?.querySelector("label span");

    innerElement.classList.add("inner");

    if (container && label) {
      label.innerHTML = this.label;
      container.innerHTML = "";
      container.appendChild(innerElement);

      innerElement.appendChild(innerSpacerLeft);
      innerSpacerLeft.classList.add("spacer");

      for (let i = this.min; i <= this.max; i += this.step) {
        const numberElement = document.createElement("div");
        numberElement.textContent = i.toString();
        numberElement.classList.add("number-item");
        innerElement.appendChild(numberElement);
      }

      innerElement.appendChild(innerSpacerRight);
      innerSpacerRight.classList.add("spacer");

      container.appendChild(selectionBox);
      selectionBox.classList.add("selection-box");

      for (let i = 0; i < 4; i++) {
        const boxCorner = document.createElement("div");
        boxCorner.classList.add("corner");
        selectionBox.appendChild(boxCorner);
      }
    }
  }

  private setupEventListeners() {
    let lastKnownScrollPosition = 0;
    let ticking = false;

    const scrollContainer = this.shadowRoot?.querySelector(".number-container");
    const inner = this.shadowRoot?.querySelector(".number-container .inner");

    if (!scrollContainer || !inner) return;

    const handleScroll = (event: Event) => {
      lastKnownScrollPosition = (event.target as Element).scrollLeft + 40;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (lastKnownScrollPosition % 80 === 0) {
            this.value = lastKnownScrollPosition / 80;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Try attaching the event listener to both elements
    scrollContainer.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });
  }
}

export default () => {
  window.customElements.define("number-slide", NumberSlide);
};
