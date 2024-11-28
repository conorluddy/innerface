import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";
import webComponents from "./components";

webComponents();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <background-noise /> 
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
