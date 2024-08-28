const API_KEY = '70c1e295ba1e8c8b89b5fea784cb617f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (movieId) {
        fetchMovieDetails(movieId);
    } else {
        displayError('ID do filme não encontrado.');
    }
});

function fetchMovieDetails(movieId) {
    showLoadingSpinner(true);
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            displayMovieDetails(data);
        })
        .catch(error => {
            displayError('Ocorreu um erro ao buscar os detalhes do filme.');
            console.error(error);
        })
        .finally(() => showLoadingSpinner(false));
}

function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movieDetails');
    
    const imgSrc = movie.poster_path ? `${IMG_URL}${movie.poster_path}` : 'https://via.placeholder.com/500';
    const formattedDate = formatDate(movie.release_date);
    
    movieDetails.innerHTML = `
        <h1>${movie.title}</h1>
        <img src="${imgSrc}" alt="${movie.title}">
        <p><strong>Release Date:</strong> ${formattedDate}</p>
        <p><strong>Overview:</strong> ${movie.overview}</p>
        <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
        <p><strong>Rating:</strong> ${movie.vote_average} / 10</p>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'block' : 'none';
}

function displayError(message) {
    const movieDetails = document.getElementById('movieDetails');
    movieDetails.innerHTML = `<p style="text-align: center; color: #e74c3c;">${message}</p>`;
}