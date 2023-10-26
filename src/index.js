// Import бібліотеки axios для виконання HTTP-запитів
import axios from 'axios';

// Import бібліотеки notiflix для повідомлень
import Notiflix from 'notiflix';

const apiKey = '40298326-3542dba9bdb0915da3eae5d6c';
const perPage = 40;
let currentPage = 1;
let searchQuery = '';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  gallery.innerHTML = ''; // Очистимо галерею перед новим пошуком
  currentPage = 1;
  searchQuery = event.target.elements.searchQuery.value.trim();
  searchImages(searchQuery, currentPage);
});

loadMoreButton.addEventListener('click', () => {
  currentPage += 1;
  searchImages(searchQuery, currentPage);
});

function searchImages(query, page) {
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;

  axios.get(apiUrl)
    .then((response) => {
      const data = response.data;
      if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      } else {
        renderImages(data.hits);
        if (data.totalHits <= page * perPage) {
          loadMoreButton.style.display = 'none';
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
          loadMoreButton.style.display = 'block';
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Notiflix.Notify.failure('An error occurred while fetching images.');
    });
}

function renderImages(images) {
  images.forEach((image) => {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'info';

    const likes = createInfoItem('Likes', image.likes);
    const views = createInfoItem('Views', image.views);
    const comments = createInfoItem('Comments', image.comments);
    const downloads = createInfoItem('Downloads', image.downloads);

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    photoCard.appendChild(img);
    photoCard.appendChild(info);

    gallery.appendChild(photoCard);
  });
}

function createInfoItem(label, value) {
  const infoItem = document.createElement('p');
  infoItem.className = 'info-item';
  infoItem.innerHTML = `<b>${label}:</b> ${value}`;
  return infoItem;
}
