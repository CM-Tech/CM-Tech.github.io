import "zenscroll";
import { regl } from "./canvas";
import * as config from "./config";
import { fullscreen, update, display, createSplat, getBreakpoint } from "./shaders";
import AOS from "aos";
import "aos/dist/aos.css";

async function getRepos() {
  let request = await fetch("https://api.github.com/users/cm-tech/repos?per_page=1000");
  var repos = await request.json();
  repos.forEach((e: { name: string; default_branch: string; html_url: string; has_pages: boolean }) => {
    var a = document.createElement("div");
    a.className = "column is-12-mobile is-half-tablet is-one-third-desktop";

    a.innerHTML = `
    <figure class="image is-2by1">
      <img class="project-thumb" src="https://raw.githubusercontent.com/CM-Tech/${e.name.toLowerCase()}/${encodeURIComponent(
      e.default_branch
    )}/README.png" onerror="this.style.display='none';this.parentElement.classList.add('no-image')"/>
      <figcaption>
        <h1 class="title is-size-5 is-size-4-widescreen">${e.name}</h1>
        <a class="button is-warning is-outlined is-rounded" href="${e.has_pages ? "http://cm-tech.github.io/" + e.name : e.html_url}" target="_blank">
          <span>Visit ${e.has_pages ? "Website" : "Repo"}</span>
          <span class="icon">
            <i class="fas fa-angle-right"></i>
            <!-- <i class="fas fa-angle-right"></i> -->
          </span>
        </a>
      </figcaption>
      <div class="overlay"></div>
    </figure>
    `;
    document.getElementById("project-grid-columns")!.appendChild(a);
  });
}
try {
  getRepos();
} catch (err) {
  console.log("could not get repos");
}
regl.frame(() => {
  fullscreen(() => {
    createSplat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color, config.SPLAT_RADIUS);

    update(config);
    display();
  });
});

let pointer = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  color: [1, 1, 0],
};
function getMColor(pos: { x: number; y: number }) {
  var vvy = window.scrollY + pos.y;

  if (vvy < window.innerHeight * getBreakpoint("breakpoint1")) {
    return [1, 1, 0];
  }
  if (vvy < window.innerHeight * getBreakpoint("breakpoint2")) {
    return [1, 1, 1];
  }
  if (vvy < window.innerHeight * getBreakpoint("breakpoint3")) {
    return [1, 1, 1];
  }
  return [1, 0, 0];
}
document.addEventListener("mousemove", (e) => {
  pointer.dx = (e.clientX - pointer.x) * 10;
  pointer.dy = (e.clientY - pointer.y) * 10;
  pointer.x = e.clientX;
  pointer.y = e.clientY;

  pointer.color = getMColor(pointer);
});
window.addEventListener("scroll", () => {
  pointer.color = getMColor(pointer);
});

AOS.init();
