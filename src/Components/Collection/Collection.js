import React from 'react';
import './Collection.css';
import CollectionFilter from './CollectionFilter/CollectionFilter';
import CollectionList from './CollectionList/CollectionList';
import $ from 'jquery';

//const cardIDs = ['C4-182-PPIL8I33XC', 'C3-217-WOC46R14KW', 'C1-1-C0KFFOTWSW', 'C1-1-BSOGK0WS3K'];
var allCards = [];
var cards = [];
var distinctCards = [];
const lvlXP = [[20,60,160,360,760,1560,2560,4560,7560],[100,300,700,1500,2500,4500,8500],[250,750,1750,3750,7750],[1000,3000,7000]];
const newLvlXP = [[1,5,14,30,60,100,150,220,300,400],[1,5,14,25,40,60,85,115],[1,4,10,20,32,46],[1,3,6,11]];


class Collection extends React.Component {
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
			loading: this.props.loggedIn
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
		if (this.props.loggedIn) {
			$.ajax({
				type: 'GET',
				url: 'https://game-api.splinterlands.io/cards/get_details',
				jsonpCallback: 'testing',
				dataType: 'json',
				success: function(cardDetails) {
					$.ajax({
						type: 'GET',
			  			url: "https://game-api.splinterlands.com/cards/collection/" + localStorage.getItem('username'),
			  			jsonpCallback: 'testing',
			  			dataType: 'json',
						success: function(Eelement) { 
							for(var l = 0; l < Eelement.cards.length; ++l) {
							    var detailID = Eelement.cards[l].card_detail_id;
					            let cardData = cardDetails[detailID - 1];
					          	let gold = Eelement.cards[l].gold;
					          	let edition = Eelement.cards[l].edition === 0 ? 'Alpha' : Eelement.cards[l].edition === 1 ? 'Beta' : Eelement.cards[l].edition === 3 ? 'Reward' : Eelement.cards[l].edition === 4 ? 'Untamed' : 'Promo';
					          	let distinctID = (gold ? 'G' : 'C') + (edition === 'Alpha' ? 'A' : edition === 'Beta' ? 'B' : edition === 'Reward' ? 'R' : edition === 'Untamed' ? 'U' : 'P') + detailID;
					          	let name = cardData.name;
					          	let type = cardData.type;
					          	let rarity = cardData.rarity === 1 ? 'Common' : cardData.rarity === 2 ? 'Rare' : cardData.rarity === 3 ? 'Epic' : 'Legendary';
					          	let element = cardData.color === 'Red' ? 'Fire' : cardData.color === 'Blue' ? 'Water' : cardData.color === 'Green' ? 'Earth' : cardData.color === 'White' ? 'Life' : cardData.color === 'Black' ? 'Death' : cardData.color === 'Gold' ? 'Dragon' : 'Neutral';
					          	let xp = Eelement.cards[l].xp;
					          	let lvl = 1;
								let xpRates = edition === 'Untamed' || (edition === 'Reward' && detailID >= 225) ? newLvlXP : lvlXP;
								let increment = edition === 'Untamed' || (edition === 'Reward' && detailID >= 225) ? 1 : 2;
								for (let i = xpRates[cardData.rarity - 1].length - 1; i >= 0; i--) {
					          		if (xp >= xpRates[cardData.rarity - 1][i]) {
					          			lvl = i + increment;
					          			break;
					          		}
					          	}
					          	let img = 'https://d36mxiodymuqjm.cloudfront.net/cards_by_level/' + edition.toLowerCase() + '/' + name.replace(' ', '%20') + '_lv' + lvl;
					          	img += gold ? '_gold.png' : '.png';
					          	if (distinctCards.includes(distinctID)) {
					            	for (let i = 0; i < cards.length; i++) {
					            		let card = cards[i];
					              		if (card.distinctID === distinctID) {
				                			card.gold = card.gold || gold;
				                			card.count += 1;
				                			card.lvlHigh = lvl > card.lvlHigh ? lvl : card.lvlHigh;
				                			card.lvlCount[lvl - 1] += 1;
				                			card.img = 'https://d36mxiodymuqjm.cloudfront.net/cards_by_level/' + edition.toLowerCase() + '/' + name.replace(' ', '%20') + '_lv' + card.lvlHigh;
				          					card.img += card.gold ? '_gold.png' : '.png';
				          					card.mana = type === 'Monster' ? cardData.stats.mana[card.lvlHigh - 1] || 0 : cardData.stats.mana;
						              		card.hp = (cardData.stats.health[card.lvlHigh - 1] + cardData.stats.armor[card.lvlHigh - 1]) || 0;
						              		card.speed = cardData.stats.speed[card.lvlHigh - 1] || 0;
						              		cards[i] = card;
						              		break;
				              			}
				           			}	
					         	} else {
					         		let lvlCount = [];
					         		for (let i = 0; i < lvlXP[cardData.rarity - 1].length + 1; i++) {
					         			lvlCount.push(0);
					         		}
					         		lvlCount[lvl - 1] += 1;
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
						              	count: 1,
						              	lvlHigh: lvl,
						              	lvlCount: lvlCount,
						              	mana: type === 'Monster' ? cardData.stats.mana[lvl - 1] || 0 : cardData.stats.mana,
						              	hp: (cardData.stats.health[lvl - 1] + cardData.stats.armor[lvl - 1]) || 0,
						              	speed: cardData.stats.speed[lvl - 1] || 0
									 						//attack: cardData.stats.attack[cardData.stats.attack.length - 1] !== 0 ? cardData.stats.attack[cardData.stats.attack.length - 1] : cardData.stats.ranged[cardData.stats.ranged.length - 1] !== 0 ? cardData.stats.ranged[cardData.stats.ranged.length - 1] : cardData.stats.magic[cardData.stats.magic.length - 1] !== 0 ? cardData.stats.magic[cardData.stats.magic.length - 1] !== 0
									});
				            		distinctCards.push(distinctID);
					        	}
						    }
			        		allCards = cards;
							this.setState({
								cards: cards,
								loading: false
							});
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
	}

	componentDidUpdate(prevProps) {
		if (this.props.loggedIn !== prevProps.loggedIn) {
			if (this.props.loggedIn) {
				$.ajax({
					type: 'GET',
					url: 'https://game-api.splinterlands.io/cards/get_details',
					jsonpCallback: 'testing',
					dataType: 'json',
					success: function(cardDetails) {
						$.ajax({
							type: 'GET',
				  			url: "https://game-api.splinterlands.com/cards/collection/" + localStorage.getItem('username'),
				  			jsonpCallback: 'testing',
				  			dataType: 'json',
							success: function(Eelement) { 
								for(var l = 0; l < Eelement.cards.length; ++l) {
								    var detailID = Eelement.cards[l].card_detail_id;
						            let cardData = cardDetails[detailID - 1];
						          	let gold = Eelement.cards[l].gold;
						          	let edition = Eelement.cards[l].edition === 0 ? 'Alpha' : Eelement.cards[l].edition === 1 ? 'Beta' : Eelement.cards[l].edition === 3 ? 'Reward' : Eelement.cards[l].edition === 4 ? 'Untamed' : 'Promo';
						          	let distinctID = (gold ? 'G' : 'C') + (edition === 'Alpha' ? 'A' : edition === 'Beta' ? 'B' : edition === 'Reward' ? 'R' : edition === 'Untamed' ? 'U' : 'P') + detailID;
						          	let name = cardData.name;
						          	let type = cardData.type;
						          	let rarity = cardData.rarity === 1 ? 'Common' : cardData.rarity === 2 ? 'Rare' : cardData.rarity === 3 ? 'Epic' : 'Legendary';
						          	let element = cardData.color === 'Red' ? 'Fire' : cardData.color === 'Blue' ? 'Water' : cardData.color === 'Green' ? 'Earth' : cardData.color === 'White' ? 'Life' : cardData.color === 'Black' ? 'Death' : cardData.color === 'Gold' ? 'Dragon' : 'Neutral';
						          	let xp = Eelement.cards[l].xp;
						          	let lvl = 1;
									let xpRates = edition === 'Untamed' || (edition === 'Reward' && detailID >= 225) ? newLvlXP : lvlXP;
									let increment = edition === 'Untamed' || (edition === 'Reward' && detailID >= 225) ? 1 : 2;
									for (let i = xpRates[cardData.rarity - 1].length - 1; i >= 0; i--) {
						          		if (xp >= xpRates[cardData.rarity - 1][i]) {
						          			lvl = i + increment;
						          			break;
						          		}
						          	}
						          	let img = 'https://d36mxiodymuqjm.cloudfront.net/cards_by_level/' + edition.toLowerCase() + '/' + name.replace(' ', '%20') + '_lv' + lvl;
						          	img += gold ? '_gold.png' : '.png';
						          	if (distinctCards.includes(distinctID)) {
						            	for (let i = 0; i < cards.length; i++) {
						            		let card = cards[i];
						              		if (card.distinctID === distinctID) {
					                			card.gold = card.gold || gold;
					                			card.count += 1;
					                			card.lvlHigh = lvl > card.lvlHigh ? lvl : card.lvlHigh;
					                			card.lvlCount[lvl - 1] += 1;
					                			card.img = 'https://d36mxiodymuqjm.cloudfront.net/cards_by_level/' + edition.toLowerCase() + '/' + name.replace(' ', '%20') + '_lv' + card.lvlHigh;
					          					card.img += card.gold ? '_gold.png' : '.png';
					          					card.mana = type === 'Monster' ? cardData.stats.mana[card.lvlHigh - 1] || 0 : cardData.stats.mana;
							              		card.hp = (cardData.stats.health[card.lvlHigh - 1] + cardData.stats.armor[card.lvlHigh - 1]) || 0;
							              		card.speed = cardData.stats.speed[card.lvlHigh - 1] || 0;
							              		cards[i] = card;
							              		break;
					              			}
					           			}	
						         	} else {
						         		let lvlCount = [];
						         		for (let i = 0; i < lvlXP[cardData.rarity - 1].length + 1; i++) {
						         			lvlCount.push(0);
						         		}
						         		lvlCount[lvl - 1] += 1;
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
							              	count: 1,
							              	lvlHigh: lvl,
							              	lvlCount: lvlCount,
							              	mana: type === 'Monster' ? cardData.stats.mana[lvl - 1] || 0 : cardData.stats.mana,
							              	hp: (cardData.stats.health[lvl - 1] + cardData.stats.armor[lvl - 1]) || 0,
							              	speed: cardData.stats.speed[lvl - 1] || 0
										 						//attack: cardData.stats.attack[cardData.stats.attack.length - 1] !== 0 ? cardData.stats.attack[cardData.stats.attack.length - 1] : cardData.stats.ranged[cardData.stats.ranged.length - 1] !== 0 ? cardData.stats.ranged[cardData.stats.ranged.length - 1] : cardData.stats.magic[cardData.stats.magic.length - 1] !== 0 ? cardData.stats.magic[cardData.stats.magic.length - 1] !== 0
										});
					            		distinctCards.push(distinctID);
						        	}
							    }
				        		allCards = cards;
								this.setState({
									cards: cards,
									loading: false
								});
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
			} else {
				allCards = [];
				cards = [];
				distinctCards = [];
				this.setState({cards: []});
			}
		}
	}

	render() {
		return (
			<div id='collection'>
				<div className='collection-header'>
					<h2>My Collection</h2>
					<hr />
				</div>
				<div className='collection-container'>
					<CollectionFilter updateFilters={this.updateFilters} mobileFilters={this.state.mobileFilters} hideMobileFilters={this.hideMobileFilters}/>
					{this.props.loggedIn ?
						<CollectionList cards={this.state.cards} loading={this.state.loading} updateSort={this.updateSort} filterCount={this.state.filterCount} showMobileFilters={this.showMobileFilters}/> :
						<div className='collection-login-prompt'>Please log in to see your cards.</div> }
				</div>
			</div>
		);
	}
}
export default Collection;


