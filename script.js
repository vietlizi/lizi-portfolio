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

function showPopup(type) {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupContent = document.getElementById("popup-content");

  if (type === 'blackpink') {
    popupTitle.textContent = 'BLACKPINK!';
    popupContent.innerHTML = `
      <p><a href="https://open.spotify.com/artist/41MozSoPIsD1dJM0CLPjZF" target="_blank" style="color: white;">BLACKPINK</a></p>
      <p><a href="https://open.spotify.com/artist/6UZ0ba50XreR4TM8u322gs" target="_blank" style="color: white;">JISOO</a></p>
      <p><a href="https://open.spotify.com/artist/250b0Wlc5Vk0CoUsaCY84M" target="_blank" style="color: white;">JENNIE</a></p>
      <p><a href="https://open.spotify.com/artist/5L1lO4eRHmJ7a0Q6csE5cT" target="_blank" style="color: white;">LISA</a></p>
      <p><a href="https://open.spotify.com/artist/3eVa5w3URK5duf6eyVDbu9" target="_blank" style="color: white;">ROSÉ</a></p>`;
  } else if (type === 'projects') {
    popupTitle.textContent = 'My Projects';
    popupContent.innerHTML = `
      <p><a href="https://github.com/vietlizi/phone-is-encrypted" target="_blank" style="color: white;">Phone Is Encrypted</a>: Spoof your "not-encrypted" phone to appear encrypted.</p>
      <p><a href="https://github.com/vietlizi/lizi-portfolio" target="_blank" style="color: white;">Lizi Portfolio</a>: Repo of this site.</p>
      <br>
      <p>Mostly all my other projects are failed/unfinished, if you want your eyes to burn badly you can check them out at my <a href="https://github.com/vietlizi" target="_blank" style="color: white;">GitHub</a>.</p>
    `;
  } else if (type === 'moreInfo') {
    popupTitle.textContent = 'More Info';
    popupContent.innerHTML = 'I like to keep my personal information private, but since you're here, here is a video that you should <a href="https://www.youtube.com/watch?v=1kXLsrun51s" target="_blank" style="color: white;">watch</a>.';
  }

  popup.style.display = 'flex';
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
