import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import {elements} from './views/base';
import {renderLoader} from './views/base';
import {clearLoader} from './views/base'
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';


/**Global State of APP
 * - Search Object
 * - Current Recipe Object
 * - Shopping List Object
 * - Liked Recipes 
*/
const state = {}


/**
 * Search Controller
*/

const controllSearch = async () => {
	// 1. Get Query From View
	const query = searchView.getInput();
	
	if(query){
		// 2. New Search object and add to state
		state.search = new Search(query);

		// 3. Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.resultWrap);

		try{
			// 4. Search for recipies
			await state.search.getResults();

			// 5. Render Results in UI
			clearLoader();
			searchView.renderResults(state.search.result);
		}catch(error){
			console.log(error);
		}
	}
}
elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controllSearch();
});

elements.resultPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	const gotoPage = parseInt(btn.dataset.goto, 10);
	searchView.clearResults();
	searchView.renderResults(state.search.result, gotoPage, 10);
})


/**
 * Recipe Controller
*/

const controlRecipe = async () => {
	const id = window.location.hash.replace('#', '');
	if(id){
		// Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		// Hightlight selected
		if(state.search){
			searchView.highlightSelected(id);	
		}

		// Create new recipe object
		state.recipe = new Recipe(id);

		try{
			// Get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			// Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
		}catch(error){
			console.log(error);
			alert('Something went wrong')
		}
	}
}


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * List Controller
*/

const controlList = () => {
	// Create a new list if there is no list yet
	if(!state.list) state.list = new List();

	// Add item to the list
	state.recipe.ingredients.forEach(el => {
		// Add to data model
		const item = state.list.addItem(el.count, el.unit, el.ingredient);

		// Add to UI
		listView.renderItem(item);
	});
}

/**
 * Likes Controller
*/


const controlLike = () => {

	if(!state.likes) state.likes = new Likes();

	const currentID = state.recipe.id;

	// People has NOT liked recipe yet
	if(!state.likes.isLiked(currentID)){
		// Add like to the state
		const like = state.likes.addLike(currentID, state.recipe.title, state.recipe.img, state.recipe.author);

		// toggle button
		likeView.toggleLikeBtn(true);

		// Add like to the UI
		likeView.renderLike(like)

	// People has liked recipt
	}else{
		// Remove like from the state
		state.likes.deleteLike(currentID); 

		// toggle button
		likeView.toggleLikeBtn(false);

		// Remove like from the UI
		likeView.deleteLike(currentID);
	}
	likeView.toggleLikeMenu(state.likes.getNumLikes());
}


// Handling Local Storage

window.addEventListener('load', () => {
	state.likes = new Likes();
	state.likes.readStorage();
	likeView.toggleLikeMenu(state.likes.getNumLikes());
	state.likes.likes.forEach(like => likeView.renderLike(like));
});







// Handling delete and update button of list

elements.shoppingList.addEventListener('click', e => {

	const id = e.target.closest('.shopping__item').dataset.itemid;

	if(e.target.matches('.shopping__delete, .shopping__delete *')){
		// Delete from data model
		state.list.deleteItem(id)

		// Delete from UI 
		listView.deleteItem(id);
	} else if(e.target.matches('.shopping__count-value')){
		const val = parseFloat(e.target.value, 0);
		state.list.updateCount(id, val);
	}

});


// Handling recipe button clicks

elements.recipe.addEventListener('click', e => {
	if(e.target.matches('.btn-decrease, .btn-decrease *')){
		state.recipe.updateServings('dec');
		if(state.recipe.servings > 0){
			recipeView.updateServingsAndIngredients(state.recipe);
		}
	} else if(e.target.matches('.btn-increase, .btn-increase *')){
		state.recipe.updateServings('inc');
		recipeView.updateServingsAndIngredients(state.recipe);
	} else if(e.target.matches('recipe__btn--add, .recipe__btn--add *')){
		// Add ingredient item to shopping list
		controlList();
	} else if(e.target.matches('.recipe__love, .recipe__love *')){
		// Add item like
		controlLike();
	}
});











