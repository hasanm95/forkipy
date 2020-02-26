import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
	elements.searchInput.value = '';
}

export const clearResults = () => {
	elements.resultList.innerHTML = '';
	elements.resultPages.innerHTML = '';
}

export const highlightSelected = id => {
	const resArr = Array.from(document.querySelectorAll('.results__link'));
	resArr.forEach(el => {
		el.classList.remove('results__link--active');
	});
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}


export const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if(title.length > limit){
		title.split(' ').reduce((acc, cur) => {
			if(acc + cur.length <= limit){
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);
		return `${newTitle.join(' ')} ...`;
	}
	return title;
}


const renderRecipe = recipe => {
	const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
	`;
	elements.resultList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => 
	`<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
	    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
	    <svg class="search__icon">
	        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
	    </svg>
	</button>`;



const renderButtons = (numResults, page, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage);
	let button;
	if(page === 1 && pages > 1){
		// Only Button to go Next Page
		button = createButton(page, 'next');
	} else if(page === 2){
		// Both Buttons
		button = `
			${createButton(page, 'prev')}
			${createButton(page, 'next')}
		`;
	}else if(page == page && pages > 1){
		// Only button to go previous page
		button = createButton(page, 'prev');
	}
	elements.resultPages.insertAdjacentHTML('afterbegin', button);
};


export const renderResults = (result, page = 1, resPerPage = 10) => {
	// Render Search Results of Current Page
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;
	result.slice(start, end).forEach(renderRecipe);

	// Render Pagination Buttons
	renderButtons(result.length, page, resPerPage);
};


















