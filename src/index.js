import PixabayApi from './js/pixabay-api';
import createMarkupGallery from './js/gallery-markup';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});

const refs = {
  searchForm: document.getElementById('search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  wrapOfGallery: document.querySelector('.gallery'),
};
const pixabayApi = new PixabayApi();

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.loadMoreBtn.classList.add('disabled');

async function onSearchClick(e) {
  e.preventDefault();
  clearGallery();

  pixabayApi.query = e.currentTarget.elements.searchQuery.value.trim();
  if (!pixabayApi.query) {
    refs.loadMoreBtn.disabled = true;
    return Notiflix.Notify.info('Please, enter your request');
  }

  pixabayApi.resetPage();

  try {
    const searchApi = await pixabayApi.fetchGallery();
    const resultApi = await searchApi.data.hits;
    currentHits = resultApi.length;
    if (resultApi.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else appendGalleryMarkup(resultApi);
    lightbox.refresh();
    refs.loadMoreBtn.disabled = false;
    return Notiflix.Notify.success(
      `Hooray! We found ${searchApi.data.totalHits} images.`
    );
  } catch (err) {
    console.log(err);
  }
  }

   // *fetch/then functions

  // pixabayApi
  //   .fetchGallery()
  //   .then(hits => {
  //     console.log(hits);
  //     if (hits.length === 0) {
  //       return Notiflix.Notify.failure(
  //         'Sorry, there are no images matching your search query. Please try again.'
  //       );
  //     } else appendGalleryMarkup(hits);
  //     return Notiflix.Notify.success(
  //       `Hooray! We found ${pixabayApi.totalHits()} images.`
  //     );
  //   })
  //   .catch(error => {
  //     if (error.message === '404')
  //       Notiflix.Notify.failure('Oops, there is no country with that name');
  //   });

async function onLoadMoreClick() {
const searchApi = await pixabayApi.fetchGallery();
  const resultApi = await searchApi.data.hits;
  const renderMoreImages = await appendGalleryMarkup(resultApi);
    lightbox.refresh();
  const totalPages = Math.ceil(searchApi.data.totalHits / pixabayApi.per_page);
    if (pixabayApi.page > totalPages) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  }

  // if (
  //   Math.round(searchApi.data.totalHits / pixabayApi.per_page) ===
  //   pixabayApi.page
  // ) {
    
  //    Notiflix.Notify.info(
  //     "We're sorry, but you've reached the end of search results."
  //    );
  //   refs.loadMoreBtn.disabled = true;
  // }

  // *fetch/then functions

  // pixabayApi.fetchGallery().then(appendGalleryMarkup);
  // if (pixabayApi.endOfCollection()) {
  //   return Notiflix.Notify.info(
  //     "We're sorry, but you've reached the end of search results."
  //   );
  // }

function appendGalleryMarkup(hits) {
  refs.wrapOfGallery.insertAdjacentHTML('beforeend', createMarkupGallery(hits));
}

function clearGallery() {
  refs.wrapOfGallery.innerHTML = '';
}

async function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;

  // number of pixels and how many scrolls
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;

  //We track where the bottom of the screen is relative to the page:
  const position = scrolled + screenHeight;

  if (position >= threshold) {
    await onLoadMoreClick();
  }
  onSearchClick();
}

;(() => {
  window.addEventListener('scroll', throttle((checkPosition), 250));
  window.addEventListener('resize', throttle((checkPosition),250));
})()
