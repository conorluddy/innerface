import "./style.css";
import viteLogo from "/vite.svg";
import webComponents from "./components";

webComponents();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <background-noise></background-noise> 
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
  </div>
`;
