function toggleLightMode() {
  document.body.classList.toggle("light-mode");
  document.querySelector(".container").classList.toggle("light-mode");
  document.querySelector(".device-info").classList.toggle("light-mode");

  const button = document.getElementById("lightModeToggle");
  if (document.body.classList.contains("light-mode")) {
      button.textContent = "Dark on";
  } else {
      button.textContent = "Light on";
  }
}

function redirectHome() {
  window.location.href = '/';
}

function showPopup() {
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function changeDevice() {
  const device = document.getElementById("device-select").value;
  const deviceImage = document.getElementById("device-img");
  const deviceSpecs = document.querySelector(".specs");

  if (device === "rm8p") {
      deviceImage.src = "img/rm8p.png";
      deviceSpecs.innerHTML = `
          <h3>Red Magic 8 Pro</h3>
          <ul>
              <li>Display: 6.8" AMOLED</li>
              <li>Processor: Snapdragon 8 Gen 2</li>
              <li>RAM: 12 GB</li>
              <li>Storage: 256 GB</li>
              <li>Battery: 6000 mAh</li>
          </ul>
      `;
  } else if (device === "11prm") {
      deviceImage.src = "https://dreamphone.vn/wp-content/uploads/2022/10/iphone-11-pro-max-midnight-green-select-2019_1_1_3_2.png.webp";
      deviceSpecs.innerHTML = `
          <h3>iPhone 11 Pro Max</h3>
          <ul>
              <li>Display: 6.5" Super Retina XDR</li>
              <li>Processor: A13 Bionic Chip</li>
              <li>RAM: 4 GB</li>
              <li>Storage: 64 GB</li>
              <li>Battery: 3969 mAh</li>
          </ul>
      `;
  } else if (device === "macbook") {
      deviceImage.src = "https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111883_macbookair.png";
      deviceSpecs.innerHTML = `
          <h3>Macbook Air M1</h3>
          <ul>
              <li>Display: 13.3" Retina</li>
              <li>Processor: Apple M1 Chip</li>
              <li>RAM: 8 GB</li>
              <li>Storage: 256 GB SSD</li>
          </ul>
      `;
  }
}

document.getElementById("headHomeButton").addEventListener("click", function() {
  window.location.href = "https://vietlizi.space";
});
