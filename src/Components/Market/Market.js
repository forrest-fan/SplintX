import React from 'react';
import './Market.css';
import MarketFilter from './MarketFilter/MarketFilter';
import MarketList from './MarketList/MarketList';
import MarketCart from './MarketCart/MarketCart';
import $ from 'jquery';

class Market extends React.Component {
	constructor(props) {
		super(props);
		if (!localStorage.getItem('cart')) {
			localStorage.setItem('cart', JSON.stringify([]));
		}
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
			loading: true,
			cart: JSON.parse(localStorage.getItem('cart')),
			renderCart: false
		};
		this.updateFilters = this.updateFilters.bind(this);
		this.updateSort = this.updateSort.bind(this);
		this.showMobileFilters = this.showMobileFilters.bind(this);
		this.hideMobileFilters = this.hideMobileFilters.bind(this);
		this.addToCart = this.addToCart.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.toggleCart = this.toggleCart.bind(this);
		this.clearCart = this.clearCart.bind(this);
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
		let allCards = JSON.parse(sessionStorage.getItem('forSaleGrouped')).data;
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
			cards: cards,
			loading: false
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
			});
		} else if (method === 'za') {
			cards.sort((a, b) => {
				if (a.name < b.name) {
					return 1;
				} else {
					return -1;
				}
			});
		} else if (method === 'manaAsc') {
			cards.sort((a, b) => {
				return Number(a.mana) - Number(b.mana);
			});
		} else if (method === 'manaDes') {
			cards.sort((a, b) => {
				return Number(b.mana) - Number(a.mana);
			});
		} else if (method === 'priceAsc') {
			cards.sort((a, b) => {
				return a.lowPrice - b.lowPrice;
			});
		} else if (method === 'priceDec') {
			cards.sort((a, b) => {
				return b.lowPrice - a.lowPrice;
			}); 
		}

		this.setState({cards: cards});
	}

	showMobileFilters() {
		this.setState({mobileFilters: true});
	}

	hideMobileFilters() {
		this.setState({mobileFilters: false});
	}

	addToCart(selectedCardsArr) {
		let newCart = this.state.cart.concat(selectedCardsArr)
		localStorage.setItem('cart', JSON.stringify(newCart));
		this.setState({
			cart: newCart
		})
	}

	removeItem(item) {
		let cart = this.state.cart;
		for (let i = 0; i < cart.length; i++) {
			if (item.uid === cart[i].uid) {
				cart.splice(i, 1);
			}
		}
		localStorage.setItem('cart', JSON.stringify(cart));
		this.setState({
			cart: cart
		})
	}

	clearCart() {
		let cart = [];
		localStorage.setItem('cart', JSON.stringify(cart));
		this.setState({
			cart: cart
		});
	}

	toggleCart() {
		this.setState({
			renderCart: this.state.renderCart ? false : true
		});
	}

	componentDidMount() {
		if (!sessionStorage.getItem('forSaleGrouped') && JSON.parse(sessionStorage.getItem('forSaleGrouped')).expiry < (new Date())) {
			let cards = [];
			$.ajax({
				type: 'GET',
	  			url: "https://game-api.splinterlands.com/market/for_sale_grouped",
	  			jsonpCallback: 'testing',
	  			dataType: 'json',
				success: function(forSaleCards) {
					for(var l = 0; l < forSaleCards.length; l++) {
					    var detailID = forSaleCards[l].card_detail_id;
			            let cardData = this.props.cardDetails[detailID - 1];
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
			          	let attackType = type === 'Monster' && cardData.stats.attack[cardData.stats.attack.length - 1] !== 0 ? 'attack' : type === 'Monster' && cardData.stats.ranged[cardData.stats.ranged.length - 1] !== 0 ? 'ranged' : type === 'Monster' && cardData.stats.magic[cardData.stats.magic.length - 1] !== 0 ? 'magic' : 'none';
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
			              	mana: type === 'Monster' ? cardData.stats.mana[0] : cardData.stats.mana,
			              	qty: qty,
			              	lowPrice: forSaleCards[l].low_price,
			              	lowPriceBCX: forSaleCards[l].low_price_bcx,
			              	stats: cardData.stats,
			              	attackType: attackType
			          	});
				    }
				    cards.sort((a, b) => {
				    	if (a.element < b.element) {
				    		return -1;
				    	} else if (a.element > b.element) {
				    		return 1;
				    	} else {
				    		if (a.gold) {
				    			return 1;
				    		} else {
				    			return -1;
				    		}
				    	}
				    });
				    let expiry = new Date();
					expiry.setDate(expiry.getDate() + 3);
					expiry.setUTCHours(0, 0, 0, 0);
				    let cardsObj = {
				    	expiry: expiry, 
				    	data: cards
				    }
				    sessionStorage.setItem('forSaleGrouped', JSON.stringify(cardsObj));
				    this.updateFilters('Untamed', 'edition', 'add');
				}.bind(this),
				error: function(e) {
	      			console.log('There was an error retrieving your cards.');
	  			}
			});
		} else {
			let cards = JSON.parse(sessionStorage.getItem('forSaleGrouped')).data;
			this.updateFilters('Untamed', 'edition', 'add');
		}
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
					<MarketList cart={this.state.cart} addToCart={this.addToCart} cards={this.state.cards} loading={this.state.loading} updateSort={this.updateSort} filterCount={this.state.filterCount} showMobileFilters={this.showMobileFilters}/>	
				</div>
				<div className='market-cart-btn' onClick={this.toggleCart}><i className='fas fa-shopping-cart'></i></div>
				{this.state.cart.length !== 0 ? <div className='market-cart-count'><p>{this.state.cart.length}</p></div> : ''}
				{this.state.renderCart ? <MarketCart cart={this.state.cart} removeItem={this.removeItem} closeCart={this.toggleCart} clearCart={this.clearCart}  updateBalance={this.props.updateBalance} /> : ''}
			</div>
	    );
	}
}

export default Market;