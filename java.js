window.addEventListener("load", sidenVises);

// Funktion som lytter efter at siden åbnes. Derefter kaldes en eventlistener på burger menu.
function sidenVises() {
  console.log("siden vises");
  document.querySelector("#menuknap").addEventListener("click", toggleMenu);
}

// Toggle funktion til brug af burger menu.
function toggleMenu() {
  console.log("toggleMenu");
  // ID=Menu for css klassen "hidden", som skjuler overlay.
  document.querySelector("#menu").classList.toggle("hidden");

  // variable for at #menu har klassen "hidden". Her er keyword "contains", som checker efter klassen.
  let erSkjult = document.querySelector("#menu").classList.contains("hidden");

  // Boolean som checker om hvorvidt sidenavigationsbaren er vist
  // eller skjult når burgermenu klikkes mens man er på oversigt siden.
  // Der checkes også for om text contant af HTML koden, om hvorvidt luk knap eller burgeren er synlig.
  if (erSkjult == true) {
    document.querySelector("#menuknap").textContent = "☰";
    document.querySelector(".sidebar").classList.remove("skjulSideBar");
  } else {
    document.querySelector("#menuknap").textContent = "×";
    document.querySelector(".sidebar").classList.add("skjulSideBar");
  }
}

// Venter på at DOM elementer er loaded
document.addEventListener("DOMContentLoaded", start);

// https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
// Kode som gør at der automatisk scrolles til top når man filtrerer.
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox & IE
}

// Variabler for filtrering
let header = document.querySelector("#typer");
let oller;
let filter = "alle";

// Ved start efter DOM er loaded, bliver filtreringsfunktionalitet initialized.
function start() {
  const filterKnapper = document.querySelectorAll(".sidebar a");
  document.querySelector(".valgt").classList.add("selected");

  // Kører igennem array af øl produkter og giver eventlistener som henter data fra databasen.
  filterKnapper.forEach((knap) => knap.addEventListener("click", filtrerOller));
  hentData();
}

// Filterfunktion for at kører igennem array af øl.
//  Her tilføjer vi klassen "selected", som indikerer den valgte filterering.
function filtrerOller() {
  // Dot notation der indhenter det valgte elements "type" fra datasættet.
  filter = this.dataset.type;
  document.querySelector(".selected").classList.remove("selected");
  this.classList.add("selected");

  visOller();
  //header.textContent = this.textContent;
}

// Variabler for indhentning af JSON filer.
const url = "https://olklubben-195d.restdb.io/rest/oloversigt";
const options = {
  headers: {
    "x-apikey": "6139e30043cedb6d1f97eee3",
  },
};

// Funktion som indhenter data fra restDB. Herefter kaldes funktionen visOller (Øller)
async function hentData() {
  const respons = await fetch(url, options);
  oller = await respons.json();
  visOller();
  console.log(oller);
}

// Funktionen visOller indhenter JSON filer og kører et forloop igennem (forEach.) hvert objekt.
// Herefter udfyldes HTML template med den indhentede data gennem queryselector.
function visOller() {
  const container = document.querySelector("#json");
  const menu = document.querySelector("template");
  container.textContent = "";
  oller.forEach((ol) => {
    if (filter == ol.type || filter == "alle") {
      let klon = menu.cloneNode(true).content;

      klon.querySelector("#info h3").textContent = ol.navn;
      klon.querySelector(".anbefaling").textContent = ol.anbefaling;
      klon.querySelector(".procent").textContent = ol.alkoholprocent + "%";

      klon.querySelector(".rating").textContent = ol.rating + "/10";
      klon.querySelector("img").src = "./billeder/" + ol.billede;

      // Funktion som gennem knap under produktsiden i ipad (eller større format) starter popUp funktionen.
      klon
        .querySelector("#info button")
        .addEventListener("click", () => visPopUpOversigt(ol));

      // Funktion som gennem billede under produktsiden i mobil format starter popUp funktionen.
      klon
        .querySelector("#info img")
        .addEventListener("click", () => visPopUpOversigt(ol));

      console.log("#info img");

      // Forsøgt funktion som måler skærmstørrelsen, og derefter ændrer på knap eller billede af produkt
      // er aktivt for det gældende format. Desværre virkede det ikke.

      // window.addEventListener("resize", function () {
      //   if (window.matchMedia("(max-width: 768px)").matches) {
      //     klon
      //       .querySelector("#info img")
      //       .addEventListener("click", () => visPopUpOversigt(ol));
      //   } else {
      //     klon
      //       .querySelector("#info .button")
      //       .addEventListener("click", () => visPopUpOversigt(ol));
      //   }
      // });

      // Her appendes data fra JSON filer til templatens children.
      container.appendChild(klon);
    }
  });

  // Funktion som styrer PopUp vinduet. Funktionen tager det valgte objekt (ol), og udfylder siden med indhold fra
  // databasen.
  function visPopUpOversigt(ol) {
    const popUp = document.querySelector("#popUp");

    // Dot notation som styrer at popUp vises efter klik på et produkt.
    popUp.style.display = "flex";
    // Dot notation som gør at ved popUp vindue, så slukkes for scroll effect på baggrunden (main body).
    document.body.style.overflow = "hidden";
    // Side navigationsbar skjules
    document.querySelector(".sidebar").classList.add("skjulSideBar");

    // Via dot notation indsættelse af data fra JSON.
    popUp.querySelector("img").src = "./billeder/" + ol.billede;
    popUp.querySelector(".navn_popUp").textContent = ol.navn;
    popUp.querySelector(".duft_tekst_popUp").textContent = ol.duft;
    popUp.querySelector(".smagBeskrivelse_popUp").textContent = ol.smag;
    popUp.querySelector(".rating_popUp").textContent = ol.rating + "/10";
    popUp.querySelector(".alkoholProcent_popUp").textContent =
      ol.alkoholprocent + "%";

    // Luk knap til pop up gives eventlistener.
    document.querySelector("#luk_knap").addEventListener("click", skjulmenu);

    // Luk knappen gives funktion som skjuler popUp vindue, og samtidig giver baggrunden scroll funktion tilbage.
    function skjulmenu() {
      popUp.style.display = "none";
      document.body.style.overflow = "scroll";
      // Sidenavigationsmenu vises igen ved luk af popUp vindue.
      document.querySelector(".sidebar").classList.remove("skjulSideBar");
    }
  }
}
