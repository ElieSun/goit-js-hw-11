import ImageApi from "./network";
import { Notify } from 'notiflix';
// Описан в документации
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

const imageApi = new ImageApi();

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
}

refs.searchForm.addEventListener('submit', onSearch)
refs.loadMore.addEventListener('click', onLoadMore)
refs.loadMore.classList.add('btn-hidden');

function onSearch(e) {
    e.preventDefault();
    
    const query = e.currentTarget.elements.searchQuery.value;
    if (imageApi.query !== query) {
        clearGallery();
        imageApi.query = e.currentTarget.elements.searchQuery.value;
        imageApi.getImage().then(appendImage);
    }
}

function onLoadMore(e){
    e.preventDefault();
    imageApi.getImage().then(appendImage);
}

function appendImage(data)
{
    if (data.totalHits === 0) {
        refs.loadMore.classList.add('btn-hidden');
        return Notify.warning("Sorry, there are no images matching your search query. Please try again.");
    }
    refs.loadMore.classList.remove('btn-hidden');
    let displayInfo = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
    // ОТФОРМАТИРОВАТЬ HTML 
       `<a href="${largeImageURL}" target="_blank">
            <div class="gallery__item">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" class='gallery__image' /> 
                <div class="info">
                    <p class="info-item">
                        <b>Likes:</b> ${likes}<br>
                        <b>Views:</b> ${views}<br>
                        <b>Comments:</b> ${comments}<br>
                        <b>Downloads:</b> ${downloads}<br>
                    </p>
                </div>
            </div>
        </a>`).join('')

        if (imageApi.nextSearch === true)
            Notify.success(`Hooray! We found ${data.totalHits} totalHits images.`);
        else
            imageApi.nextSearch = true;

        return refs.gallery.insertAdjacentHTML('beforeend', displayInfo);
}

function clearGallery()
{
    refs.gallery.innerHTML = '';
}