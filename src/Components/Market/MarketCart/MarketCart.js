import React from 'react';
import './MarketCart.css';
import ActionProgress from '../../Collection/CollectionList/CollectionCard/CollectionCardModal/ActionProgress/ActionProgress';
import $ from 'jquery';

const sumProp = (array, prop) => {
	let sum = 0;
	for (let i = 0; i < array.length; i++) {
		sum += Number(array[i][prop]);
	}
	return sum;
}

function isLoggedIn() {
  if(localStorage.getItem('username')) {
    return true;
  } else {
    return false;
  }
}

class MarketCart extends React.Component {
	constructor(props) {
		super(props);
		this.fillOrder = this.fillOrder.bind(this);
		this.keychainRequest = this.keychainRequest.bind(this);
		this.clearCart = this.clearCart.bind(this);
		this.removeItem = this.removeItem.bind(this);
		let summary = [];
		for (let i = 0; i < this.props.cart.length; i++) {
			let inArr = false;
			for (let j = 0; j < summary.length; j++) {
				if (summary[j].name === this.props.cart[i].name) {
					summary[j].bcxRequest += this.props.cart[i].bcx;
					summary[j].cardsRequest++;
					inArr = true;
				}
			}
			if (!inArr) {
				summary.push({
					name: this.props.cart[i].name,
					price: 0,
					bcx: 0,
					cards: 0,
					bcxRequest: this.props.cart[i].bcx,
					cardsRequest: 1
				});
			}
		}
		this.state = {
			totalDEC: 0,
			DECexchange: 0,
			totalUSD: sumProp(this.props.cart, 'buy_price'),
			renderProgress: false,
			progressMsg: '',
			orderSummary: summary,
			renderSummary: false
		}
	}

	removeItem(card) {
		let summary = this.state.orderSummary;
		for (let i = 0; i < summary.length; i++) {
			if (card.name === summary.name) {
				summary.bcxRequest -= card.bcx;
				summary.cardsRequest--;
			}
		}
		this.props.removeItem([card]);
	}
	
	fillOrder() {
		if (isLoggedIn()) {
			this.setState({
				renderProgress: true,
				progressMsg: 'Broadcasting request to blockchain.'
			});

			let selected = [];
			let counter = 0;
			while (counter < this.props.cart.length) {
				let segment = [];
				let segmentLength = this.props.cart.length - 40 > counter ? 40 : this.props.cart.length - counter;
				for (let i = 0; i < segmentLength; i++) {
					segment.push(this.props.cart[counter]);
					counter++;
				}
				selected.push(segment);
			}

			this.keychainRequest(selected, 0);
		} else {
			let toast = document.getElementById('cart-login-prompt-toast');
    		toast.className += ' show';
       		setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
		}
	}

