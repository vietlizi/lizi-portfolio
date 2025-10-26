// tab switching
const navLinks = document.querySelectorAll(".nav-link");
const aboutWrapper = document.getElementById("about");
const projectsWrapper = document.getElementById("projects");

function showTab(which) {
  // nav state
  navLinks.forEach((b) => {
    const target = b.getAttribute("data-target");
    b.classList.toggle("active", target === which);
  });

  // section visibility
  if (which === "about") {
    aboutWrapper.classList.remove("hidden");
    projectsWrapper.classList.remove("active");
  } else {
    aboutWrapper.classList.add("hidden");
    projectsWrapper.classList.add("active");
  }

  // scroll to top when switching
  window.scrollTo({ top: 0, behavior: "instant" || "auto" });
}

navLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    showTab(targetId);
  });
});

// projects
const projectsJump = document.querySelector(".projects-jump");
if (projectsJump) {
  projectsJump.addEventListener("click", () => {
    showTab("projects");
  });
  projectsJump.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      showTab("projects");
    }
  });
}

// theme toggle
const toggleEl = document.getElementById("themeToggle");
let light = false;

function setLightMode(on) {
  if (on) {
    document.body.classList.add("light-mode");
    toggleEl.textContent = "aww get me back to normal";
  } else {
    document.body.classList.remove("light-mode");
    toggleEl.textContent =
      "do you know that you also can burn your eye from clicking this";
  }
}

toggleEl.addEventListener("click", () => {
  light = !light;
  setLightMode(light);
});
toggleEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    light = !light;
    setLightMode(light);
  }
});

// footer year
document.getElementById("year").textContent = new Date().getFullYear();
