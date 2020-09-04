import React from 'react';
import './CollectionCardModal.css';
import TransferModal from './TransferModal/TransferModal';
import SellModal from './SellModal/SellModal';
import ActionProgress from './ActionProgress/ActionProgress';
import $ from 'jquery';

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

const sumProp = (array, prop) => {
	let sum = 0;
	for (let i = 0; i < array.length; i++) {
		sum += Number(array[i][prop]);
	}
	return sum;
}

const summoner = [[[1, 1, 1, 1, 0], [2, 2, 2, 1, 1], [3, 3, 2, 2, 1], [4, 4, 3, 2, 2], [5, 5, 4, 3, 2], [6, 6, 5, 4, 2], [7, 7, 6, 4, 3], [8, 8, 6, 5, 3], [9, 9, 7, 5, 4], [10, 10, 8, 6, 4]], [[1, 1, 1, 1, 1], [2, 3, 2, 2, 1], [3, 4, 3, 2, 2], [4, 5, 4, 3, 2], [5, 6, 5, 4, 3], [6, 8, 6, 5, 3], [7, 9, 7, 5, 4], [8, 10, 8, 6, 4]], [[1, 2, 1, 1, 1], [2, 3, 3, 2, 1], [3, 5, 4, 3, 2], [4, 7, 5, 4, 3], [5, 8, 7, 5, 3], [6, 10, 8, 6, 4]], [[1, 3, 2, 2, 1], [2, 5, 4, 3, 2], [3, 8, 6, 5, 3], [4, 10, 8, 6, 4]]];
const combineRateU = [[1,5,14,30,60,100,150,220,300,400],[1,5,14,25,40,60,85,115],[1,4,10,20,32,46],[1,3,6,11]];
const combineRateGoldU = [[0,0,1,2,5,9,14,20,27,38],[0,1,2,4,7,11,16,22],[0,1,2,4,7,10],[0,1,2,4]];
const combineRateB = [[1,3,5,12,25,52,105,172,305,505],[1,3,5,11,21,35,61,115],[1,3,6,11,23,46],[1,3,5,11]];
const combineRateGoldB = [[0,0,0,1,2,4,8,13,23,38],[0,0,1,2,4,7,12,22],[0,0,1,3,5,10],[0,1,2,4]];
const combineRateA = [[1,2,4,9,19,39,79,129,229,379],[1,2,4,8,16,26,46,86],[1,2,4,8,16,32],[1,2,4,8]];
const combineRateGoldA = [[0,0,0,1,2,4,7,11,19,31],[0,0,1,2,3,5,9,17],[0,0,1,2,4,8],[0,1,2,3]];

