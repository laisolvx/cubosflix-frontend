let pagina = 1;
let inicial = 0;
let final = 5;
const divFilmes = document.querySelector(".movies");

async function pegarAPI() {
    const urlAPI = "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false";
    const resposta = await fetch(urlAPI);
    const APIfilmes = await resposta.json();
    listarFilmes(APIfilmes);
}
pegarAPI();

function listarFilmes(APIfilmes) {
    const selecionarFilmes = APIfilmes.results.slice(inicial, final);
    const filmesLista = selecionarFilmes.reduce((acc, item) => {
        acc +=
            `<div 
            class="movie" 
            onclick="modalFilmes(${item.id})"
            style = "background-image: url(${item.poster_path})"
        >

      <div class="movie__info">
        <span class="movie__title">${item.original_title}</span>
        <span class="movie__rating">${item.price}</span>
        <img src="/assets/estrela.svg" alt="estrela">
      </div>
    </div>
  </div>`;
        return acc;

    }, " ");

    divFilmes.innerHTML = filmesLista;
}

const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");

btnPrev.addEventListener("click", function () {

    if (pagina === 1) {
        inicial = 15;
        final = 20;
        pagina = 4;
    } else if (pagina === 4) {
        inicial = 10;
        final = 15;
        pagina = 3;
    } else if (pagina === 3) {
        inicial = 5;
        final = 10;
        pagina = 2;
    } else if (pagina === 2) {
        inicial = 0;
        final = 5;
        pagina = 1;
    }
    pegarAPI(inicial, final);
});

btnNext.addEventListener("click", function () {
    if (pagina === 2) {
        inicial = 10;
        final = 15;
        pagina = 3;
    } else if (pagina === 3) {
        inicial = 15;
        final = 20;
        pagina = 4;
    } else if (pagina === 4) {
        inicial = 0;
        final = 5;
        pagina = 1;
    } else if (pagina === 1) {
        inicial = 5;
        final = 10;
        pagina = 2;
    }
    pegarAPI(inicial, final);
});

const btnBuscar = document.querySelector(".input");
btnBuscar.addEventListener("keydown", function (event) {
    if (event.code === "Enter") {
        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query=${btnBuscar.value}`).then(promise => {
            const respostaBody = promise.json();
            respostaBody.then(function (body) {
                listarFilmes(body);
            });
        });
        btnBuscar.value = "";
    }
});

const body = document.querySelector("body")
const movieInfo = document.querySelector(".movie__info");
const temaBtn = document.querySelector(".btn-theme");
const temaInicial = localStorage.getItem("tema");


let claro = true;
temaBtn.addEventListener("click", function () {
    localStorage.setItem("tema", temaInicial === "claro" ? "escuro" : "claro");
    if (claro) {
        temaBtn.src = "./assets/dark-mode.svg";
        body.style.setProperty("--background-color", "#242424");
        body.style.setProperty("--highlight-description", "#FFF");
        body.style.setProperty("--input-border-color", "#FFF");
        body.style.setProperty("--color", "#FFF");
        body.style.setProperty(".movie__info", "#FFF");
        body.style.setProperty("--highlight-description", "#242424");
        btnPrev.src = "./assets/seta-esquerda-branca.svg";
        btnNext.src = "./assets/seta-direita-branca.svg";
        claro = false;
    } else {
        temaBtn.src = "./assets/light-mode.svg";
        body.style.setProperty("--background-color", "#FFF");
        body.style.setProperty("--highlight-description", "#242424");
        body.style.setProperty("--input-border-color", "#242424");
        body.style.setProperty("--color", "#242424");
        btnPrev.src = "./assets/seta-esquerda-preta.svg";
        btnNext.src = "./assets/seta-direita-preta.svg";
        claro = true;
    }
});

const highlightLink = document.querySelector(".highlight__video-link");
const highlightVideo = document.querySelector(".highlight__video");
const highlightTitle = document.querySelector(".highlight__title");
const highlightRating = document.querySelector(".highlight__rating");
const highlightGenres = document.querySelector(".highlight__genres");
const highlightLaunch = document.querySelector(".highlight__launch");
const highlightDescription = document.querySelector(".highlight__description");

const respostaAPI = fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR");

respostaAPI.then(function (resposta) {
    try {

        const respostaBody = resposta.json();

        respostaBody.then(function (body) {
            highlightLink.href = `https://www.youtube.com/watch?v=bsvOMvwivY4&t=4s`;
            highlightVideo.style.background = `linear-gradient(rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%), url('${body.backdrop_path}') no-repeat center/cover`;
            highlightTitle.textContent = body.title;
            highlightRating.textContent = body.vote_average.toFixed(1);
            highlightGenres.textContent = body.genres.map(genres => genres.name).join(", ");
            highlightLaunch.textContent = body.release_date;
            highlightDescription.textContent = body.overview;
        });
    } catch (e) {

    }
});

const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");
const modalTitle = document.querySelector(".modal__title");
const modalImg = document.querySelector(".modal__img");
const modalDescription = document.querySelector(".modal__description");
const modalGenreAverage = document.querySelector(".modal__genre-average");
const modalGenres = document.querySelector(".modal__genres");
const modalAverage = document.querySelector(".modal__average");


const genreModal = document.querySelector(".modal__genres");

async function modalFilmes(id) {
    modal.classList.remove("hidden");

    const respostaAPI = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);
    const respostaJson = respostaAPI.json();

    respostaJson.then(function (body) {
        modalTitle.textContent = body.title;
        modalImg.src = body.backdrop_path;
        modalDescription.textContent = body.overview;
        modalAverage.textContent = body.vote_average.toFixed(1);

        body.genres.forEach(genre => {
            const modalGenre = document.createElement("span");
            modalGenre.textContent = genre.name;
            modalGenre.classList.add("modal__genre");

            genreModal.append(modalGenre);
            const fecharModal = () => {
                modal.classList.add("hidden");
                modalGenre.remove();
            }
            modal.addEventListener("click", fecharModal);
        });
    });
}