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
			inCart: [],
			sortMethod: 'default'
		};
		this.updateSort = this.updateSort.bind(this);
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
		}

		this.setState({sortMethod: method});
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
		  		this.setState({
		  			forSale: forSale = saleData.map(listing => {
			  			let rarity = this.props.info.rarity === 'Common' ? 1 : this.props.info.rarity === 'Rare' ? 2 : this.props.info.rarity === 'Epic' ? 3 : 4;
						let edition = this.props.info.edition;
						let detailID = this.props.info.detailID;
						let lvl = 1;
						let xpRates = edition === 'Untamed' || (edition === 'Reward' && detailID >= 225) ? newLvlXP : lvlXP;
						let increment = edition === 'Untamed' || (edition === 'Reward' && detailID >= 225) ? 1 : 2;
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
	      					currency: listing.currency
	      				});
		  			})
		  		});
		  	}.bind(this),
		  	error: function(e) {
		  		console.log('There was an error retrieving the sale data.');
		  	}
		});
	}

	render() {
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
		    							<th>Seller</th>
		    							<th>Card ID</th>
		    							<th onClick={() => {
		    								this.state.sortMethod === 'lvlDec' ? this.updateSort('lvlAsc') : this.updateSort('lvlDec');
		    							}} style={{cursor: 'pointer'}}>Level  <i className={'market-cardModal-table-sortIcon ' + (this.state.sortMethod === 'lvlAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'lvlDec' ? 'fas fa-caret-down' : '')}></i></th>
		    							<th onClick={() => {
		    								this.state.sortMethod === 'priceAsc' ? this.updateSort('priceDec') : this.updateSort('priceAsc');
		    							}} style={{cursor: 'pointer'}}>Price <i className={'market-cardModal-table-sortIcon ' + (this.state.sortMethod === 'priceAsc' ? 'fas fa-caret-up' : this.state.sortMethod === 'priceDec' ? 'fas fa-caret-down' : '')}></i></th>
		    						</tr>
		    					</thead>
		    					<tbody className='market-cardModal-table-data'>
		    						{this.state.forSale.map(listing => {
		    							
		    							return(
		    								<tr>
		    									<td className='market-cardModal-table-add'><input type='checkbox' onClick={() => {
		    										let inCart = this.state.inCart;
		    										if (!inCart.includes(listing)) {
		    											inCart.push(listing);
		    										} else {
		    											for (let i = 0; i < inCart.length; i++) {
		    												if (inCart[i].uid === listing.uid) {
		    													inCart.splice(i, 1);
		    												}
		    											}
		    										}
		    										this.setState({inCart: inCart});
		    									}}/></td>
		    									<td className='market-cardModal-table-data-seller'>{listing.seller}</td>
		    									<td className='market-cardModal-table-data-uid'>{listing.uid}</td>
		    									<td className='market-cardModal-table-data-lvl'>{listing.lvl}</td>
		    									<td className='market-cardModal-table-data-price'>{Number(listing.buy_price).toFixed(2) + ' ' + listing.currency}</td>
		    								</tr>
		    							);
		    						})}
		    					</tbody>
		    				</table>
		    			</div>
		    			<p>Cards In Cart: {this.state.inCart.length}, Total: ${sumProp(this.state.inCart, 'buy_price').toFixed(2)} USD</p>
	    			</div>
	    		</div>
	    	</div>
	    );
	}
}

export default MarketCardModal;