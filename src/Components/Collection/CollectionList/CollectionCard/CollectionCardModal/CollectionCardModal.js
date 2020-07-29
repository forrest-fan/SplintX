import React from 'react';
import './CollectionCardModal.css';

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

class Collectionmodal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: this.props.info.cards.sort((a, b) => {
				return (Number(b.xp) - Number(a.xp));
			}),
			panel: 'collection',
			sortMethod: 'bcxDec',
			selected: []
		};
		this.getBurn = this.getBurn.bind(this);
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
				burn_value = untamed_burn_rate[rarity - 1];
			} else {
				if(this.props.info.tier) {
					burn_value = untamed_burn_rate[rarity - 1];
				} 
			} 
		}
		if(this.props.info.gold) {
			burn_value *= 50;
		}
		let xp_levels = [[20,60,160,360,760,1560,2560,4560,7560],[100,300,700,1500,2500,4500,8500],[250,750,1750,3750,7750],[1000,3000,7000]];
		let max_xp = xp_levels[rarity][xp_levels[rarity].length - 1];
		if (xp >= max_xp) {
			burn_value *= 1.05;
		}
	 	return burn_value;
	}

	render() {
	    return (
	    	<div className='modal'>
	    		<div className='modal-overlay' onClick={this.props.closeModal}></div>
	    		<div className='modal-content' >
        			<div className='modal-exit' onClick={this.props.closeModal}><i className='fas fa-times'></i></div>
	    			<h2 className={this.props.info.gold ? 'gold' : ''}>{this.props.info.name + (this.props.info.gold ? ' (Gold)' : '')}</h2>
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
			    							<th onClick={() => {
			    								this.state.sortMethod === 'bcxDec' ? this.updateSort('bcxAsc') : this.updateSort('bcxDec');
			    							}} style={{cursor: 'pointer'}}>Burn Value <i className={'modal-table-sortIcon ' + (this.state.sortMethod === 'bcxAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'bcxDec' ? 'fas fa-caret-down' : '')}></i></th>
										</tr>
			    					</thead>
			    					{this.state.loading ? '' :
			    					<tbody>
			    						{this.state.cards.map(card => {
			    							return(
			    								<tr>
			    									<td className='center'><input type='checkbox' onClick={() => {
			    										// let selected = this.state.selected;
			    										// if (selected.length >= 45 && !selected.includes(listing)) {
			    										// 	let toast = document.getElementById('modal-tooMany-toast');
			    										// 	toast.className += ' show';
			    										// 	setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			    										// } else if (selected.includes(listing)) {
			    										// 	for (let i = 0; i < selected.length; i++) {
			    										// 		if (selected[i].uid === listing.uid) {
			    										// 			selected.splice(i, 1);
			    										// 		}
			    										// 	}
			    										// } else {
			    										// 	selected.push(listing);
			    										// }		    										
			    										// this.setState({selected: selected});
			    									}} /></td>
			    									<td className='left'>{card.uid}</td>
			    									<td className='center'>{card.lvl}</td>
			    									<td className='center'>{card.bcx}</td>
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
			    							<th>{this.props.info.attackType === 'attack' ? 'Melee' : this.props.info.attackType === 'ranged' ? 'Ranged' : 'Magic'}</th>
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
			    										<li><strong>{ability}</strong> ability</li>
			    									);
			    								})
			    							}
			    						})}
			    					</ul>
			    				</div> : ''}
			    			</div>
		    			</div> : '' }
		    			</div>
		    		</div>
	    		</div>
	    	</div>
	    );
	}
}

export default Collectionmodal;