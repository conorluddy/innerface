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

  private index: number = 0;
  private valuesArray: number[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.updateAttributes();
    this.renderNumbers();
    window.requestAnimationFrame(() => {
      this.setupEventListeners();
    });
  }

  static get observedAttributes() {
    return ["min", "max", "value", "label", "step"];
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
    // Convert the index to the actual number seen in the UI
    this.setAttribute("value", this.valuesArray[this.valueIndex].toString());

    // this.updateScrollPosition();
  }

  get valueIndex(): number {
    return this.valuesArray.findIndex((v) => v === this.value);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === "value") {
        this.value = parseFloat(newValue);
        this.updateScrollPosition();
      } else {
        this.updateAttributes();
        this.renderNumbers();
      }
    }
  }

  private updateScrollPosition() {
    console.log("this.valueIndex", this.valueIndex);

    const container = this.shadowRoot?.querySelector(".number-container");
    if (container) {
      console.log("this.valueIndex * 80", this.valueIndex * 80);
      container.scrollLeft = this.valueIndex * 80;
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
          if (lastKnownScrollPosition % 80 === 0) {
            const selectedIndex = lastKnownScrollPosition / 80;

            console.log(this.valuesArray[selectedIndex - 1]);

            this.value = this.valuesArray[selectedIndex - 1];
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
