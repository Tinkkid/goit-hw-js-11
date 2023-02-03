import PixabayApi from './js/pixabay-api';
import createMarkupGallery from './js/gallery-markup';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const refs = {
  searchForm: document.getElementById('search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  wrapOfGallery: document.querySelector('.gallery'),
};
const pixabayApi = new PixabayApi();

console.log(pixabayApi);

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

function onSearchClick(e) {
  e.preventDefault();
  clearGallery();

  pixabayApi.query = e.currentTarget.elements.searchQuery.value.trim();
  if (!pixabayApi.query) {
    return Notiflix.Notify.info('Please, enter your request');
  }
  pixabayApi.resetPage();
  pixabayApi
    .fetchGallery()
    .then(hits => {
      console.log(hits);
      if (hits.length === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else appendGalleryMarkup(hits);
      return Notiflix.Notify.success(
        `Hooray! We found ${pixabayApi.totalHits()} images.`
      );
    })
    .catch(error => {
      if (error.message === '404')
        Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function onLoadMoreClick() {
  pixabayApi.fetchGallery().then(appendGalleryMarkup);
  if (pixabayApi.endOfCollection()) {
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function appendGalleryMarkup(hits) {
  refs.wrapOfGallery.insertAdjacentHTML('beforeend', createMarkupGallery(hits));
}

function clearGallery() {
  refs.wrapOfGallery.innerHTML = '';
}