class Collectionmodal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: this.props.info.cards.sort((a, b) => {
				return (Number(b.xp) - Number(a.xp));
			}),
			panel: 'collection',
			sortMethod: 'bcxDec',
			selected: [],
			renderTransfer: false,
			renderSell: false,
			renderProgress: false,
			renderCombineProgress: false,
			progressMsg: ''
		};
		this.clearSelected = this.clearSelected.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.toggleTransfer = this.toggleTransfer.bind(this);
		this.toggleSell = this.toggleSell.bind(this);
		this.getBurn = this.getBurn.bind(this);
		this.updateSort = this.updateSort.bind(this);
		this.combine = this.combine.bind(this);
		this.getCombine = this.getCombine.bind(this);
		this.burn = this.burn.bind(this);
		this.keychainRequestBurn = this.keychainRequestBurn.bind(this);
		this.keychainRequestCombine = this.keychainRequestCombine.bind(this);
	}

	clearSelected() {
		this.setState({selected: []});
	}

	selectAll() {
		let selected = this.state.cards.map(card => {return card});
		this.setState({
			selected: selected
		});
	}

	toggleTransfer() {
		let rendered = this.state.renderTransfer;
		if (rendered) {
			this.setState({renderTransfer: false});
		} else {
			let eligible = true;
			let selected = this.state.selected;
			for (let i = 0; i < selected.length; i++) {
				if (selected[i].leased || selected[i].listed) {
					eligible = false;
				}
			}
			if (eligible) {
				this.setState({
					renderTransfer: true
				});
			} else {
				let toast = document.getElementById('ineligible-toast');
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			}
		}
	}

	toggleSell() {
		let rendered = this.state.renderSell;
		if (rendered) {
			this.setState({renderSell: false});
		} else {
			let eligible = true;
			let selected = this.state.selected;
			for (let i = 0; i < selected.length; i++) {
				if (selected[i].leased || selected[i].listed) {
					eligible = false;
				}
			}
			if (eligible) {
				this.setState({
					renderSell: true
				});
			} else {
				let toast = document.getElementById('ineligible-toast');
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			}
		}
		
	}

	updateSort(method) {
		let cards = this.state.cards;
		if (method === 'lvlAsc') {
			cards.sort((a, b) => {
				return Number(a.lvl) - Number(b.lvl);
			});
		} else if (method === 'lvlDec') {
			cards.sort((a, b) => {
				return Number(b.lvl) - Number(a.lvl);
			});
		} else if (method === 'bcxAsc') {
			cards.sort((a, b) => {
				return Number(a.xp) - Number(b.xp);
			});
		} else if (method === 'bcxDec') {
			cards.sort((a, b) => {
				return Number(b.xp) - Number(a.xp);
			});
		} else if (method === 'selected') {
			cards.sort((a, b) => {
				if (this.state.selected.includes(b) && !this.state.selected.includes(a)) {
					return 1;
				} else {
					return -1;
				}
			})
		}

		this.setState({sortMethod: method});
	}

	getBurn(BCX, xp) {
		let rarity = this.props.info.rarity === 'Common' ? 1 : this.props.info.rarity === 'Rare' ? 2 : this.props.info.rarity === 'Epic' ? 3 : 4;
		let burn_rate=[15,60,300,1500];
		let untamed_burn_rate = [10,40,200,1000];
		let burn_value = burn_rate[rarity - 1] * BCX;
		if(this.props.info.edition !== 'Beta') {
			if(this.props.info.edition === 'Alpha' || this.props.info.edition === 'Promo') {
				burn_value *= 2;
			} else if (this.props.info.edition === 'Untamed') {
				burn_value = untamed_burn_rate[rarity - 1] * BCX;
			} else {
				if(this.props.info.tier) {
					burn_value = untamed_burn_rate[rarity - 1] * BCX;
				} 
			} 
		}
		if(this.props.info.gold) {
			burn_value *= 50;
		}
		let xp_levels = [[20,60,160,360,760,1560,2560,4560,7560],[100,300,700,1500,2500,4500,8500],[250,750,1750,3750,7750],[1000,3000,7000]];
		let max_xp = xp_levels[rarity - 1][xp_levels[rarity - 1].length - 1];
		if (xp >= max_xp) {
			burn_value *= 1.05;
		}
	 	return burn_value;
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

	combine() {
		let eligible = true;
		let totalbcx = 0;
		let selected = [];
		let counter = 0;
		while (counter < this.state.selected.length) {
			let segment = [];
			let segmentLength = this.state.selected.length - 40 > counter ? 40 : this.state.selected.length - counter;
			for (let i = 0; i < segmentLength; i++) {
				if (this.state.selected[counter].leased || this.state.selected[counter].listed) {
					eligible = false;
				}
				segment.push(this.state.selected[counter].uid);
				totalbcx += this.state.selected[counter].bcx;
				counter++;
			}
			selected.push(segment);
		}
		let rarity = this.props.info.rarity === 'Common' ? 1 : this.props.info.rarity === 'Rare' ? 2 : this.props.info.rarity === 'Epic' ? 3 : 4;
		let edition = this.props.info.edition;
		let detailID = this.props.info.detailID;
		let newLvl = 0;
		let gold = this.props.info.gold;
		let xpRates = []
		if (edition === 'Alpha') {
  			xpRates = gold ? combineRateGoldA[rarity - 1] : combineRateA[rarity - 1];
  		} else if (edition === 'Beta' || edition === 'Promo' || (edition === 'Reward' && detailID <= 223)) {
  			xpRates = gold ? combineRateGoldB[rarity - 1] : combineRateB[rarity - 1];
  		} else if (edition === 'Untamed' || (edition === 'Reward' && detailID > 223)) {
  			xpRates = gold ? combineRateGoldU[rarity - 1] : combineRateU[rarity - 1];
  		}
		for (let i = 0; i < xpRates.length; i++) {
			if (totalbcx >= xpRates[i]) {
				newLvl++;
			} else {
				break;
			}
		}
		var proceed = window.confirm('Combine ' + totalbcx + ' BCX for a Level ' + newLvl + ' ' + this.props.info.name + '?');
		if (proceed) {
			if (!eligible) {
				let toast = document.getElementById('ineligible-toast');
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			} else {
				this.setState({
					renderCombineProgress: true,
					progressMsg: 'Broadcasting request to the blockchain'
				});
				this.keychainRequestCombine(selected, 0);				
			}
		}
	}

	keychainRequestCombine(selected, index) {
		let cardRangeLow = (index + 1) * 40 - 39;
		let cardRangeHigh = index < selected.length - 1 ? (index + 1) * 40 : cardRangeLow + selected[index].length - 1;
		let total = selected.length * 40 - 40 + selected[selected.length - 1].length;
		let cardRangeStr = cardRangeLow !== cardRangeHigh ? 'Cards ' + cardRangeLow + '-' + cardRangeHigh + ' of ' + total : 'Card ' + cardRangeLow + ' of ' + total;
		
		this.setState({
			progressMsg: ('Broadcasting request for ' + cardRangeStr + ' to the blockchain.')
		});

		let cards = selected[index];
		let combineJSON = JSON.stringify({
			cards: cards,
			app: 'SplintX'
		});

		window.hive_keychain.requestCustomJson(localStorage.getItem('username'), 'sm_combine_cards', 'Active', combineJSON, 'Combine Card(s)', function(keychainResponse) {
			if (index < selected.length - 1) {
				this.keychainRequest(selected, index + 1);
			}
			if (keychainResponse.success) {
				if (index === selected.length - 1) {
					this.setState({
						progressMsg: ('Successfully broadcasted request for ' + cardRangeStr)
					}, () => {
						setTimeout(() => {
							this.setState({progressMsg: 'Gathering request results.'});
						}, 2000)
					});
				}
				let id = keychainResponse.result.id;
				let url = 'https://game-api.splinterlands.io/transactions/lookup?trx_id=' + id;
				setTimeout(() => {
					$.ajax({
						type: 'GET',
			  			url: url,
			  			jsonpCallback: 'testing',
			  			dataType: 'json',
						success: function(response) {
							if (response.error_code === 1) {
								setTimeout(() => {
									$.ajax({
										type: 'GET',
							  			url: url,
							  			jsonpCallback: 'testing',
							  			dataType: 'json',
										success: function(response2) {
											if (response2.error) {
												if (index === selected.length - 1) {
													this.setState({renderCombineProgress: false});
												}
												let toast = document.getElementById('cardsFailed-toast');
												toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error for ' + cardRangeStr;
												toast.className += ' show';
												setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
											} else {
												if (index === selected.length - 1) {
													this.setState({renderCombineProgress: false});
												}
												this.props.updateCollection('combine', cards);
												let toast = document.getElementById('cardsCombined-toast');
												toast.innerHTML = '<i class=\'fas fa-check\'></i> ' + cardRangeStr + ' successfully listed!';
												toast.className += ' show';
												setTimeout(() => {
													toast.className = toast.className.replace(' show', '');
												}, 3000);
											}
										}.bind(this),
										error: function(e) {
											console.log('Something went wrong');
										}
									});
								}, 5000);
							} else if (response.error) {
								if (index === selected.length - 1) {
									this.setState({renderCombineProgress: false});
								}
								let toast = document.getElementById('cardsFailed-toast');
								toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error for ' + cardRangeStr;
								toast.className += ' show';
								setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
							} else {
								if (index === selected.length - 1) {
									this.setState({renderCombineProgress: false});
								}
								this.props.updateCollection('combine', cards);
								let toast = document.getElementById('cardsCombined-toast');
								toast.innerHTML = '<i class=\'fas fa-check\'></i> ' + cardRangeStr + ' successfully burned!';
								toast.className += ' show';
								setTimeout(() => {
									toast.className = toast.className.replace(' show', '');
								}, 3000);
							}
						}.bind(this),
						error: function(e) {
							console.log('Something went wrong');
						}
					});
				}, 10000);
			} else {
				if (index === selected.length - 1) {
					this.setState({renderCombineProgress: false});
				}
				let toast = document.getElementById('cardsFailed-toast');
				toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error broadcasting ' + cardRangeStr;
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			}
		}.bind(this));
	}

	burn() {
		let eligible = true;
		let totalBurn = 0;
		let selected = [];
		let counter = 0;
		while (counter < this.state.selected.length) {
			let segment = [];
			let segmentLength = this.state.selected.length - 40 > counter ? 40 : this.state.selected.length - counter;
			for (let i = 0; i < segmentLength; i++) {
				if (this.state.selected[counter].leased || this.state.selected[counter].listed) {
					eligible = false;
				}
				segment.push(this.state.selected[counter].uid);
				totalBurn += this.getBurn(this.state.selected[counter].bcx, this.state.selected[counter].xp);
				counter++;
			}
			selected.push(segment);
		}
		let proceed = window.confirm("Burn " + this.state.selected.length + ' card(s) for ' + totalBurn + ' DEC?');
		if (proceed) {
			if (!eligible) {
				let toast = document.getElementById('ineligible-toast');
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			} else {
				this.setState({
					renderProgress: true,
					progressMsg: 'Compiling burn details'
				});
				this.keychainRequestBurn(selected, 0);
			}
		}
	}

	keychainRequestBurn (selected, index) {
		let cardRangeLow = (index + 1) * 40 - 39;
		let cardRangeHigh = index < selected.length - 1 ? (index + 1) * 40 : cardRangeLow + selected[index].length - 1;
		let total = selected.length * 40 - 40 + selected[selected.length - 1].length;
		let cardRangeStr = cardRangeLow !== cardRangeHigh ? 'Cards ' + cardRangeLow + '-' + cardRangeHigh + ' of ' + total : 'Card ' + cardRangeLow + ' of ' + total;
		this.setState({progressMsg: ('Broadcasting request for ' + cardRangeStr + ' to the blockchain.')});
		let cards = selected[index];
		let burnJSON = JSON.stringify({
			cards: cards,
			app: 'SplintX'
		});
		window.hive_keychain.requestCustomJson(localStorage.getItem('username'), 'sm_burn_cards', 'Active', burnJSON, 'Burn card(s)', function(keychainResponse) {
			if (index < selected.length - 1) {
				this.keychainRequestBurn(selected, index + 1);
			}
			if (keychainResponse.success) {
				if (index === selected.length - 1) {
					this.setState({
						progressMsg: ('Successfully broadcasted request for ' + cardRangeStr)
					}, () => {
						setTimeout(() => {
							this.setState({progressMsg: 'Gathering request results.'});
						}, 2000)
					});
				}
				let id = keychainResponse.result.id;
				let url = 'https://game-api.splinterlands.io/transactions/lookup?trx_id=' + id;
				setTimeout(() => {
					$.ajax({
						type: 'GET',
			  			url: url,
			  			jsonpCallback: 'testing',
			  			dataType: 'json',
						success: function(response) {
							if (response.error_code === 1) {
								setTimeout(() => {
									$.ajax({
										type: 'GET',
							  			url: url,
							  			jsonpCallback: 'testing',
							  			dataType: 'json',
										success: function(response2) {
											if (response2.error) {
												if (index === selected.length - 1) {
													this.setState({renderProgress: false});
												}
												let toast = document.getElementById('cardsFailed-toast');
												toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error for ' + cardRangeStr;
												toast.className += ' show';
												setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
											} else {
												if (index === selected.length - 1) {
													this.setState({renderProgress: false});
												}
												this.props.updateCollection('remove', cards);
												let toast = document.getElementById('cardsBurned-toast');
												toast.innerHTML = '<i class=\'fas fa-check\'></i> ' + cardRangeStr + ' successfully listed!';
												toast.className += ' show';
												setTimeout(() => {
													toast.className = toast.className.replace(' show', '');
												}, 3000);
											}
										}.bind(this),
										error: function(e) {
											console.log('Something went wrong');
										}
									});
								}, 5000);
							} else if (response.error) {
								if (index === selected.length - 1) {
									this.setState({renderProgress: false});
								}
								let toast = document.getElementById('cardsFailed-toast');
								toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error for ' + cardRangeStr;
								toast.className += ' show';
								setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
							} else {
								if (index === selected.length - 1) {
									this.setState({renderProgress: false});
								}
								this.props.updateCollection('remove', cards);
								let toast = document.getElementById('cardsBurned-toast');
								toast.innerHTML = '<i class=\'fas fa-check\'></i> ' + cardRangeStr + ' successfully burned!';
								toast.className += ' show';
								setTimeout(() => {
									toast.className = toast.className.replace(' show', '');
								}, 3000);
							}
						}.bind(this),
						error: function(e) {
							console.log('Something went wrong');
						}
					});
				}, 10000);
			} else {
				if (index === selected.length - 1) {
					this.setState({renderProgress: false});
				}
				let toast = document.getElementById('cardsFailed-toast');
				toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error broadcasting ' + cardRangeStr;
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			}
		}.bind(this));
	}

	render() {
	    return (
	    	<div className='modal'>
	    		<div className='modal-overlay' onClick={this.props.closeModal}></div>
	    		<div className='modal-content' >
        			<div className='modal-exit' onClick={this.props.closeModal}><i className='fas fa-times'></i></div>
	    			<h2 className={this.props.info.gold ? 'gold' : ''}>{this.props.info.name + (this.props.info.gold ? ' (Gold)' : '')}</h2>
	    			<div className='modal-flex'>
		    			<div className='modal-img-container'>
		    				<img className='modal-img' src={this.props.info.img} />
		    			</div>
		    			<div className='modal-info-container'>
			    			<div className='modal-panel-header-container'>
				    			<h3 id='panelcollection' className={this.state.panel === 'collection' ? 'modal-panel-header activePanel' : 'modal-panel-header'} onClick={() => {
									let currentPanel = this.state.panel;
									let currentId = 'panel' + currentPanel;
									if (currentPanel !== 'collection') {
										document.getElementById(currentId).className = 'modal-panel-header';
										document.getElementById('panelcollection').className = 'modal-panel-header activePanel';
										this.setState({panel: 'collection'});
									}
				    			}}>Collection</h3>
				    			<h3 id='panelstats' className={this.state.panel === 'stats' ? 'modal-panel-header activePanel' : 'modal-panel-header'} onClick={() => {
									let currentPanel = this.state.panel;
									let currentId = 'panel' + currentPanel;
									if (currentPanel !== 'stats') {
										document.getElementById(currentId).className = 'modal-panel-header';
										document.getElementById('panelstats').className = 'modal-panel-header activePanel';
										this.setState({panel: 'stats'});
									}
				    			}}>Stats</h3>
				    			<span className='modal-panel-small-container'>
				    				Panel: 
					    			<select className='modal-panel-small' onChange={this.handlePanelChange}>
							            <option value='collection' selected={this.state.panel === 'collection'}>Collection</option>
							            <option value='stats' selected={this.state.panel === 'stats'}>Stats</option>
							        </select>
						        </span>
						        {this.state.panel === 'collection' ? <div className='modal-table-container'>
				    				<table className='modal-table'>
				    					<thead>
				    						<tr>
				    							<th onClick={() => {
				    								if (this.state.sortMethod !== 'selected') this.updateSort('selected');
				    							}} style={{cursor: 'pointer'}}>{this.state.sortMethod === 'selected' ? <i className='fas fa-caret-down'></i> : ''}</th>
				    							<th>Card ID</th>
				    							<th onClick={() => {
				    								this.state.sortMethod === 'lvlDec' ? this.updateSort('lvlAsc') : this.updateSort('lvlDec');
				    							}} style={{cursor: 'pointer'}}>Level <i className={'modal-table-sortIcon ' + (this.state.sortMethod === 'lvlAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'lvlDec' ? 'fas fa-caret-down' : '')}></i></th>
				    							<th onClick={() => {
				    								this.state.sortMethod === 'bcxDec' ? this.updateSort('bcxAsc') : this.updateSort('bcxDec');
				    							}} style={{cursor: 'pointer'}}>BCX <i className={'modal-table-sortIcon ' + (this.state.sortMethod === 'bcxAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'bcxDec' ? 'fas fa-caret-down' : '')}></i></th>
				    							<th>Status</th>
				    							<th >Burn Value</th>
											</tr>
				    					</thead>
				    					{this.state.loading ? '' :
				    					<tbody>
				    						{this.state.cards.map(card => {
				    							return(
				    								<tr>
				    									<td className='center'><input type='checkbox' onClick={() => {
				    										let selected = this.state.selected;
				    										if (selected.includes(card)) {
				    											for (let i = 0; i < selected.length; i++) {
				    												if (selected[i].uid === card.uid) {
				    													selected.splice(i, 1);
				    												}
				    											}
				    										} else {
				    											selected.push(card);
				    										}		    										
				    										this.setState({selected: selected});
				    									}} checked={this.state.selected.includes(card)}/></td>
				    									<td className='left'>{card.uid}</td>
				    									<td className='center'>{card.lvl}</td>
				    									<td className='center'>{card.bcx}</td>
				    									<td className='center'>
				    										<i className={'fas fa-clock modal-status ' + card.cooldown.toString()}></i>
				    										<i className={'fas fa-shopping-cart modal-status ' + card.listed.toString()}></i>
				    										<i className={'fas fa-exchange-alt modal-status ' + card.leased.toString()}></i>
				    									</td>
				    									<td className='center'>{this.getBurn(card.bcx, card.xp)}</td>
				    								</tr>
				    							);
				    						})}
				    					</tbody> }
				    				</table>
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
				    									<td className='center'>{this.getCombine(level.lvl)}</td>
				    									<td className='center'>{this.props.info.attackType !== 'none' ? level[this.props.info.attackType] : 'N/A'}</td>
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
				    										<li><strong>{ability}</strong> ability</li>
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
			    			</div> : '' }
			    			<div className='modal-summary'>
			    				<span>{this.state.selected.length} Card{this.state.selected.length === 1 ? '' : 's'} Selected, BCX: {sumProp(this.state.selected, 'bcx')}</span>
		    					<button className='modal-action-btn' onClick={this.combine} disabled={this.state.selected.length === 0}>
		    						Combine
		    					</button>
		    					<button className='modal-action-btn' onClick={this.burn} disabled={this.state.selected.length === 0}>
		    						Burn
		    					</button>
		    					<button className='modal-action-btn' onClick={this.toggleSell} disabled={this.state.selected.length === 0}>
		    						Sell
		    					</button>
		    					<button className='modal-action-btn' onClick={this.toggleTransfer} disabled={this.state.selected.length === 0}>
		    						Transfer
		    					</button>
		    					<button className='modal-clearSelected-btn' onClick={this.clearSelected} disabled={this.state.selected.length === 0}>
		    						Clear All
		    					</button>
		    					<button className='modal-clearSelected-btn' onClick={this.selectAll}>
		    						Select All
		    					</button>
		    				</div>
			    			</div>
			    		</div>
		    		</div>
	    		</div>
	    		<div id='cardsBurned-toast' className='toast successToast'>
					<i className='fas fa-check'></i>Successfully burned!
				</div>
				<div id='cardsCombined-toast' className='toast successToast'>
					<i className='fas fa-check'></i>Successfully combined!
				</div>
				<div id='cardsFailed-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Something went wrong! Please try again.
				</div>
				<div id='ineligible-toast' className='toast failToast'>
					<i className='fas fa-times'></i>One or more cards are ineligible.
				</div>
				{this.state.renderTransfer ? <TransferModal updateCollection={this.props.updateCollection} closeParentModal={this.props.closeModal} closeModal={this.toggleTransfer} info={this.props.info} cards={this.state.selected}/> : ''}
	    	{this.state.renderSell ? <SellModal updateCollection={this.props.updateCollection} clearSelected={this.clearSelected} closeParentModal={this.props.closeModal} closeModal={this.toggleSell} info={this.props.info} cards={this.state.selected}/> : ''}
        {this.state.renderProgress ? <ActionProgress action='Burning Cards' message={this.state.progressMsg} /> : '' }
	    	{this.state.renderCombineProgress ? <ActionProgress action='Combining Cards' message={this.state.progressMsg} /> : '' }
	    	</div>
	    );
	}
}

export default Collectionmodal;