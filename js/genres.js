const API_KEY = '70c1e295ba1e8c8b89b5fea784cb617f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
    loadGenres();

    const genreSearchButton = document.getElementById('genreSearchButton');
    genreSearchButton.addEventListener('click', () => {
        const genreId = document.getElementById('genreSelect').value;
        searchMoviesByGenre(genreId);
    });
});

function loadGenres() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            populateGenreSelect(data.genres);
        })
        .catch(error => console.error('Error fetching genres:', error));
}

function populateGenreSelect(genres) {
    const genreSelect = document.getElementById('genreSelect');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

function searchMoviesByGenre(genreId) {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayGenreResults(data.results);
        })
        .catch(error => console.error('Error fetching genre results:', error));
}

function displayGenreResults(movies) {
    const genreResults = document.getElementById('genreResults');
    genreResults.innerHTML = '';

    if (movies.length === 0) {
        genreResults.innerHTML = '<p>Nenhum filme encontrado para este gênero.</p>';
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
        
        genreResults.appendChild(movieElement);
    });
}

function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}
