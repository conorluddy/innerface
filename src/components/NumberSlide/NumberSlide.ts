import css from "./NumberSlide.css?raw";

const template = document.createElement("template");

const UNIT_SIZE = 80;

template.innerHTML = `
  <style>${css}</style>
  <label><span>KG</span></label>
  <div class="number-container"></div>
`;

class NumberSlideClass extends HTMLElement {
  private label: string = "Number";
  private step: number = 1;
  private min: number = 1;
  private max: number = 10;
  private index: number = 0;
  private valuesArray: number[] = [];
  private initialValue: number | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["min", "max", "value", "label", "step"];
  }

  connectedCallback() {
    this.updateAttributes();
    this.renderNumbers();
    window.requestAnimationFrame(() => {
      this.setupEventListeners();
      this.updateScrollPosition(this.initialValue);
    });
  }

  get value(): number {
    // We have two things to track here - the index of the selected value
    // is what lets us position the slider in the correct place, but the
    // current value will only match the index if we have a min of 0 and
    // a step of 1 - so we need to interface between the two scales.
    // Incoming value needs to set the index, but the value needs to be
    // whatever the index * step value is so that it can be used externally.
    return this.valuesArray[this.index];
  }

  set value(newValue: number) {
    // Invalid:: Return early
    if (newValue < this.min || newValue > this.max) return;

    // const oldValue = this.value;
    // if (newValue === oldValue) return;

    // Convert the index to the actual number seen in the UI
    this.setAttribute("value", this.valuesArray[this.valueIndex].toString());

    const event = new CustomEvent("value-changed", {
      detail: { newValue },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  get valueIndex(): number {
    return this.valuesArray.findIndex((v) => v === this.value);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === "value") {
        // Store the first value coming from the HTML
        if (this.initialValue === null) {
          this.initialValue = parseFloat(newValue);
        }
        this.value = parseFloat(newValue);
      } else {
        this.updateAttributes();
        this.renderNumbers();
      }
    }
  }

  private updateScrollPosition(value: number | null) {
    const container = this.shadowRoot?.querySelector(
      ".number-container .inner"
    );
    if (container && value !== null) {
      const index = this.valuesArray.findIndex((v) => v === value);
      container.scrollLeft = index * UNIT_SIZE;
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
        this.valuesArray.push(i);
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
          if (lastKnownScrollPosition % UNIT_SIZE === 0) {
            const selectedIndex = lastKnownScrollPosition / UNIT_SIZE - 1;
            this.index = selectedIndex;
            this.value = this.valuesArray[selectedIndex];
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
  window.customElements.define("number-slide", NumberSlideClass);
};

export type NumberSlide = typeof NumberSlideClass &
  Element & { detail: { newValue: number }; value: number };
