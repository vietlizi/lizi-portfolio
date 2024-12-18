function toggleLightMode() {
  document.body.classList.toggle("light-mode");
  document.querySelector(".container").classList.toggle("light-mode");
  document.querySelector(".small-box").classList.toggle("light-mode");
  document.querySelector(".info-box").classList.toggle("light-mode");
  document.querySelector(".social-box").classList.toggle("light-mode");
  
  const button = document.getElementById("lightModeToggle");
  if (document.body.classList.contains("light-mode")) {
    button.textContent = "Dark on";  // Change button text
  } else {
    button.textContent = "Light on";  // Change button text back
  }
}

function showPopup() {
  document.getElementById("popup").style.display = "flex";
}
function closePopup() {
  document.getElementById("popup").style.display = "none";
}
