import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import $ from 'jquery';

const apiKey = '40298326-3542dba9bdb0915da3eae5d6c';
const perPage = 40;
let currentPage = 1;
let searchQuery = '';

$(document).ready(() => {
  const searchForm = $('#search-form');
  const gallery = $('.gallery');
  const loadMoreButton = $('.load-more');
    

// Обробник подання форми пошуку
  searchForm.submit((event) => {
    event.preventDefault();
    gallery.empty();
    currentPage = 1;
    searchQuery = event.target.elements.searchQuery.value.trim();
    searchImages(searchQuery, currentPage);
  });
    
    
 // Обробник події прокрутки сторінки
  $(window).scroll(() => {
    if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
      currentPage += 1;
      searchImages(searchQuery, currentPage);
    }
  });

    
    // Функція для пошуку зображень
  async function searchImages(query, page) {
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      } else {
        renderImages(data.hits);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    } catch (error) {
      console.error('Error:', error);
      Notiflix.Notify.failure('An error occurred while fetching images.');
    }
  }

    
    // Функція для відображення зображень
  function renderImages(images) {
    images.forEach((image) => {
      const photoCard = $('<div class="photo-card"></div>');

      const link = $(`<a href="${image.largeImageURL}" title="${image.tags}" data-lightbox="gallery"></a>`);
      const img = $(`<img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">`);
      const info = $('<div class="info"></div>');
      const likes = createInfoItem('Likes', image.likes);
      const views = createInfoItem('Views', image.views);
      const comments = createInfoItem('Comments', image.comments);
      const downloads = createInfoItem('Downloads', image.downloads);

      info.append(likes, views, comments, downloads);
      link.append(img);
      photoCard.append(link, info);
      gallery.append(photoCard);
    });

    const lightbox = new SimpleLightbox('[data-lightbox="gallery"]');
    lightbox.refresh();
  }

    
     // Функція для створення блоку інформації про зображення
  function createInfoItem(label, value) {
    return $(`<p class="info-item"><b>${label}:</b> ${value}</p>`);
  }
});
