const API_KEY = '';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
    const movieId = new URLSearchParams(window.location.search).get('id');
    
    if (movieId) {
        getMovieDetails(movieId);
        loadPopularMovies();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const movieDetails = document.querySelector('.movie-details');
    const sidebar = document.querySelector('.sidebar');

    // Função para ajustar a altura da sidebar
    const adjustSidebarHeight = () => {
        const movieDetailsHeight = movieDetails.offsetHeight;
        sidebar.style.height = `${movieDetailsHeight}px`;
    };

    // Ajuste a altura no carregamento da página
    adjustSidebarHeight();

    // Ajuste a altura quando a janela for redimensionada
    window.addEventListener('resize', adjustSidebarHeight);
});



function getMovieDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovieDetails(data);
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

function displayMovieDetails(data) {
    document.getElementById('movie-title-detail').textContent = data.title;
    document.getElementById('movie-description').textContent = data.tagline || 'No description available.';
    document.getElementById('movie-poster').src = `${IMG_URL}${data.poster_path}`;
    document.getElementById('release-date').textContent = formatDate(data.release_date);
    document.getElementById('overview').textContent = data.overview;

    // Gêneros
    document.getElementById('genre').textContent = data.genres.map(genre => genre.name).join(', ');
}

function loadPopularMovies() {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayPopularMovies(data.results);
        })
        .catch(error => console.error('Error fetching popular movies:', error));
}

function displayPopularMovies(movies) {
    const popularMoviesContainer = document.getElementById('popular-movies');
    popularMoviesContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        
        const imgSrc = `${IMG_URL}${movie.poster_path}`;
        movieElement.innerHTML = `
            <a href="movie-details.html?id=${movie.id}" style="text-decoration:none;" class="movie-link">
                <img src="${imgSrc}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${formatDate(movie.release_date)}</p>
            </a>
        `;
        
        popularMoviesContainer.appendChild(movieElement);
    });
}

function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}
