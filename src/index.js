import PixabayApi from './js/pixabay-api';
import createMarkupGallery from './js/gallery-markup';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});

// let infScroll = new InfiniteScroll(elem, {
//   // options
//   // path: '.pagination__next',
//   // append: '.post',
//   // history: false,
// });


const refs = {
  searchForm: document.getElementById('search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  wrapOfGallery: document.querySelector('.gallery'),
};
const pixabayApi = new PixabayApi();

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.loadMoreBtn.disabled= true;

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
  smoothScroll();
  // infScroll();

 
  if (
    Math.round(searchApi.data.totalHits / pixabayApi.per_page) ===
    pixabayApi.page
  ) {
    
     Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
     );
    refs.loadMoreBtn.disabled = true;
  }
  //  appendGalleryMarkup(resultApi);
  return renderMoreImages;
}

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

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
