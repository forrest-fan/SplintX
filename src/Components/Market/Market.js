import React from 'react';
import './Market.css';
import MarketFilter from './MarketFilter/MarketFilter';
import MarketList from './MarketList/MarketList';
import $ from 'jquery';

var allCards = [];
var distinctCards = [];

class Market extends React.Component {
	constructor(props) {
		super(props);
		
        //console.log("cards: " + cards);
		this.state = {
			filters: {
				search: [''],
				gold: false,
				type: [],
				rarity: [],
				edition: [],
				element: []
			},
			filterCount: 0,
			cards: [],
			mobileFilters: false,
			loading: true
		};
		this.updateFilters = this.updateFilters.bind(this);
		this.updateSort = this.updateSort.bind(this);
		this.showMobileFilters = this.showMobileFilters.bind(this);
		this.hideMobileFilters = this.hideMobileFilters.bind(this);
	}

	updateFilters(filter, category, action) {
		let filters = this.state.filters;
		let filterCount = this.state.filterCount;
		if (category === 'search') {
			filters.search[0] = filter;
		} else if (category === 'gold') {
			filters.gold = filters.gold ? false : true;
			filterCount = filters.gold ? filterCount + 1 : filterCount - 1;
		} else {
			if (action === 'add') {
				filters[category].push(filter);
				filterCount++;
			} else if (action === 'remove') {
				for (let i = 0; i < filters[category].length; i++) {
					if (filters[category][i] === filter) {
						filters[category].splice(i, 1);
					}
				}
				filterCount--;
			} else {
				filters = {
					search: [''],
					gold: false,
					type: [],
					rarity: [],
					edition: [],
					element: []
				};
				filterCount = 0;
			}
		}

		let cards = [];
		allCards.map(card => {
			let rarityPass = true;
			let editionPass = true;
			let elementPass = true;
			let searchPass = true;
			let goldPass = true;
			let typePass = true;
			let rarityFilters = filters.rarity;
			let editionFilters = filters.edition;
			let elementFilters = filters.element;
			let searchFilter = filters.search[0];
			let goldFilter = filters.gold;
			let typeFilter = filters.type;
			if (rarityFilters.length !== 0 && !rarityFilters.includes(card.rarity)) {
				rarityPass = false;
			}

			if (editionFilters.length !== 0 && !editionFilters.includes(card.edition)) {
				editionPass = false;
			}

			if (elementFilters.length !== 0 && !elementFilters.includes(card.element)) {
				elementPass = false;
			}

			if (searchFilter.length !== 0 && card.name.toLowerCase().indexOf(searchFilter.toLowerCase()) === -1) {
				searchPass = false;
			}

			if (goldFilter && !card.gold) {
				goldPass = false;
			}

			if (typeFilter.length !== 0 && !typeFilter.includes(card.type)) {
				typePass = false;
			}

			if (rarityPass && editionPass && elementPass && searchPass && goldPass && typePass) {
				cards.push(card);
			}
		});

		this.setState({
			filters: filters,
			filterCount: filterCount,
			cards: cards
		});
	}

	updateSort(method) {
		let cards = this.state.cards;
		if (method === 'az') {
			cards.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else {
					return 1;
				}
			})
		} else if (method === 'za') {
			cards.sort((a, b) => {
				if (a.name < b.name) {
					return 1;
				} else {
					return -1;
				}
			})
		} else if (method === 'manaAsc') {
			cards.sort((a, b) => {
				return a.mana - b.mana;
			})
		} else if (method === 'manaDes') {
			cards.sort((a, b) => {
				return b.mana - a.mana;
			})
		}

		this.setState({cards: cards});
	}

	showMobileFilters() {
		this.setState({mobileFilters: true});
	}

	hideMobileFilters() {
		this.setState({mobileFilters: false});
	}

	componentDidMount() {
		$.ajax({
			type: 'GET',
			url: 'https://game-api.splinterlands.com/cards/get_details',
			jsonpCallback: 'testing',
			dataType: 'json',
			success: function(cardDetails) {
				let cards = [];
				$.ajax({
					type: 'GET',
		  			url: "https://game-api.splinterlands.com/market/for_sale_grouped",
		  			jsonpCallback: 'testing',
		  			dataType: 'json',
					success: function(forSaleCards) {
						for(var l = 0; l < forSaleCards.length; l++) {
						    var detailID = forSaleCards[l].card_detail_id;
				            let cardData = cardDetails[detailID - 1];
				          	let gold = forSaleCards[l].gold;
				          	let edition = forSaleCards[l].edition === 0 ? 'Alpha' : forSaleCards[l].edition === 1 ? 'Beta' : forSaleCards[l].edition === 3 ? 'Reward' : forSaleCards[l].edition === 4 ? 'Untamed' : 'Promo';
				          	let distinctID = gold ? 'G' : 'C' + forSaleCards[l].edition + detailID;
				          	let name = cardData.name;
				          	let type = cardData.type;
				          	let rarity = cardData.rarity === 1 ? 'Common' : cardData.rarity === 2 ? 'Rare' : cardData.rarity === 3 ? 'Epic' : 'Legendary';
				          	let element = cardData.color === 'Red' ? 'Fire' : cardData.color === 'Blue' ? 'Water' : cardData.color === 'Green' ? 'Earth' : cardData.color === 'White' ? 'Life' : cardData.color === 'Black' ? 'Death' : cardData.color === 'Gold' ? 'Dragon' : 'Neutral';
				          	let lvl = 1;
				          	let qty = forSaleCards[l].qty;
				          	let img = 'https://d36mxiodymuqjm.cloudfront.net/cards_by_level/' + edition.toLowerCase() + '/' + name.replace(' ', '%20') + '_lv1';
				          	img += gold ? '_gold.png' : '.png';
			            	cards.push({
			              		name: name,
			              		rarity: rarity,
				              	edition: edition,
				              	element: element,
				              	type: type,
				              	detailID: detailID,
				              	distinctID: distinctID,
				              	gold: gold,
				              	img: img,
				              	mana: cardData.stats.mana[0],
				              	qty: qty
				          	});
					    }
						this.setState({
							cards: cards,
							loading: false
						});
		        		allCards = cards;
					}.bind(this),
					error: function(e) {
		      			console.log('There was an error retrieving your cards.');
		  			}
				});
			}.bind(this),
			error: function(e) {
				console.log('There was an error retrieving the card details');
			}
		});
	}

	render() {
	    return(
	      	<div id='market'>
				<div className='market-header'>
					<h2>Market</h2>
					<hr />
				</div>
				<div className='market-container'>
					<MarketFilter updateFilters={this.updateFilters} mobileFilters={this.state.mobileFilters} hideMobileFilters={this.hideMobileFilters}/>
					<MarketList cards={this.state.cards} loading={this.state.loading} updateSort={this.updateSort} filterCount={this.state.filterCount} showMobileFilters={this.showMobileFilters}/>
				</div>
			</div>
	    );
	}
}

export default Market;