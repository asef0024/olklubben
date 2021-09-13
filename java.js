window.addEventListener("load", sidenVises);

function sidenVises() {
  console.log("siden vises");
  document.querySelector("#menuknap").addEventListener("click", toggleMenu);
}

function toggleMenu() {
  console.log("toggleMenu");
  document.querySelector("#menu").classList.toggle("hidden");

  let erSkjult = document.querySelector("#menu").classList.contains("hidden");

  if (erSkjult == true) {
    document.querySelector("#menuknap").textContent = "☰";
  } else {
    document.querySelector("#menuknap").textContent = "×";
  }
}

document.addEventListener("DOMContentLoaded", start);

let header = document.querySelector("#typer");
let oller;
let filter = "alle";

function start() {
  const filterKnapper = document.querySelectorAll(".sidebar a");
  document.querySelector(".valgt").classList.add("selected");
  filterKnapper.forEach((knap) =>
    knap.addEventListener("click", filtrerOller)
  );
  hentData();
}

function filtrerOller() {
  filter = this.dataset.type;
  document.querySelector(".selected").classList.remove("selected");
  this.classList.add("selected");

  visOller();
  //header.textContent = this.textContent;
}
const url = "https://olklubben-195d.restdb.io/rest/oloversigt";
const options = {
  headers: {
    "x-apikey": "6139e30043cedb6d1f97eee3",
  },
};
async function hentData() {
  const respons = await fetch(url, options);
  oller = await respons.json();
  visOller();
  console.log(oller);
}

function visOller() {
  const container = document.querySelector("#json");
  const menu = document.querySelector("template");
  container.textContent = "";
  oller.forEach((ol) => {
    if (filter == ol.type || filter == "alle") {
      let klon = menu.cloneNode(true).content;

      klon.querySelector("#info h3").textContent = ol.navn;
      klon.querySelector(".anbefaling").textContent = ol.anbefaling;
      klon.querySelector(".procent").textContent =
        ol.alkoholprocent + "%";

      klon.querySelector(".rating").textContent = ol.rating + "/10";
      klon.querySelector("#info img").src = "./billeder/" + ol.billede;

      klon
        .querySelector("article #mereInfo")
        .addEventListener("click", () => visOllen(ol));

      container.appendChild(klon);
    }
  });
}
