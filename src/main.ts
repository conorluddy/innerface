import "./style.css";
import webComponents from "./components";
import { NumberSlide } from "./components/NumberSlide/NumberSlide";

webComponents();

const numberSlides = document.querySelectorAll("number-slide");

// const summary = document.querySelector(".summary");
const kgs = document.querySelector(".kgs");
const reps = document.querySelector(".reps");
const total = document.querySelector(".total");

const kgsSlide = numberSlides[0] as NumberSlide;
const repSlide = numberSlides[1] as NumberSlide;

kgsSlide?.addEventListener("value-changed", () => {
  if (kgs) kgs.innerHTML = `<span>${kgsSlide.value}</span> <span>KG</span>`;
  updateTotal();
});

repSlide?.addEventListener("value-changed", () => {
  if (reps) reps.innerHTML = `<span>${repSlide.value}</span> <span>REPS</span>`;
  updateTotal();
});

const updateTotal = () => {
  if (total)
    total.innerHTML = `<span>${
      kgsSlide.value * repSlide.value
    }</span> <span>Total KG</span>`;
};
