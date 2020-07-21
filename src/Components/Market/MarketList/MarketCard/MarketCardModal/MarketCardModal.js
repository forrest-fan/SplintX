import React from 'react';
import './MarketCardModal.css';
import $ from 'jquery';

const lvlXP = [[20,60,160,360,760,1560,2560,4560,7560],[100,300,700,1500,2500,4500,8500],[250,750,1750,3750,7750],[1000,3000,7000]];
const newLvlXP = [[1,5,14,30,60,100,150,220,300,400],[1,5,14,25,40,60,85,115],[1,4,10,20,32,46],[1,3,6,11]];
const sumProp = (array, prop) => {
	let sum = 0;
	for (let i = 0; i < array.length; i++) {
		sum += Number(array[i][prop]);
	}
	return sum;
}



class MarketCardModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			forSale: [],
			selected: [],
			sortMethod: 'priceBcxAsc',
			loading: true
		};
		this.updateSort = this.updateSort.bind(this);
		this.getBCX = this.getBCX.bind(this);
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
		}

		this.setState({sortMethod: method});
	}

	getBCX(xp) {
		if (xp === 0) {
			return 1;
		} else if (this.props.info.edition === 'Untamed' || (this.props.info.edition === 'Reward' && this.props.info.detailID > 223)) {
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

	componentDidMount() {
		var forSale = [];
		var distinctSale = [];
		var url = 'https://game-api.splinterlands.io/market/for_sale_by_card?'
		const urlID = 'card_detail_id=' + this.props.info.detailID;
		const urlGold = '&gold=' + this.props.info.gold;
		const urlEdition = '&edition=' + (this.props.info.edition === 'Alpha' ? '0' : this.props.info.edition === 'Beta' ? '1' : this.props.info.edition === 'Promo' ? '2' : this.props.info.edition === 'Reward' ? '3' : '4');
		url += urlID + urlGold + urlEdition;
		$.ajax({
			type: 'GET',
			url: url,
			jsonpCallback: 'testing',
		  	dataType: 'json',
		  	success: function(saleData) {
				saleData.sort((a, b) => parseFloat(a.buy_price) / parseFloat(a.xp) === parseFloat(b.buy_price) / parseFloat(b.xp) ? parseFloat(a.buy_price) === parseFloat(b.buy_price) ? parseFloat(a.xp) - parseFloat(b.xp) : parseFloat(a.buy_price) - parseFloat(b.buy_price) : parseFloat(a.buy_price) / parseFloat(a.xp) - parseFloat(b.buy_price) / parseFloat(b.xp));
		  		this.setState({
		  			forSale: forSale = saleData.map(listing => {
			  			let rarity = this.props.info.rarity === 'Common' ? 1 : this.props.info.rarity === 'Rare' ? 2 : this.props.info.rarity === 'Epic' ? 3 : 4;
						let edition = this.props.info.edition;
						let detailID = this.props.info.detailID;
						let lvl = 1;
						let xpRates = edition === 'Untamed' || (edition === 'Reward' && detailID >= 225) ? newLvlXP : lvlXP;
						let increment = edition === 'Untamed' || (edition === 'Reward' && detailID >= 225) ? 1 : 2;
						let bcx = this.getBCX(listing.xp);
						for (let i = xpRates[rarity - 1].length - 1; i >= 0; i--) {
			          		if (listing.xp >= xpRates[rarity - 1][i]) {
			          			lvl = i + increment;
			          			break;
			          		}
			          	}
	      				return ({
	      					seller: listing.seller,
	      					uid: listing.uid,
	      					buy_price: listing.buy_price,
	      					lvl: lvl,
	      					currency: listing.currency,
	      					market_id: listing.market_id,
	      					name: this.props.info.name,
	      					bcx: bcx
	      				});
		  			}),
		  			loading: false
		  		});
		  	}.bind(this),
		  	error: function(e) {
		  		console.log('There was an error retrieving the sale data.');
		  	}
		});
	}

	render() {
		const matchUID = this.props.cart.map(item => {return item.uid});
	    return (
	    	<div className='market-cardModal'>
	    		<div className='market-cardModal-overlay' onClick={this.props.closeModal}></div>
	    		<div className='market-cardModal-content' >
        			<div className='market-cardModal-exit' onClick={this.props.closeModal}><i className='fas fa-times'></i></div>
	    			<h2>{this.props.info.name}</h2>
	    			<div className='market-cardModal-img-container'>
	    				<img className='market-cardModal-img' src={this.props.info.img} />
	    			</div>
	    			<div className='market-cardModal-info-container'>
		    			<h3>Cards For Sale</h3>
		    			<div className='market-cardModal-table-container'>
		    				<table className='market-cardModal-table'>
		    					<thead className='market-cardModal-table-header'>
		    						<tr>
		    							<th></th>
		    							<th onClick={() => {
		    								this.state.sortMethod === 'lvlDec' ? this.updateSort('lvlAsc') : this.updateSort('lvlDec');
		    							}} style={{cursor: 'pointer'}}>Level <i className={'market-cardModal-table-sortIcon ' + (this.state.sortMethod === 'lvlAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'lvlDec' ? 'fas fa-caret-down' : '')}></i></th>
		    							<th onClick={() => {
		    								this.state.sortMethod === 'bcxDec' ? this.updateSort('bcxAsc') : this.updateSort('bcxDec');
		    							}} style={{cursor: 'pointer'}}>BCX <i className={'market-cardModal-table-sortIcon ' + (this.state.sortMethod === 'bcxAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'bcxDec' ? 'fas fa-caret-down' : '')}></i></th>
		    							<th onClick={() => {
		    								this.state.sortMethod === 'priceAsc' ? this.updateSort('priceDec') : this.updateSort('priceAsc');
		    							}} style={{cursor: 'pointer'}}>Price <i className={'market-cardModal-table-sortIcon ' + (this.state.sortMethod === 'priceAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'priceDec' ? 'fas fa-caret-down' : '')}></i></th>
		    							<th onClick={() => {
		    								this.state.sortMethod === 'priceBcxAsc' ? this.updateSort('priceBcxDec') : this.updateSort('priceBcxAsc');
		    							}} style={{cursor: 'pointer'}}>$/BCX <i className={'market-cardModal-table-sortIcon ' + (this.state.sortMethod === 'priceBcxAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'priceBcxDec' ? 'fas fa-caret-down' : '')}></i></th>
		    							<th>Seller</th>
		    							<th>Card ID</th>
		    						</tr>
		    					</thead>
		    					{this.state.loading ? '' :
		    					<tbody className='market-cardModal-table-data'>
		    						{this.state.forSale.map(listing => {
		    							
		    							return(
		    								<tr>
		    									<td className='market-cardModal-table-add'><input type='checkbox' onClick={() => {
		    										let selected = this.state.selected;
		    										if (selected.length >= 45 && !selected.includes(listing)) {
		    											let toast = document.getElementById('market-cardModal-tooMany-toast');
		    											toast.className = 'show';
		    											setTimeout(() => {toast.className = toast.className.replace('show', '')}, 3000);
		    										} else if (selected.includes(listing)) {
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
		    									<td className='market-cardModal-table-data-lvl'>{listing.lvl}</td>
		    									<td className='market-cardModal-table-data-lvl'>{listing.bcx}</td>
		    									<td className='market-cardModal-table-data-price'>${Number(listing.buy_price).toFixed(2)}</td>
		    									<td className='market-cardModal-table-data-price'>${(Number(listing.buy_price)/listing.bcx).toFixed(2)}</td>
		    									<td className='market-cardModal-table-data-seller'>{listing.seller.length > 8 ? listing.seller.substring(0, 8) + '...' : listing.seller}</td>
		    									<td className='market-cardModal-table-data-uid'>{listing.uid}</td>
		    								</tr>
		    							);
		    						})}
		    					</tbody> }
		    				</table>
		    				{this.state.loading ? <div className='loader-modal-container'><div className='loader-modal'></div></div> : ''}
		    			</div>
		    			
		    			<div className='market-cardModal-addToCart'>
		    				<span>{this.state.selected.length} {this.props.info.name} Card{this.state.selected.length === 1 ? '' : 's'} Selected, Total: ${sumProp(this.state.selected, 'buy_price').toFixed(2)} USD</span>
	    					<button className='market-cardModal-addToCart-btn' onClick={() => {
	    						let selectedArr = this.state.selected;
	    						let toast = document.getElementById('market-cardModal-toast');
	    						this.setState({selected: []});
	    						this.props.addToCart(selectedArr);
	    						toast.className = 'show';
	    						setTimeout(() => {toast.className = toast.className.replace('show', '')}, 3000)
	    					}} disabled={this.state.selected.length === 0}>Add to Cart</button>
	    				</div>
	    			</div>
	    		</div>
				<div id='market-cardModal-toast'>
					<i className='fas fa-check'></i>Successfully added to cart!
				</div>
				<div id='market-cardModal-tooMany-toast'>
					<i className='fas fa-times'></i>You have already selected the limit of 45 cards.
				</div>
	    	</div>
	    );
	}
}

export default MarketCardModal;
