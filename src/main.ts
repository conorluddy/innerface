import "./style.css";
import webComponents from "./components";

webComponents();

const numberSlide = document.querySelector("number-slide");

numberSlide?.addEventListener("number-selected", (event) => {
  console.log("Selected number:", event);
});
