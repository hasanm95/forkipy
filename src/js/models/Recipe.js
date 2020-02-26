import axios from 'axios';
import {key, proxy} from '../config'

export default class Recipe{
	constructor(id){
		this.id = id; 
	}
	async getRecipe(){
		try{
			const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
			const data = res.data.recipe;
			this.title = data.title;
			this.author = data.publisher;
			this.img = data.image_url;
			this.url = data.source_url;
			this.ingredients = data.ingredients;
		}catch(error){
			console.log(error);
			alert('Something went wrong')
		}
	}

	calcTime(){
		// Assuming that we need 15 min for each 3 ingrendients
		const numIng = this.ingredients.length;
		const periods = numIng / 3;
		this.time = periods * 15;
	}

	calcServings(){
		this.servings = 4;
	}

	parseIngredients(){
		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
		const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

		const newIngredits = this.ingredients.map((el) => {
			// 1) Uniform units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i]);
			});

			// 2) Remove Parantheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			// 3) Parse ingredients into count, unit and ingredient
			const arrIng = ingredient.split(' ');
			const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

			let objIng;
			if(unitIndex > -1){
				// There is unit
				const arrCount = arrIng.slice(0, unitIndex);

				let count;
				if(arrCount.length === 1){
					count = eval(arrIng[0].replace('-', '+')).toFixed(4);
				}else{
					count = eval(arrIng.slice(0, unitIndex).join('+')).toFixed(4);
				}
				
				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' ')
				}
			} else if(parseInt(arrIng[0], 10)){
				// There is not unit, but 1st element is number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: '',
					ingredient: arrIng.slice(1).join(' ')
				}
			} else if(unitIndex === -1){
				// There is no unit and no number
				objIng = {
					count: 1,
					unit: '',
					ingredient
				}
			}

			return objIng;
		});
		this.ingredients = newIngredits
	}

	updateServings(type){
		// Update Servings
		const newServings = type == 'dec' ? this.servings - 1 : this.servings + 1;

		// Update Ingredients
		this.ingredients.forEach(el => {
			el.count *= (newServings / this.servings);
		});

		this.servings = newServings;
	}






} 