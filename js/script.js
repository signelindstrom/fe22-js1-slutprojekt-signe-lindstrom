const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', getSearchUrl);

const infoDiv = document.querySelector('#search-result-div');
document.body.append(infoDiv);

const animationDiv = document.querySelector('#animation-div');
animationDiv.style.display = 'none';

const textInput = document.querySelector('#search-word-input');
const numberInput = document.querySelector('#photo-amount-input');
const searchSelect = document.querySelector('#sort-by')

// hämtar användarens info
function getSearchUrl(event) {
    event.preventDefault();

    infoDiv.innerHTML = '';
    playAnimation();

    const inputSearchWord = textInput.value;
    const searchSort = searchSelect.value;
    const inputSearchNumber = numberInput.value;

    // error-meddelande om nummer/text-inputen är tom
    if (inputSearchNumber == 0 || inputSearchWord == 0) {
        error();
    }
    else {
        fetchSearch(inputSearchWord, inputSearchNumber, searchSort);
    }
}

// skapar url:en 
function fetchSearch(searchWord, searchNumber, searchSortBy) {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=e466d95cd5cba5deb6f76e9c4362589b&text=${searchWord}&sort=${searchSortBy}&per_page=${searchNumber}&format=json&nojsoncallback=1`;

    fetch(url)
        .then(response => response.json())
        .then(getSearchInfo)
        .catch(error => {
            error();
        })
}

// skapar och hämtar bilderna
function getSearchInfo(searchData) {

    const sizeSelect = document.querySelector('#size-select');
    const searchSize = sizeSelect.value;

    // error-meddelande om inga bilder matchar sökningen
    if (searchData.photos.photo.length == 0) {
        const errorMessage = document.createElement('p');
        infoDiv.append(errorMessage);
        errorMessage.innerText = 'no images matches ur search :(';
        animationDiv.style.display = 'none';
    }

    for (let i = 0; i < searchData.photos.photo.length; i++) {
        const divCard = document.createElement('div')
        infoDiv.append(divCard)

        const img = document.createElement('img');
        divCard.append(img);
        img.src = `https://live.staticflickr.com/${searchData.photos.photo[i].server}/${searchData.photos.photo[i].id}_${searchData.photos.photo[i].secret}_${searchSize}.jpg`;

        // klickar man på bilden öppnas den i nytt fönster i användarens valda storlek
        img.addEventListener('click', linkToImg => {
            window.open(`https://live.staticflickr.com/${searchData.photos.photo[i].server}/${searchData.photos.photo[i].id}_${searchData.photos.photo[i].secret}_${searchSize}.jpg`);
        })
    }

    // tömmer input & återställer select, stoppar animationen
    textInput.value = '';
    numberInput.value = '';
    searchSelect.selectedIndex = 0;
    sizeSelect.selectedIndex = 0;
    stopAnimation();
}


// visar error-meddelande
function error() {
    const errorMessage = document.createElement('p');
    infoDiv.append(errorMessage);
    errorMessage.innerText = 'something went wrong, did u fill in all the inputs? :(';
    animationDiv.style.display = 'none';
}


// skapar animation och play/stop-funktion
const loadingAnimation = {
    targets: '#animation-div',
    duration: 500,
    direction: 'alternate',
    translateX: '50px',
    easing: 'easeInOutQuad',
    loop: true,
}
const animationPlayer = anime(loadingAnimation);

function playAnimation() {
    animationDiv.style.display = 'block';
    animationPlayer.play;
}
function stopAnimation() {
    animationPlayer.restart;
    animationPlayer.pause;
    animationDiv.style.display = 'none';
}


// när man scrollar ner 20px på sidan så visas en knapp
const getToTopBtn = document.querySelector('#scroll-to-top-btn');
window.onscroll = function () { scrollBtn() };

function scrollBtn() {
    if (document.documentElement.scrollTop > 20) {
        getToTopBtn.style.display = 'block';
    }
    else {
        getToTopBtn.style.display = 'none';
    }
}

// när man trycker på knappen scrollas sidan upp till toppen
getToTopBtn.addEventListener('click', scrollToTop)
function scrollToTop(event) {
    event.preventDefault();
    document.documentElement.scrollTop = 0;
}