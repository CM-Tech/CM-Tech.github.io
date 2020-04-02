// When the user scrolls the page, execute myFunction
window.onscroll = navStick;

// Get the header
var header = document.getElementById("navbar");
var topSection = document.getElementById("top");

// Get the offset position of the navbar
var gg = -6;
var sticky = header.offsetTop;
console.log(sticky)
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
    req.open('GET', 'https://api.github.com/users/cm-tech/repos?per_page=1000', false);
    req.send(null);
    var repos = eval(req.responseText);
    repos.forEach(function(e) {
        var a = document.createElement("div");
        a.className = "column is-12-mobile is-half-tablet is-one-third-desktop";
        //<img class="project-thumb" src="http://api.page2images.com/directlink?p2i_url=http://cm-tech.github.io/${e.name}&p2i_device=6&p2i_screen=1024x600&p2i_size=512x300&p2i_wait=5&p2i_key=4bc9911353a20554" />

        a.innerHTML = `
        <figure class="image is-4by3">
            
          
            <figcaption>
                <h1 class="title is-size-5 is-size-4-widescreen">${e.name}</h1><a class="button is-warning is-outlined is-rounded" href="${"http://cm-tech.github.io/" + e.name}" target="_blank"><span>Visit Website</span><span class="icon"><i class="fas fa-angle-right"></i><!-- <i class="fas fa-angle-right"></i> --></span></a>
            </figcaption>
            <div class="overlay"></div>
        </figure>
    `
        document.getElementById("project-grid-columns").appendChild(a);

    });
}
getRepos();