const API_KEY = '70c1e295ba1e8c8b89b5fea784cb617f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.getElementById('genreButton').addEventListener('click', function() {
    const genreId = document.getElementById('genreSelect').value;
    if (genreId) {
        fetchMoviesByGenre(genreId);
    }
});
document.getElementById('genreSelect').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const genreId = document.getElementById('genreSelect').value;
        if (genreId) {
            fetchMoviesByGenre(genreId);
        }
    }
});

function fetchMoviesByGenre(genreId) {
    showLoadingSpinner(true);
    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                displayMovies(data.results);
            } else {
                displayError('Nenhum filme encontrado para este gênero.');
            }
        })
        .catch(error => {
            displayError('Ocorreu um erro ao buscar filmes por gênero.');
            console.error(error);
        })
        .finally(() => showLoadingSpinner(false));
}

function displayMovies(movies) {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';
    
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        
        const imgSrc = movie.poster_path ? `${IMG_URL}${movie.poster_path}` : 'https://via.placeholder.com/150';
        const formattedDate = formatDate(movie.release_date);
        
        movieElement.innerHTML = `
            <a href="movie.html?id=${movie.id}">
                <img src="${imgSrc}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${formattedDate}</p>
            </a>
        `;
        
        moviesList.appendChild(movieElement);
    });
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
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = `<p style="text-align: center; color: #e74c3c;">${message}</p>`;
}