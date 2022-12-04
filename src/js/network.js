import axios from 'axios';

export default class ImageApi {

    constructor() {
        this.url = 'https://pixabay.com/api/';
        this.key = '31804426-6478c206828e4d11afeb02c6f';
        this.page = 1;
        this.limit = 40;
        this.orientation = 'horizontal';
        this.image_type = 'photo';
        this.safesearch = true;
        this.searchQuery = '';
        this.nextSearch = false;
    }
    
    async getImage() {
        const response = await axios.get(this.url,{
            params: {
                key: this.key,
                q: this.searchQuery,
                image_type: this.image_type,
                orientation: this.orientation,
                safesearch: this.safesearch,
                page: this.page,
                per_page: this.limit,
            }
        })
        this.page++;

        return response.data;
    }

    get query() {
        return this.searchQuery
    }

    set query(newQuery) {
        this.page = 1;
        this.searchQuery = newQuery;
    }
}