export const elements = {
	searchForm: document.querySelector('.search'),
	searchInput: document.querySelector('.search__field'),
	resultWrap: document.querySelector('.results'),
	resultList: document.querySelector('.results__list'),
	resultPages: document.querySelector('.results__pages'),
	recipe: document.querySelector('.recipe'),
	shoppingList: document.querySelector('.shopping__list'),
	likeMenu: document.querySelector('.likes__field'),
	likeList: document.querySelector('.likes__list')
}

const elementsString = {
	loader: 'loader'
}

export const renderLoader = parent => {
	const loader = `
		<div class="${elementsString.loader}">
			<svg>
				<use href="img/icons.svg?#icon-cw"></use>
			</svg>
		</div>
	`;
	parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
	const loader = document.querySelector(`.${elementsString.loader}`);
	if(loader) loader.parentElement.removeChild(loader);
}