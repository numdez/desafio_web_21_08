const API_KEY = '';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
const moviesPerPage = 20; 
let allMovies = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchHeroBannerMovies();
    fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`, '.popular-movies-carousel');
    fetchMovies(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=pt-BR`, '.top-rated-movies-carousel');
});

function fetchHeroBannerMovies() {
    const popularMoviesUrl = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${currentPage}`;
    const topRatedMoviesUrl = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=pt-BR&page=${currentPage}`;

    Promise.all([fetch(popularMoviesUrl), fetch(topRatedMoviesUrl)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            popularMovies = data[0].results;
            topRatedMovies = data[1].results;
            displayHeroBannerCarousel();
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function displayHeroBannerCarousel() {
    const heroCarousel = document.querySelector('.hero-carousel');
    heroCarousel.innerHTML = ''; 

    const mixedMovies = mixMovies(popularMovies, topRatedMovies);

    mixedMovies.forEach(movie => {
        const slideElement = document.createElement('div');
        slideElement.classList.add('hero-slide');

        const imgSrc = `${IMG_URL}${movie.poster_path}`;
        const bgSrc = `${IMG_URL}${movie.backdrop_path}`;

        slideElement.innerHTML = `
            <div class="hero-text">
                <h1>${movie.title}</h1>
                <p>${movie.overview}</p>
                <button onclick="location.href='movie-details.html?id=${movie.id}'">Saiba Mais</button>
            </div>
            <div class="hero-image">
                <img src="${imgSrc}" alt="${movie.title}">
            </div>
        `;

        heroCarousel.appendChild(slideElement);
    });

    startHeroCarousel();
}

function mixMovies(popular, topRated) {
    const mixed = [];
    const maxLength = Math.max(popular.length, topRated.length);
    for (let i = 0; i < maxLength; i++) {
        if (i < popular.length) mixed.push(popular[i]);
        if (i < topRated.length) mixed.push(topRated[i]);
    }
    return mixed;
}

function startHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentIndex = 0;
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;

        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(-${100 * currentIndex}%)`;
        });

        
        if (currentIndex === 0) {
            currentPage++;
            fetchMovies();
        }
    }, 7500); 
}



function fetchMovies(url, carouselSelector) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayPosterMovies(data.results, carouselSelector);
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function displayPosterMovies(movies, carouselSelector) {
    const carousel = document.querySelector(carouselSelector);
    carousel.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card');
        
        const imgSrc = movie.poster_path ? `${IMG_URL}${movie.poster_path}` : 'https://via.placeholder.com/500';
        const formattedDate = formatDate(movie.release_date);

        movieElement.innerHTML = `
            <a href="movie-details.html?id=${movie.id}" class="movie-link">
                <img src="${imgSrc}" alt="${movie.title}">
                <div class="movie-details">
                    <h5>${movie.title}</h5>
                    <p>${formattedDate}</p>
                </div>
            </a>
        `;

        carousel.appendChild(movieElement);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
