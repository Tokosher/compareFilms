const autoCompleteConfig = {
    renderOption(films) {
        let img = films.Poster === 'N/A' ? '' : films.Poster;

        return `
            <img src="${img}" />
            ${films.Title} (${films.Year})
        `
    },

    inputValue(movie) {
        return movie.Title
    },

    async getData(val) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '727a9df2',
                s: val
            }
        });

        if (response.data.Error) return [];
        return response.data.Search;
    }
};

createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('.right-autocomplete'),
    optionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovik(movie, document.querySelector('.right-summary'), 'right');
    },
});

createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('.left-autocomplete'),
    optionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovik(movie, document.querySelector('.left-summary') , 'left');
    },
});

let rightMovie;
let leftMovie;
const  onMovik = async (e, elem, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '727a9df2',
            i: e.imdbID
        }
    });

    side === 'right' ? rightMovie =  response.data: leftMovie = response.data;

    elem.innerHTML = movikText(response.data);

    rightMovie && leftMovie ? runColor(elem) : true;

};

runColor = (elem) => {

    const leftSide = document.querySelectorAll('.left-summary .notification');
    const rightSide = document.querySelectorAll('.right-summary .notification');

    leftSide.forEach((leftStat, index) => {
        const rightStat = rightSide[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if(rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }


    })

};



const movikText = (val) => {
    const dollars = parseInt(val.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = +val.Metascore;
    const IMDBRating = +val.imdbRating;
    const IMDBVotes = parseFloat(val.imdbVotes.replace(/,/g, ''));

    const awards = val.Awards.split(' ').reduce( (accum, val) => {

        const value = parseInt(val);

        if (isNaN(value)) {return accum;}
            else return accum + value;
    }, 0);

    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${val.Poster}" alt="">
                
            </p>
        </figure>
        <div class="media-content">
        <div class="content">
        <h1>${val.Title}</h1>
        <h4>${val.Genre}</h4>
        <p>${val.Plot}</p>
</div>
</div>
     </article>
     <article data-value="${awards}" class="notification   is-primary">
        <p class="title">${val.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification   is-primary">
        <p class="title">${val.BoxOffice}</p>
        <p class="subtitle">Box office</p>
    </article>
    <article data-value="${metascore}" class="notification   is-primary">
        <p class="title">${val.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${IMDBRating}"  class="notification   is-primary">
        <p class="title">${val.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${IMDBVotes}" class="notification   is-primary">
        <p class="title">${val.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    
    `
};



