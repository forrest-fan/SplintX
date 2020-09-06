import React from 'react';
import './MarketCardModal.css';
import $ from 'jquery';
import Chart from 'chart.js';

const combineRateU = [[1,5,14,30,60,100,150,220,300,400],[1,5,14,25,40,60,85,115],[1,4,10,20,32,46],[1,3,6,11]];
const combineRateGoldU = [[0,0,1,2,5,9,14,20,27,38],[0,1,2,4,7,11,16,22],[0,1,2,4,7,10],[0,1,2,4]];
const combineRateB = [[1,3,5,12,25,52,105,172,305,505],[1,3,5,11,21,35,61,115],[1,3,6,11,23,46],[1,3,5,11]];
const combineRateGoldB = [[0,0,0,1,2,4,8,13,23,38],[0,0,1,2,4,7,12,22],[0,0,1,3,5,10],[0,1,2,4]];
const combineRateA = [[1,2,4,9,19,39,79,129,229,379],[1,2,4,8,16,26,46,86],[1,2,4,8,16,32],[1,2,4,8]];
const combineRateGoldA = [[0,0,0,1,2,4,7,11,19,31],[0,0,1,2,3,5,9,17],[0,0,1,2,4,8],[0,1,2,3]];
const summoner = [[[1, 1, 1, 1, 0], [2, 2, 2, 1, 1], [3, 3, 2, 2, 1], [4, 4, 3, 2, 2], [5, 5, 4, 3, 2], [6, 6, 5, 4, 2], [7, 7, 6, 4, 3], [8, 8, 6, 5, 3], [9, 9, 7, 5, 4], [10, 10, 8, 6, 4]], [[1, 1, 1, 1, 1], [2, 3, 2, 2, 1], [3, 4, 3, 2, 2], [4, 5, 4, 3, 2], [5, 6, 5, 4, 3], [6, 8, 6, 5, 3], [7, 9, 7, 5, 4], [8, 10, 8, 6, 4]], [[1, 2, 1, 1, 1], [2, 3, 3, 2, 1], [3, 5, 4, 3, 2], [4, 7, 5, 4, 3], [5, 8, 7, 5, 3], [6, 10, 8, 6, 4]], [[1, 3, 2, 2, 1], [2, 5, 4, 3, 2], [3, 8, 6, 5, 3], [4, 10, 8, 6, 4]]];

const sumProp = (array, prop) => {
	let sum = 0;
	for (let i = 0; i < array.length; i++) {
		sum += Number(array[i][prop]);
	}
	return sum;
}

const pivot = (obj) => {
	let arr = [];
	let values = Object.values(obj);
	let keys = Object.keys(obj);
	for (let i = 0; i < values[0].length; i++) {
		let arrEntry = {
			lvl: i + 1
		};
		for (let j = 0; j < values.length; j++) {
			if (keys[j] === 'abilities') {
				let abilities = [];
				for (let k = i; k >= 0; k--) {
					if (obj.abilities[k].length !== 0) {
						abilities.push(obj.abilities[k][0]);
					}
				}
				arrEntry[keys[j]] = abilities;
			} else {
				arrEntry[keys[j]] = values[j][i];
			}
		}
		arr.push(arrEntry);
	}
	return arr;
}

class MarketCardModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			forSale: [],
			selected: [],
			sortMethod: 'priceBcxAsc',
			panel: 'forSale',
			loading: true,
			historyRange: 'all'
		};
		this.updateSort = this.updateSort.bind(this);
		this.getBCX = this.getBCX.bind(this);
		this.updatePanel = this.updatePanel.bind(this);
		this.handlePanelChange = this.handlePanelChange.bind(this);
		this.multiSelectBCX = this.multiSelectBCX.bind(this);
		this.multiSelectPrice = this.multiSelectPrice.bind(this);
		this.getCombine = this.getCombine.bind(this);
	}

	updateSort(method) {
		let forSale = this.state.forSale;
		if (method === 'priceAsc') {
			forSale.sort((a, b) => {
				return Number(a.buy_price) - Number(b.buy_price);
			});
		} else if (method === 'priceDec') {
			forSale.sort((a, b) => {
				return Number(b.buy_price) - Number(a.buy_price);
			});
		} else if (method === 'lvlAsc') {
			forSale.sort((a, b) => {
				return Number(a.lvl) - Number(b.lvl);
			});
		} else if (method === 'lvlDec') {
			forSale.sort((a, b) => {
				return Number(b.lvl) - Number(a.lvl);
			});
		} else if (method === 'bcxAsc') {
			forSale.sort((a, b) => {
				return Number(a.bcx) - Number(b.bcx);
			});
		} else if (method === 'bcxDec') {
			forSale.sort((a, b) => {
				return Number(b.bcx) - Number(a.bcx);
			});
		} else if (method === 'priceBcxAsc') {
			forSale.sort((a, b) => {
				let aPriceBcx = Number(a.buy_price) / Number(a.bcx);
				let bPriceBcx = Number(b.buy_price) / Number(b.bcx);
				return aPriceBcx - bPriceBcx;
			});
		} else if (method === 'priceBcxDec') {
			forSale.sort((a, b) => {
				let aPriceBcx = Number(a.buy_price) / Number(a.bcx);
				let bPriceBcx = Number(b.buy_price) / Number(b.bcx);
				return bPriceBcx - aPriceBcx;
			});
		} else if (method === 'selected') {
			forSale.sort((a, b) => {
				if (this.state.selected.includes(b) && !this.state.selected.includes(a)) {
					return 1;
				} else {
					return -1;
				}
			})
		}

		this.setState({sortMethod: method});
	}

	getBCX(xp) {
		if (xp === 0) {
			return 1;
		} else if (this.props.info.edition === 'Dice' || this.props.info.edition === 'Untamed' || (this.props.info.edition === 'Reward' && this.props.info.detailID > 223)) {
			return xp;
		}

		let alpha_xp = [20,100,250,1000];
		let alpha_gold_xp = [250,500,1000,2500];
		let beta_xp = [15,75,175,750];
		let beta_gold_xp = [200,400,800,2000];
		let rarity = this.props.info.rarity === 'Common' ? 1 : this.props.info.rarity === 'Rare' ? 2 : this.props.info.rarity === 'Epic' ? 3 : 4;

		if (this.props.info.edition === 'Alpha') {
			if (this.props.info.gold) {
				return Math.floor(xp / alpha_gold_xp[rarity - 1]);
			} else {
				return Math.floor(1 + (xp / alpha_xp[rarity - 1]));
			}
		} else {
			if (this.props.info.gold) {
				return Math.floor(xp / beta_gold_xp[rarity - 1]);
			} else {
				return Math.floor(1 + (xp / beta_xp[rarity - 1]));
			}
		}
	}

	updatePanel(panel) {
		let currentPanel = this.state.panel;
		let currentId = 'panel' + currentPanel;
		let newId = 'panel' + panel;
		if (panel !== currentPanel) {
			document.getElementById(currentId).className = 'modal-panel-header';
			document.getElementById(newId).className = 'modal-panel-header activePanel';
			this.setState({panel: panel});
		}
	}

	handlePanelChange(e) {
		let newPanel = e.target.value;
		this.updatePanel(newPanel);
	}

	multiSelectBCX() {
		const matchUID = this.props.cart.map(item => {return item.uid});
		let count = document.getElementById('bcx').value || 0;
		if (count === 0) {
			let toast = document.getElementById('modal-required-toast');
			toast.className += ' show';
			setTimeout(()=>{toast.className = toast.className.replace(' show', '')}, 3000);
		} else {
			let forSale = this.state.forSale;
			let multi = [];
			
			forSale.sort((a, b) => {
				let aPriceBcx = Number(a.buy_price) / Number(a.bcx);
				let bPriceBcx = Number(b.buy_price) / Number(b.bcx);
				if (aPriceBcx < bPriceBcx) {
					return -1;
				} else if (aPriceBcx > bPriceBcx) {
					return 1;
				} else {
					return b.bcx - a.bcx;
				}
			});

			let i = 0;
			let bcx = 0;
			let cards = 0;
			while (bcx < count && i < forSale.length) {
				if (forSale[i].bcx + bcx <= count && forSale[i].uid !== matchUID[i]) {
					multi.push(forSale[i]);
					cards++;
					bcx += forSale[i].bcx;
				}
				i++;
			}

			this.setState({
				selected: multi,
				panel: 'forSale'
			});
		}
	}

	multiSelectPrice() {
		const matchUID = this.props.cart.map(item => {return item.uid});
		let count = document.getElementById('price').value || 0;
		if (count === 0) {
			let toast = document.getElementById('modal-required-toast');
			toast.className += ' show';
			setTimeout(()=>{toast.className = toast.className.replace(' show', '')}, 3000);
		} else {
			let forSale = this.state.forSale;
			let multi = [];
			
			forSale.sort((a, b) => {
				let aPriceBcx = Number(a.buy_price) / Number(a.bcx);
				let bPriceBcx = Number(b.buy_price) / Number(b.bcx);
				if (aPriceBcx < bPriceBcx) {
					return -1;
				} else if (aPriceBcx > bPriceBcx) {
					return 1;
				} else {
					return b.bcx - a.bcx;
				}
			});

			let i = 0;
			let price = 0;
			let cards = 0;
			while (price < count && i < forSale.length) {
				if (forSale[i].buy_price + price <= count && forSale[i].uid !== matchUID[i]) {
					multi.push(forSale[i]);
					cards++;
					price += forSale[i].buy_price;
				}
				i++;
			}

			this.setState({
				selected: multi,
				panel: 'forSale'
			});
		}
	}

	getCombine(lvl) {
		let rarity = this.props.info.rarity === 'Common' ? 1 : this.props.info.rarity === 'Rare' ? 2 : this.props.info.rarity === 'Epic' ? 3 : 4;
		let edition = this.props.info.edition;
		let detailID = this.props.info.detailID;
		let gold = this.props.info.gold;
		let xpRates = []
		if (edition === 'Alpha') {
  			xpRates = gold ? combineRateGoldA : combineRateA;
  		} else if (edition === 'Beta' || edition === 'Promo' || (edition === 'Reward' && detailID <= 223)) {
  			xpRates = gold ? combineRateGoldB : combineRateB;
  		} else {
  			xpRates = gold ? combineRateGoldU : combineRateU;
  		}

  		return xpRates[rarity - 1][lvl - 1];
	}

	componentDidMount() {
		var forSale = [];
		var distinctSale = [];
		var url = 'https://game-api.splinterlands.io/market/for_sale_by_card?'
		const urlID = 'card_detail_id=' + this.props.info.detailID;
		const urlGold = '&gold=' + this.props.info.gold;
		const urlEdition = '&edition=' + (this.props.info.edition === 'Alpha' ? '0' : this.props.info.edition === 'Beta' ? '1' : this.props.info.edition === 'Promo' ? '2' : this.props.info.edition === 'Reward' ? '3' : this.props.info.edition === 'Untamed' ? '4' : this.props.info.edition === 'Dice' ? '5' : '');
		url += urlID + urlGold + urlEdition;
		$.ajax({
			type: 'GET',
			url: url,
			jsonpCallback: 'testing',
		  	dataType: 'json',
		  	success: function(saleData) {
		  		this.setState({
		  			forSale: forSale = saleData.map(listing => {
			  			let rarity = this.props.info.rarity === 'Common' ? 1 : this.props.info.rarity === 'Rare' ? 2 : this.props.info.rarity === 'Epic' ? 3 : 4;
						let edition = this.props.info.edition;
						let detailID = this.props.info.detailID;
						let lvl = 0;
						let bcx = this.getBCX(listing.xp);
						let gold = this.props.info.gold;
						let xpRates = []
						if (edition === 'Alpha') {
		          			xpRates = gold ? combineRateGoldA[rarity - 1] : combineRateA[rarity - 1];
		          		} else if (edition === 'Beta' || edition === 'Promo' || (edition === 'Reward' && detailID <= 223)) {
		          			xpRates = gold ? combineRateGoldB[rarity - 1] : combineRateB[rarity - 1];
		          		} else {
		          			xpRates = gold ? combineRateGoldU[rarity - 1] : combineRateU[rarity - 1];
		          		}
						for (let i = 0; i < xpRates.length; i++) {
							if (bcx >= xpRates[i]) {
								lvl++;
							} else {
								break;
							}
						}
	      				return ({
	      					seller: listing.seller,
	      					uid: listing.uid,
	      					buy_price: Number(listing.buy_price),
	      					lvl: lvl,
	      					currency: listing.currency,
	      					market_id: listing.market_id,
	      					name: this.props.info.name + (gold ? ' (Gold)' : ''),
	      					bcx: bcx,
	      					cooldown: Date.parse(listing.last_used_date) > (new Date() - 604800000)
	      				});
		  			}),
		  			loading: false
		  		});
		  		this.updateSort('priceBcxAsc');
		  	}.bind(this),
		  	error: function(e) {
		  		console.log('There was an error retrieving the sale data.');
		  	}
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.panel === 'forSale' && prevState.panel === 'multiSelect' && this.state.selected !== prevState.selected) {
			this.updateSort('selected');
		} else if (this.state.panel === 'history' && prevState.panel !== 'history') {
			let edition = this.props.info.edition === 'Alpha' ? 0 : this.props.info.edition === 'Beta' ? 1 : this.props.info.edition === 'Promo' ? 2 : this.props.info.edition === 'Reward' ? 3 : this.props.info.edition === 'Untamed' ? 4 : 5;
			let foilInt = this.props.info.gold ? 1 : 0;
			let id = this.props.info.detailID;
			let priceData = JSON.stringify([{
				id: id,
				foil: foilInt,
				edition: edition
			}]);
			let storageSearch = 'history-' + priceData;
			if (sessionStorage.getItem(storageSearch) && new Date(Date.parse(JSON.parse(sessionStorage.getItem('history')).expiry)) > (new Date())) {
				let prices = JSON.parse(sessionStorage.getItem(storageSearch)).data[1];
				let dates = JSON.parse(sessionStorage.getItem(storageSearch)).data[0];
		  		let newPrices = [];
		  		let newDates = [];
		  		if (this.state.historyRange === 'week') {
					for (let i = (prices.length < 7 ? 0 : prices.length - 7); i < prices.length; i++) {
						newPrices.push(prices[i]);
						newDates.push(dates[i]);
					}
				} else if (this.state.historyRange === 'month') {
					for (let i = (prices.length < 30 ? 0 : prices.length - 30); i < prices.length; i++) {
						newPrices.push(prices[i]);
						newDates.push(dates[i]);
					}
				} else if (this.state.historyRange === '3month') {
					for (let i = (prices.length < 90 ? 0 : prices.length - 90); i < prices.length; i++) {
						newPrices.push(prices[i]);
						newDates.push(dates[i]);
					}
				} else if (this.state.historyRange === 'all') {
					newPrices = prices;
					newDates = dates;
				}
				for (let i = 0; i < newDates.length; i++) {
		  			newDates[i] = newDates[i].slice(0, newDates[i].length - 11);
		  		}
		  		let config = {
		  			type: 'line',
		  			data: {
		  				labels: newDates,
		  				datasets: [{
		  					fill: true,
							borderColor: '#0d2140',
							borderWidth: 2,
							pointBorderColor: '#0d2140',
							pointRadius: 3,
							pointBackgroundColor: '#eba82d',
							pointHoverRadius: 5,
		  					label: 'Price(USD)',
		  					data: newPrices
		  				}]
		  			},
		  			options: {
					    responsive: true,
					    maintainAspectRatio: false,
					    legend: {
					    	display: false
					    }
					}
		  		};
				let ctx = document.getElementById('myChart').getContext('2d');
				let myChart = new Chart(ctx, config);
			} else {
				$.ajax({
					type: 'POST',
					url: 'https://splintx.com/db.php',
					data: {card: priceData},
					jsonpCallback: 'testing',
				  	dataType: 'json',
				  	success: function(history) {
						let expiry = new Date();
						expiry.setDate(expiry.getDate() + 1);
						expiry.setUTCHours(0, 0, 0, 0);
				  		let historyObj = {
				  			expiry: expiry,
				  			data: history
				  		};
				  		let storageName = 'history-' + priceData;
				  		sessionStorage.setItem(storageName, JSON.stringify(historyObj));
				  		let prices = history[1];
				  		let dates = history[0];
				  		let newPrices = [];
				  		let newDates = [];
				  		if (this.state.historyRange === 'week') {
							for (let i = (prices.length < 7 ? 0 : prices.length - 7); i < prices.length; i++) {
								newPrices.push(prices[i]);
								newDates.push(dates[i]);
							}
						} else if (this.state.historyRange === 'month') {
							for (let i = (prices.length < 30 ? 0 : prices.length - 30); i < prices.length; i++) {
								newPrices.push(prices[i]);
								newDates.push(dates[i]);
							}
						} else if (this.state.historyRange === '3month') {
							for (let i = (prices.length < 90 ? 0 : prices.length - 90); i < prices.length; i++) {
								newPrices.push(prices[i]);
								newDates.push(dates[i]);
							}
						} else if (this.state.historyRange === 'all') {
							newPrices = prices;
							newDates = dates;
						}
						for (let i = 0; i < newDates.length; i++) {
				  			newDates[i] = newDates[i].slice(0, newDates[i].length - 11);
				  		}
				  		let config = {
				  			type: 'line',
				  			data: {
				  				labels: dates,
				  				datasets: [{
				  					fill: true,
									borderColor: '#0d2140',
									borderWidth: 2,
									pointBorderColor: '#0d2140',
									pointRadius: 3,
									pointBackgroundColor: '#eba82d',
									pointHoverRadius: 5,
				  					label: 'Price(USD)',
				  					data: prices
				  				}]
				  			},
				  			options: {
							    responsive: true,
							    maintainAspectRatio: false,
							    legend: {
							    	display: false
							    }
							}
				  		};
						let ctx = document.getElementById('myChart').getContext('2d');
						let myChart = new Chart(ctx, config);
				  	}.bind(this),
				  	error: function(e) {
				  		console.log('There was an error retrieving the price history');
				  	}
				});
			}
		} else if (prevState.historyRange !== this.state.historyRange) {
			let edition = this.props.info.edition === 'Alpha' ? 0 : this.props.info.edition === 'Beta' ? 1 : this.props.info.edition === 'Promo' ? 2 : this.props.info.edition === 'Reward' ? 3 : this.props.info.edition === 'Untamed' ? 4 : 5;
			let foilInt = this.props.info.gold ? 1 : 0;
			let id = this.props.info.detailID;
			let priceData = JSON.stringify([{
				id: id,
				foil: foilInt,
				edition: edition
			}]);
			let storageSearch = 'history-' + priceData;
			let prices = JSON.parse(sessionStorage.getItem(storageSearch)).data[1];
			let newPrices = [];
			let dates = JSON.parse(sessionStorage.getItem(storageSearch)).data[0];
			let newDates = [];
			if (this.state.historyRange === 'week') {
				for (let i = (prices.length < 7 ? 0 : prices.length - 7); i < prices.length; i++) {
					newPrices.push(prices[i]);
					newDates.push(dates[i]);
				}
			} else if (this.state.historyRange === 'month') {
				for (let i = (prices.length < 30 ? 0 : prices.length - 30); i < prices.length; i++) {
					newPrices.push(prices[i]);
					newDates.push(dates[i]);
				}
			} else if (this.state.historyRange === '3month') {
				for (let i = (prices.length < 90 ? 0 : prices.length - 90); i < prices.length; i++) {
					newPrices.push(prices[i]);
					newDates.push(dates[i]);
				}
			} else if (this.state.historyRange === 'all') {
				newPrices = prices;
				newDates = dates;
			}
			for (let i = 0; i < newDates.length; i++) {
	  			newDates[i] = newDates[i].slice(0, newDates[i].length - 11);
	  		}
			let config = {
	  			type: 'line',
	  			data: {
	  				labels: newDates,
	  				datasets: [{
	  					fill: true,
						borderColor: '#0d2140',
						borderWidth: 2,
						pointBorderColor: '#0d2140',
						pointRadius: 3,
						pointBackgroundColor: '#eba82d',
						pointHoverRadius: 5,
	  					label: 'Price(USD)',
	  					data: newPrices
	  				}]
	  			},
	  			options: {
				    responsive: true,
				    maintainAspectRatio: false,
				    legend: {
				    	display: false
				    }
				}
	  		};
			let ctx = document.getElementById('myChart').getContext('2d');
			let myChart = new Chart(ctx, config); 
		}
	}

	render() {
		const matchUID = this.props.cart.map(item => {return item.uid});
	    return (
	    	<div className='modal'>
	    		<div className='modal-overlay' onClick={this.props.closeModal}></div>
	    		<div className='modal-content'>
        			<div className='modal-exit' onClick={this.props.closeModal}><i className='fas fa-times'></i></div>
	    			<h2 className={this.props.info.gold ? 'gold' : ''}>{this.props.info.name + (this.props.info.gold ? ' (Gold)' : '')}</h2>
	    			<div className='modal-flex'>
		    			<div className='modal-img-container'>
		    				<img className='modal-img' src={this.props.info.img} />
		    			</div>
		    			<div className='modal-info-container'>
			    			<div className='modal-panel-header-container'>
				    			<h3 id='panelforSale' className={this.state.panel === 'forSale' ? 'modal-panel-header activePanel' : 'modal-panel-header'} onClick={() => {
									let currentPanel = this.state.panel;
									let currentId = 'panel' + currentPanel;
									if (currentPanel !== 'forSale') {
										document.getElementById(currentId).className = 'modal-panel-header';
										document.getElementById('panelforSale').className = 'modal-panel-header activePanel';
										this.setState({panel: 'forSale'});
									}
				    			}}>Cards For Sale</h3>
				    			<h3 id='panelmultiSelect' className={this.state.panel === 'multiSelect' ? 'modal-panel-header activePanel': 'modal-panel-header'} onClick={() => {
									let currentPanel = this.state.panel;
									let currentId = 'panel' + currentPanel;
									if (currentPanel !== 'multiSelect') {
										document.getElementById(currentId).className = 'modal-panel-header';
										document.getElementById('panelmultiSelect').className = 'modal-panel-header activePanel';
										this.setState({panel: 'multiSelect'});
									}
				    			}}>MultiSelect</h3>
				    			<h3 id='panelstats' className={this.state.panel === 'stats' ? 'modal-panel-header activePanel': 'modal-panel-header'} onClick={() => {
									let currentPanel = this.state.panel;
									let currentId = 'panel' + currentPanel;
									if (currentPanel !== 'stats') {
										document.getElementById(currentId).className = 'modal-panel-header';
										document.getElementById('panelstats').className = 'modal-panel-header activePanel';
										this.setState({panel: 'stats'});
									}
				    			}}>Stats</h3>
				    			{ <h3 id='panelhistory' className={this.state.panel === 'history' ? 'modal-panel-header activePanel': 'modal-panel-header'} onClick={() => {
									let currentPanel = this.state.panel;
									let currentId = 'panel' + currentPanel;
									if (currentPanel !== 'history') {
										document.getElementById(currentId).className = 'modal-panel-header';
										document.getElementById('panelhistory').className = 'modal-panel-header activePanel';
										this.setState({panel: 'history'});
									}
				    			}}>Price History</h3>}
				    			<span className='modal-panel-small-container'>
				    				Panel: 
					    			<select className='modal-panel-small' onChange={this.handlePanelChange}>
							            <option value='forSale' selected={this.state.panel === 'forSale'}>Cards For Sale</option>
							            <option value='multiSelect' selected={this.state.panel === 'multiSelect'}>MultiSelect</option>
							            <option value='stats' selected={this.state.panel === 'stats'}>Stats</option>
							            { <option value='history' selected={this.state.panel === 'history'}>Price History</option>}
							        </select>
						        </span>
			    			</div>
			    			
			    			{this.state.panel === 'forSale' ? <div className='modal-table-container'>
			    				<table className='modal-table'>
			    					<thead>
			    						<tr>
			    							<th onClick={() => {
			    								if (this.state.sortMethod !== 'selected') this.updateSort('selected');
			    							}} style={{cursor: 'pointer'}}>{this.state.sortMethod === 'selected' ? <i className='fas fa-caret-down'></i> : ''}</th>
			    							<th onClick={() => {
			    								this.state.sortMethod === 'lvlDec' ? this.updateSort('lvlAsc') : this.updateSort('lvlDec');
			    							}} style={{cursor: 'pointer'}}>Level <i className={'modal-table-sortIcon ' + (this.state.sortMethod === 'lvlAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'lvlDec' ? 'fas fa-caret-down' : '')}></i></th>
			    							<th onClick={() => {
			    								this.state.sortMethod === 'bcxDec' ? this.updateSort('bcxAsc') : this.updateSort('bcxDec');
			    							}} style={{cursor: 'pointer'}}>BCX <i className={'modal-table-sortIcon ' + (this.state.sortMethod === 'bcxAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'bcxDec' ? 'fas fa-caret-down' : '')}></i></th>
			    							<th onClick={() => {
			    								this.state.sortMethod === 'priceAsc' ? this.updateSort('priceDec') : this.updateSort('priceAsc');
			    							}} style={{cursor: 'pointer'}}>Price <i className={'modal-table-sortIcon ' + (this.state.sortMethod === 'priceAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'priceDec' ? 'fas fa-caret-down' : '')}></i></th>
			    							<th onClick={() => {
			    								this.state.sortMethod === 'priceBcxAsc' ? this.updateSort('priceBcxDec') : this.updateSort('priceBcxAsc');
			    							}} style={{cursor: 'pointer'}}>$/BCX <i className={'modal-table-sortIcon ' + (this.state.sortMethod === 'priceBcxAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'priceBcxDec' ? 'fas fa-caret-down' : '')}></i></th>
			    							<th>Status</th>
			    							<th>Seller</th>
			    							<th>Card ID</th>
			    						</tr>
			    					</thead>
			    					{this.state.loading ? '' :
			    					<tbody>
			    						{this.state.forSale.map(listing => {
			    							return(
			    								<tr>
			    									<td className='center'><input type='checkbox' onClick={() => {
			    										let selected = this.state.selected;
			    										if (selected.includes(listing)) {
			    											for (let i = 0; i < selected.length; i++) {
			    												if (selected[i].uid === listing.uid) {
			    													selected.splice(i, 1);
			    												}
			    											}
			    										} else {
			    											selected.push(listing);
			    										}		    										
			    										this.setState({selected: selected});
			    									}} disabled={matchUID.includes(listing.uid)} checked={this.state.selected.includes(listing)}/></td>
			    									<td className='center'>{listing.lvl}</td>
			    									<td className='center'>{listing.bcx}</td>
			    									<td className='center'>${Number(listing.buy_price).toFixed(3)}</td>
			    									<td className='center'>${(Number(listing.buy_price)/listing.bcx).toFixed(3)}</td>
			    									<td className='center'><i className={'fas fa-clock modal-status ' + listing.cooldown}></i></td>
			    									<td className='center'>{listing.seller.length > 8 ? listing.seller.substring(0, 8) + '...' : listing.seller}</td>
			    									<td className='right'>{listing.uid}</td>
			    								</tr>
			    							);
			    						})}
			    					</tbody> }
			    				</table>
			    				{this.state.loading ? <div className='loader-modal-container'><div className='loader-modal'></div></div> : ''}
			    			</div> : this.state.panel === 'multiSelect' ? <div className='modal-table-container'>
				    			<div className='modal-multiselect'>
				    				<p>{this.state.forSale.length} card{this.state.forSale.length === 1 ? '' : 's'} on the market currently.</p>
				    				<div className='multiselect-half left'>
				    					<h4>Select BCX</h4>
				    					<p>Find desired BCX for lowest total price</p>
				    					<input id='bcx' type='number' className='multiSelect-input' placeholder='Desired BCX' />
				    					<button onClick={this.multiSelectBCX}>Search by BCX</button>
				    				</div>
				    				<div className='multiselect-half'>
				    					<h4>Select Price</h4>
				    					<p>Find maximum BCX for desired price</p>
				    					<input id='price' type='number' className='multiSelect-input' placeholder='Total Price (USD)' />
				    					<button onClick={this.multiSelectPrice}>Search by Price</button>
				    				</div>
				    			</div>
			    			</div> : this.state.panel === 'stats' ? <div className='modal-table-container'>
				    			<div className='modal-stats'>
				    				<span>Splinter: {this.props.info.element}</span>
				    				<span>Edition: {this.props.info.edition}</span>
				    				<span>Rarity: {this.props.info.rarity}</span>
				    				<span>Mana: {this.props.info.type === 'Monster' ? this.props.info.stats.mana[0] : this.props.info.stats.mana}</span>
				    				<span>Type: {this.props.info.type}</span>
				    				{this.props.info.type === 'Monster' ? <table className='modal-table'>
				    					<thead>
				    						<tr className='modal-table-header'>
				    							<th>Level</th>
				    							<th>Cards</th>
				    							<th>{this.props.info.attackType === 'attack' ? 'Melee' : this.props.info.attackType === 'ranged' ? 'Ranged' : this.props.info.attackType === 'magic' ? 'Magic' : 'Attack'}</th>
				    							<th>Speed</th>
				    							<th>Health</th>
				    							<th>Armor</th>
				    							<th>Abilities</th>
				    						</tr>
				    					</thead>
				    					<tbody>
				    						{pivot(this.props.info.stats).map(level => {
				    							return (
				    								<tr>
				    									<td className='center'>{level.lvl}</td>
				    									<td className='center'>{this.getCombine(level.lvl) === 0 ? 'N/A' : this.getCombine(level.lvl)}</td>
                              							<td className='center'>{this.props.info.attackType !== 'none' ? level[this.props.info.attackType] : 'N/A'}</td>
				    									<td className='center'>{level[this.props.info.attackType]}</td>
				    									<td className='center'>{level.speed}</td>
				    									<td className='center'>{level.health}</td>
				    									<td className='center'>{level.armor}</td>
				    									<td className='center'>{level.abilities.join(', ')}</td>
				    								</tr>
				    							);
				    						})}
				    					</tbody>
				    				</table> : this.props.info.type === 'Summoner' ? <div>
				    					<ul>
				    						{Object.keys(this.props.info.stats).map(key => {
				    							if (key !== 'mana' && key !== 'abilities' && this.props.info.stats[key] !== 0) {
				    								var monsters;
				    								if (this.props.info.stats[key] > 0) {
				    									monsters = 'friendly';
				    								} else {
				    									monsters = 'enemy';
				    								}
				    								return (
				    									<li><strong>{this.props.info.stats[key] > 0 ? '+' + this.props.info.stats[key] : this.props.info.stats[key]}</strong> to the <strong>{key === 'attack' ? 'Melee' : key.charAt(0).toUpperCase() + key.substring(1)}</strong> attribute of all {monsters} monsters</li>
				    								);
				    							} else if (key === 'abilities') {
				    								return this.props.info.stats.abilities.map(ability => {
				    									return(
				    										<li>All friendly monsters receive the <strong>{ability}</strong> ability</li>
				    									);
				    								})
				    							}
				    						})}
				    					</ul>
				    					<h3 className='summonerStat'>Summoner Level Cap</h3>
				    					<table className='modal-table' style={{tableLayout: 'fixed'}}>
					    					<thead>
					    						<tr className='modal-table-header'>
					    							<th>Level</th>
					    							<th>Cards</th>
					    							<th>Common</th>
					    							<th>Rare</th>
					    							<th>Epic</th>
					    							<th>Legendary</th>
					    						</tr>
					    					</thead>
					    					<tbody>
					    						{summoner[(this.props.info.rarity === 'Common' ? 1 : this.props.info.rarity === 'Rare' ? 2 : this.props.info.rarity === 'Epic' ? 3 : 4) - 1].map(level => {
					    							return (
					    								<tr>
					    									<td className='center'>{level[0]}</td>
					    									<td className='center'>{this.getCombine(level[0]) === 0 ? 'N/A' : this.getCombine(level[0])}</td>
					    									<td className='center'>{level[1]}</td>
					    									<td className='center'>{level[2]}</td>
					    									<td className='center'>{level[3]}</td>
					    									<td className='center'>{level[4]}</td>
					    								</tr>
					    							);
					    						})}
					    					</tbody>
					    				</table>
				    				</div> : ''}
				    			</div>
			    			</div> : this.state.panel === 'history' ? <div className='modal-table-container'>
			    				<div className='date-container'>
			    					<span style={{marginRight:'5px'}}>Date Range: </span>
			    					<span className={'date-selector' + (this.state.historyRange === 'week' ? ' active' : '')} onClick={() => {
			    						this.setState({historyRange: 'week'});
			    					}}>Week</span>
			    					<span className={'date-selector' + (this.state.historyRange === 'month' ? ' active' : '')} onClick={() => {
			    						this.setState({historyRange: 'month'});
			    					}}>Month</span>
			    					<span className={'date-selector' + (this.state.historyRange === '3month' ? ' active' : '')} onClick={() => {
			    						this.setState({historyRange: '3month'});
			    					}}>3 Months</span>
			    					<span className={'date-selector' + (this.state.historyRange === 'all' ? ' active' : '')} onClick={() => {
			    						this.setState({historyRange: 'all'});
			    					}}>All-Time</span>
			    				</div>
			    				<div className='canvas-container'>
			    					<canvas id="myChart"></canvas>
			    				</div>
			    			</div> : ''}
			    		</div>	
			    	</div>
	    			<div className='modal-summary'>
	    				<span>{this.state.selected.length} Card{this.state.selected.length === 1 ? '' : 's'} Selected, BCX: {sumProp(this.state.selected, 'bcx')}, Price: ${sumProp(this.state.selected, 'buy_price').toFixed(3)} USD</span>
    					<button className='modal-action-btn' onClick={() => {
    						let selectedArr = this.state.selected;
    						let toast = document.getElementById('modal-toast');
    						this.setState({selected: []});
    						this.props.addToCart(selectedArr);
    						toast.className += ' show';
    						setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
    					}} disabled={this.state.selected.length === 0}>Add to Cart</button>
    					<button className='modal-clearSelected-btn' onClick={() => {
    						this.setState({selected: []});
    					}} disabled={this.state.selected.length === 0}>Clear All</button>
    				</div>
	    		</div>
				<div id='modal-toast' className='toast successToast'>
					<i className='fas fa-check'></i>Successfully added to cart!
				</div>
				<div id='modal-required-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Please fill all required fields.
				</div>
	    	</div>
	    );
	}
}

export default MarketCardModal;
