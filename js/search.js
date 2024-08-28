const API_KEY = '70c1e295ba1e8c8b89b5fea784cb617f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.getElementById('searchButton').addEventListener('click', searchMovies);
document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
});

function searchMovies() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        showLoadingSpinner(true);
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    displayMovies(data.results);
                } else {
                    displayError('Nenhum filme encontrado.');
                }
            })
            .catch(error => {
                displayError('Ocorreu um erro ao buscar filmes.');
                console.error(error);
            })
            .finally(() => showLoadingSpinner(false));
    } else {
        displayError('Por favor, insira um termo de busca.');
    }
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

