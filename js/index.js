import "zenscroll";
import { regl } from "./canvas";
import * as config from "./config";
import { fullscreen, update, display, drawLogo, createSplat } from "./shaders";

// When the user scrolls the page, execute myFunction
window.onscroll = navStick;

// Get the header
var header = document.getElementById("navbar");
var topSection = document.getElementById("top");

// Get the offset position of the navbar
var gg = -6;
var sticky = header.offsetTop;
console.log(sticky);
window.onresize = navStick;
navStick();
// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function navStick() {
  gg = (window.innerWidth >= 1024 ? -20 : 0) + 40;
  if (window.pageYOffset > sticky - gg) {
    header.classList.add("sticky");

    topSection.classList.add("sticky");
  } else {
    if (!header.classList.contains("sticky")) {
      sticky = header.offsetTop;
    }
    header.classList.remove("sticky");
    topSection.classList.remove("sticky");
  }
}

function getRepos() {
  var req = new XMLHttpRequest();
  req.open("GET", "https://api.github.com/users/cm-tech/repos?per_page=1000", false);
  req.send(null);
  var repos = eval(req.responseText);
  console.log(repos);
  repos.forEach(function (e) {
    var a = document.createElement("div");
    a.className = "column is-12-mobile is-half-tablet is-one-third-desktop";

    a.innerHTML = `
        <figure class="image is-2by1">
        <img class="project-thumb" src="https://raw.githubusercontent.com/CM-Tech/${e.name.toLowerCase()}/master/README.png" onerror="this.style.display='none';this.parentElement.classList.add('no-image')"/>
          
            <figcaption>
                <h1 class="title is-size-5 is-size-4-widescreen">${e.name}</h1>
                
                <a class="button is-warning is-outlined is-rounded" href="${
                  e.has_pages ? "http://cm-tech.github.io/" + e.name : e.html_url
                }" target="_blank"><span>Visit ${
      e.has_pages ? "Website" : "Repo"
    }</span><span class="icon"><i class="fas fa-angle-right"></i><!-- <i class="fas fa-angle-right"></i> --></span></a>
            </figcaption>
            <div class="overlay"></div>
        </figure>
    `;
    document.getElementById("project-grid-columns").appendChild(a);
  });
}
getRepos();

regl.frame(() => {
  fullscreen(() => {
    if (window.scrollY < window.innerHeight / 2) drawLogo(1.0 - config.DENSITY_DISSIPATION);
    if (pointer.moved) {
      createSplat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color, config.SPLAT_RADIUS);
      pointer.moved = false;
    }
    update(config);
    display();
  });
});

let pointer = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  moved: false,
  color: [0.5, 0.66, 1],
};
document.addEventListener("mousemove", (e) => {
  pointer.moved = true;
  pointer.dx = (e.clientX - pointer.x) * 10;
  pointer.dy = (e.clientY - pointer.y) * 10;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});
document.addEventListener("mousedown", () => {
  pointer.color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
});
