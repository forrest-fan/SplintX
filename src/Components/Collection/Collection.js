import React from 'react';
import './Collection.css';
import CollectionFilter from './CollectionFilter/CollectionFilter';
import CollectionList from './CollectionList/CollectionList';
import $ from 'jquery';

//const cardIDs = ['C4-182-PPIL8I33XC', 'C3-217-WOC46R14KW', 'C1-1-C0KFFOTWSW', 'C1-1-BSOGK0WS3K'];
var allCards = [];
const combineRate = [[1,5,14,30,60,100,150,220,300,400],[1,5,14,25,40,60,85,115],[1,4,10,20,32,46],[1,3,6,11]];
const combineRateGold = [[0,0,1,2,5,9,14,20,27,38],[0,1,2,4,7,11,16,22],[0,1,2,4,7,10],[0,1,2,4]];


class Collection extends React.Component {
	constructor(props) {
		super(props);
		
        //console.log("cards: " + cards);
		this.state = {
			filters: {
				search: [''],
				foil: [],
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
		this.getBCX = this.getBCX.bind(this);
		this.getCollection = this.getCollection.bind(this);
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
			let foilPass = true;
			let typePass = true;
			let rarityFilters = filters.rarity;
			let editionFilters = filters.edition;
			let elementFilters = filters.element;
			let searchFilter = filters.search[0];
			let foilFilters = filters.foil;
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

			if (foilFilters.length === 1) {
				if (foilFilters[0] === 'Regular' && card.gold || foilFilters[0] === 'Gold' && !card.gold) {
					foilPass = false;
				}
			}

			if (typeFilter.length !== 0 && !typeFilter.includes(card.type)) {
				typePass = false;
			}

			if (rarityPass && editionPass && elementPass && searchPass && foilPass && typePass) {
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
		} else if (method === 'splinter') {
		    cards.sort((a, b) => {
		    	if (a.element < b.element) {
		    		return -1;
		    	} else if (a.element > b.element) {
		    		return 1;
		    	} else {
		    		if (a.gold) {
		    			return -1;
		    		} else {
		    			return 1;
		    		}
		    	}
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

	getBCX(xp, edition, rarity, detailID, gold) {
		if (xp === 0) {
			return 1;
		} else if (edition === 4 || (edition === 1 && detailID > 223)) {
			return xp;
		}

		let alpha_xp = [20,100,250,1000];
		let alpha_gold_xp = [250,500,1000,2500];
		let beta_xp = [15,75,175,750];
		let beta_gold_xp = [200,400,800,2000];
		
		if (edition === 0) {
			if (gold) {
				return Math.floor(xp / alpha_gold_xp[rarity - 1]);
			} else {
				return Math.floor(1 + (xp / alpha_xp[rarity - 1]));
			}
		} else {
			if (gold) {
				return Math.floor(xp / beta_gold_xp[rarity - 1]);
			} else {
				return Math.floor(1 + (xp / beta_xp[rarity - 1]));
			}
		}
	}

	getCollection() {
		let forSaleGrouped = JSON.parse(sessionStorage.getItem('forSaleGrouped')).data;
		let cards = [];
		let distinctCards = [];
		$.ajax({
			type: 'GET',
  			url: "https://game-api.splinterlands.com/cards/collection/" + localStorage.getItem('username'),
  			jsonpCallback: 'testing',
  			dataType: 'json',
			success: function(Eelement) { 
				for(var l = 0; l < Eelement.cards.length; ++l) {
				    var detailID = Eelement.cards[l].card_detail_id;
		            let cardData = this.props.cardDetails[detailID - 1];
		          	let gold = Eelement.cards[l].gold;
		          	let edition = Eelement.cards[l].edition === 0 ? 'Alpha' : Eelement.cards[l].edition === 1 ? 'Beta' : Eelement.cards[l].edition === 3 ? 'Reward' : Eelement.cards[l].edition === 4 ? 'Untamed' : 'Promo';
		          	let distinctID = (gold ? 'G' : 'C') + (edition === 'Alpha' ? 'A' : edition === 'Beta' ? 'B' : edition === 'Reward' ? 'R' : edition === 'Untamed' ? 'U' : 'P') + detailID;
		          	let name = cardData.name;
		          	let type = cardData.type;
		          	let rarity = cardData.rarity === 1 ? 'Common' : cardData.rarity === 2 ? 'Rare' : cardData.rarity === 3 ? 'Epic' : 'Legendary';
		          	let element = cardData.color === 'Red' ? 'Fire' : cardData.color === 'Blue' ? 'Water' : cardData.color === 'Green' ? 'Earth' : cardData.color === 'White' ? 'Life' : cardData.color === 'Black' ? 'Death' : cardData.color === 'Gold' ? 'Dragon' : 'Neutral';
					let lowPriceBCX = 0;
					for (let i = 0; i < forSaleGrouped.length; i++) {
						if (forSaleGrouped[i].detailID === detailID && forSaleGrouped[i].gold === gold && forSaleGrouped[i].edition === edition) {
							lowPriceBCX = forSaleGrouped[i].lowPriceBCX;
						}
					}
		          	let xp = Eelement.cards[l].xp;
		          	let lvl = 0;
					let xpRates = gold ? combineRateGold[cardData.rarity - 1] : combineRate[cardData.rarity - 1];
					let bcx = this.getBCX(Eelement.cards[l].xp, Eelement.cards[l].edition, cardData.rarity, detailID, gold);
		          	for (let i = 0; i < xpRates.length; i++) {
						if (bcx >= xpRates[i]) {
							lvl++;
						} else {
							break;
						}
					}
		          	let img = 'https://d36mxiodymuqjm.cloudfront.net/cards_by_level/' + edition.toLowerCase() + '/' + name.replace(' ', '%20') + '_lv' + lvl;
		          	img += gold ? '_gold.png' : '.png';
		          	let attackType = type === 'Monster' && cardData.stats.attack[cardData.stats.attack.length - 1] !== 0 ? 'attack' : type === 'Monster' && cardData.stats.ranged[cardData.stats.ranged.length - 1] !== 0 ? 'ranged' : type === 'Monster' && cardData.stats.magic[cardData.stats.magic.length - 1] !== 0 ? 'magic' : 'none';
		          	if (distinctCards.includes(distinctID)) {
		            	for (let i = 0; i < cards.length; i++) {
		            		let card = cards[i];
		              		if (card.distinctID === distinctID) {
	                			card.count += 1;
	                			card.lvlHigh = lvl > card.lvlHigh ? lvl : card.lvlHigh;
	                			card.img = 'https://d36mxiodymuqjm.cloudfront.net/cards_by_level/' + edition.toLowerCase() + '/' + name.replace(' ', '%20') + '_lv' + card.lvlHigh;
	          					card.img += card.gold ? '_gold.png' : '.png';
	          					card.mana = type === 'Monster' ? cardData.stats.mana[card.lvlHigh - 1] || 0 : cardData.stats.mana;
	          					card.totalBCX += bcx;
	          					card.cards.push({
	          						lvl: lvl,
					          		uid: Eelement.cards[l].uid,
				          			xp: Eelement.cards[l].xp,
					          		bcx: bcx
	          					});
			              		cards[i] = card;
			              		break;
	              			}
	           			}	
		         	} else {
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
			              	tier: cardData.tier,
			              	count: 1,
			              	lvlHigh: lvl,
			              	mana: type === 'Monster' ? cardData.stats.mana[lvl - 1] || 0 : cardData.stats.mana,
			              	stats: cardData.stats,
			              	attackType: attackType,
			              	totalBCX: bcx,
			              	lowPriceBCX: lowPriceBCX,
			              	cards: [{
				          		lvl: lvl,
				          		uid: Eelement.cards[l].uid,
				          		xp: Eelement.cards[l].xp,
				          		bcx: bcx
				          	}]
						});
	            		distinctCards.push(distinctID);
		        	}
			    }
			    cards.sort((a, b) => {
			    	if (a.element < b.element) {
			    		return -1;
			    	} else if (a.element > b.element) {
			    		return 1;
			    	} else {
			    		if (a.gold) {
			    			return -1;
			    		} else {
			    			return 1;
			    		}
			    	}
			    });
        		allCards = cards;
				this.updateFilters('Untamed', 'edition', 'add');
			}.bind(this),
			error: function(e) {
      			console.log('There was an error retrieving your cards.');
  			}
		});
	}

	componentDidMount() {
		if (this.props.loggedIn) {

			this.getCollection();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.loggedIn !== prevProps.loggedIn) {
			if (this.props.loggedIn) {
				this.getCollection();
			} else {
				allCards = [];
				let cards = [];
				let distinctCards = [];
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


