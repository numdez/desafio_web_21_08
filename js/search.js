const API_KEY = '70c1e295ba1e8c8b89b5fea784cb617f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', () => {
        searchMovies(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovies(searchInput.value);
        }
    });
});

function searchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data.results);
        })
        .catch(error => console.error('Error fetching search results:', error));
}

function displaySearchResults(movies) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (movies.length === 0) {
        searchResults.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        
        const imgSrc = `${IMG_URL}${movie.poster_path}`;
        movieElement.innerHTML = `
            <a href="movie-details.html?id=${movie.id}" class="movie-link">
                <img src="${imgSrc}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${formatDate(movie.release_date)}</p>
            </a>
        `;
        
        searchResults.appendChild(movieElement);
    });
}

function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}