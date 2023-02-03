export default class PixabayApi {
  #API_KEY = '30924994-a957df5e0c4e2063d1e50072c';
  BASE_URL = 'https://pixabay.com/api/';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.total = null;
    this.per_page = 100;
  }

  fetchGallery() {
    const url = `https://pixabay.com/api/?key=30924994-a957df5e0c4e2063d1e50072c&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;
    return fetch(url)
      .then(r => r.json())
      .then(data => {
        this.page += 1;
        this.total = data.totalHits;
        console.log(this.total);

        return data.hits;
      });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  totalHits() {
    return this.total;
  }

  endOfCollection() {
    const end = Math.round(this.total / this.per_page === this.page);
    console.log(end);
    return end;
  }
}

// const API_KEY = '30924994-a957df5e0c4e2063d1e50072c';
// const BASE_URL = "https://pixabay.com/api/";

// const options = {
//   headers: {
//     key: API_KEY,
//   },
// };
