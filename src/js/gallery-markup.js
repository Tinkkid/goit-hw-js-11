export default function createMarkupGallery(hits) {
  return hits
    .map(hit => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = hit;
      return `<div class="photo-card"><a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes </b>${likes}
    </p>
    <p class="info-item">
      <b>Views </b> ${views}
    </p>
    <p class="info-item">
      <b>Comments </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads </b>${downloads}
    </p>
  </div>
</div></a>`;
    })
    .join('');
}
