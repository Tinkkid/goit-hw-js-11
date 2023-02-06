import axios from 'axios';

export default class PixabayApi {
  #API_KEY = '30924994-a957df5e0c4e2063d1e50072c';
  BASE_URL = 'https://pixabay.com/api/';
 

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.total = null;
    this.per_page = 40;
  }

  async fetchGallery() {
    const options = `${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;
    this.incrementPage();

    return await axios.get(
      `${this.BASE_URL}?key=${this.#API_KEY}&q=${options}`
    );
    }
  
    // return axios.get(url,options)
    //   .then(r => r.json())
    //   .then(data => {
    //     this.page += 1;
    //     this.total = data.totalHits;
    //     console.log(this.total);
    //     return data.hits;
    //   });
  
  incrementPage() {
    this.page += 1;
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

  // endOfCollection() {
  //   const end = Math.round(this.total / this.per_page === this.page);
  //   // console.log(end);
  //   return end;
  // }
}