	keychainRequest(selected, index) {
		let cardRangeLow = (index + 1) * 40 - 39;
		let cardRangeHigh = index < selected.length - 1 ? (index + 1) * 40 : cardRangeLow + selected[index].length - 1;
		let total = selected.length * 40 - 40 + selected[selected.length - 1].length;
		let cardRangeStr = cardRangeLow !== cardRangeHigh ? 'Cards ' + cardRangeLow + '-' + cardRangeHigh + ' of ' + total : 'Card ' + cardRangeLow + ' of ' + total;
		
		this.setState({
			progressMsg: ('Broadcasting request for ' + cardRangeStr + ' to the blockchain.')
		});
		let segmentPrice = 0;
		let cards = selected[index].map(card => {
			segmentPrice += card.buy_price;
			return card.market_id;
		});
		let buyJSON = JSON.stringify({
			items: cards,
			price: segmentPrice,
			market: 'splintx',
			currency: 'USD',
			app: 'SplintXApp'
		});
		window.hive_keychain.requestCustomJson(localStorage.getItem('username'), "sm_market_purchase", "Active", buyJSON, "Buy Card(s)", function(keychainResponse) {
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
					let orderSummary = this.state.orderSummary;
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
												let toast = document.getElementById('cardsFailed-toast');
												toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error for ' + cardRangeStr;
												toast.className += ' show';
												setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
											} else {
												let result = JSON.parse(response2.trx_info.result);
												for (let i = 0; i < result.by_seller.length; i++) {
													for (let j = 0; j < result.by_seller[i].items.length; j++) {
														for (let k = 0; k < selected[index].length; k++) {
															if (selected[index][k].market_id === result.by_seller[i].items[j]) {
																for (let l = 0; l < orderSummary.length; l++) {
																	if (orderSummary[l].name === selected[index][k].name) {
																		orderSummary[l].bcx += selected[index][k].bcx;
																		orderSummary[l].price += selected[index][k].buy_price;
																		orderSummary[l].cards++;
																	}
																}
															}
														}
													}
												}
												let toast = document.getElementById('cart-purchased-toast');
												toast.innerHTML = '<i class=\'fas fa-check\'></i> ' + cardRangeStr + ' successfully bought!';
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
								let toast = document.getElementById('cardsFailed-toast');
								toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error for ' + cardRangeStr;
								toast.className += ' show';
								setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
							} else {
								let result = JSON.parse(response.trx_info.result);
								for (let i = 0; i < result.by_seller.length; i++) {
									for (let j = 0; j < result.by_seller[i].items.length; j++) {
										for (let k = 0; k < selected[index].length; k++) {
											if (selected[index][k].market_id === result.by_seller[i].items[j]) {
												for (let l = 0; l < orderSummary.length; l++) {
													if (orderSummary[l].name === selected[index][k].name) {
														orderSummary[l].bcx += selected[index][k].bcx;
														orderSummary[l].price += selected[index][k].buy_price;
														orderSummary[l].cards++;
													}
												}
											}
										}
									}
								}
								console.log(orderSummary);
								let toast = document.getElementById('cart-purchased-toast');
								toast.innerHTML = '<i class=\'fas fa-check\'></i> ' + cardRangeStr + ' successfully bought!';
								toast.className += ' show';
								setTimeout(() => {
									toast.className = toast.className.replace(' show', '');
								}, 3000);
							}
							this.setState({orderSummary: orderSummary});
							this.props.removeItem(selected[index]);
						}.bind(this),
						error: function(e) {
							console.log('Something went wrong');
						}
					});
				}, 10000);
			} else {
				let toast = document.getElementById('cardsFailed-toast');
				toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error broadcasting ' + cardRangeStr;
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			}

			setTimeout(() => {
				if (index === selected.length - 1) {
					this.setState({renderProgress: false, renderSummary: true});
					this.props.updateBalance();
				}
			}, 10000);
		}.bind(this));
	}

	clearCart() {
		this.setState({
			totalDEC: 0,
			totalUSD: 0
		});
		this.props.clearCart();
	}

	componentDidMount() {
		$.ajax({
			type: 'GET',
			url: 'https://game-api.splinterlands.com/settings',
			jsonpCallback: 'testing',
			dataType: 'json',
			success: function(settings) {
				let DECexchange = settings.dec_price;
				let totalDEC = (this.state.totalUSD / DECexchange);
				this.setState({
					totalDEC: totalDEC,
					DECexchange: DECexchange
				})
			}.bind(this),
			error: function(e) {
				console.log('There was an error retrieving the exchange rate');
			}
		});
	}

	render() {
		return (
	    	<div className='cart'>
	    		<div className='cart-overlay' onClick={this.props.closeCart}></div>
	    		<div className='cart-content' >
        			<div className='cart-exit' onClick={this.props.closeCart}><i className='fas fa-times'></i></div>
	    			<h2>My Cart</h2>
	    			<p>You have {this.props.cart.length} item{this.props.cart.length !== 1 ? 's' : ''} in your cart. <span className='cart-clear' onClick={this.clearCart}>Clear Cart</span></p>
	    			<div className='cart-table-container'>
		    			<table className='cart-table'>
		    				<thead>
		    					<tr>
		    						<th>Card Name</th>
		    						<th>Card ID</th>
		    						<th>Level</th>
		    						<th>BCX</th>
		    						<th>Price</th>
		    						<th></th>
		    					</tr>
		    				</thead>
		    				<tbody>
		    					{this.props.cart.map(card => {
		    						return (
		    							<tr>
		    								<td>{card.name}</td>
		    								<td className='center'>{card.uid}</td>
		    								<td className='center'>{card.lvl}</td>
		    								<td className='center'>{card.bcx}</td>
		    								<td className='center'>$ {Number(card.buy_price).toFixed(3) + ' ' + card.currency}</td>
		    								<td className='cart-remove-item' onClick={() => {
		    									this.setState({
		    										totalUSD: this.state.totalUSD - card.buy_price,
		    										totalDEC: (this.state.totalUSD - card.buy_price) / this.state.DECexchange
		    									})
		    									this.removeItem(card);
		    								}}>Remove</td>
		    							</tr>
		    						);
		    					})}
		    				</tbody>
		    			</table>
		    		</div>
	    			<div className='cart-summary'>
	    				<p>Total: ${this.state.totalUSD.toFixed(3)}</p>
	    				<button onClick={this.fillOrder} disabled={this.props.cart.length === 0}>Checkout - {this.state.totalDEC.toFixed(3)} DEC</button>
	    			</div>
	    		</div>
	    		<div id='cart-purchased-toast' className='toast successToast'>
					<i className='fas fa-check'></i>Successfully purchased!
				</div>
	    		<div id='cart-login-prompt-toast' className='toast failToast'>
		          <i className='fas fa-times'></i>Please login to make a purchase.
		        </div>
				<div id='cart-tooMany-toast' className='toast failToast'>
					<i className='fas fa-times'></i>You have over 45 cards in your cart.
				</div>
				<div id='cardsFailed-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Something went wrong! Please try again.
				</div>
				{this.state.renderProgress ? <ActionProgress action='Buying Cards' message={this.state.progressMsg} /> : '' }
				{this.state.renderSummary ? <div className='modal'>
					<div className='modal-overlay' onClick={this.props.closeCart}></div>
					<div className='progress modal-content'>
        				<div className='cart-exit' onClick={this.props.closeCart}><i className='fas fa-times'></i></div>
						<h2>Order Summary</h2>
						<div className='summary cart-table-container'>
							<table className='cart-table'>
								<thead>
									<tr>
										<th>Card Name</th>
										<th>Cards Bought</th>
										<th>BCX Bought</th>
										<th>Price</th>
									</tr>
								</thead>
								<tbody>
									{this.state.orderSummary.map(card => {
										return (
											<tr>
												<td>{card.name}</td>
												<td className='center'>{card.cards} of {card.cardsRequest}</td>
												<td className='center'>{card.bcx} of {card.bcxRequest}</td>
												<td className='right'>{card.price / this.state.DECexchange} DEC</td>
											</tr>
										);
									})}
									<tr className='footer'>
										<td>Total</td>
										<td className='center'>{sumProp(this.state.orderSummary, 'cards')} of {sumProp(this.state.orderSummary, 'cardsRequest')}</td>
										<td className='center'>{sumProp(this.state.orderSummary, 'bcx')} of {sumProp(this.state.orderSummary, 'bcxRequest')}</td>
										<td className='right'>{(sumProp(this.state.orderSummary, 'price') / this.state.DECexchange).toFixed(3)} DEC</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div> : ''}
	    	</div>
	    );
	}
}

export default MarketCart;
