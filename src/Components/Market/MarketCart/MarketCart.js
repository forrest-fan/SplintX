import React from 'react';
import './MarketCart.css';
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
		this.clearCart = this.clearCart.bind(this);
		this.state = {
			totalDEC: 0,
			DECexchange: 0,
			totalUSD: sumProp(this.props.cart, 'buy_price')
		}
	}
	
	fillOrder() {
		if (isLoggedIn() && this.props.cart.length <= 45) {
			let jsonRequest = JSON.stringify({
				items: this.props.cart.map(card => {
					return card.market_id;
				}),
				price: this.state.totalUSD,
				market: 'splintx',
				currency: 'USD',
				app: 'SplintXApp'
			});
			window.hive_keychain.requestCustomJson(localStorage.getItem('username'), "sm_market_purchase", "Active", jsonRequest, "Buy Card(s)", function(response) {
			    let toast = document.getElementById('cart-purchased-toast');
	    		toast.className += 'show';
	       		setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			    this.setState({
					totalDEC: 0,
					totalUSD: 0
				});
				this.props.updateBalance();
				this.props.clearCart();
			}.bind(this));
		} else if (this.props.cart.length > 45 ) {
			let toast = document.getElementById('cart-tooMany-toast');
    		toast.className += ' show';
       		setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
		} else {
			let toast = document.getElementById('cart-login-prompt-toast');
    		toast.className += ' show';
       		setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
		}
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
		    						<th>Price</th>
		    						<th></th>
		    					</tr>
		    				</thead>
		    				<tbody>
		    					{this.props.cart.map(card => {
		    						return (
		    							<tr>
		    								<td>{card.name}</td>
		    								<td style={{textAlign: 'center'}}>{card.uid}</td>
		    								<td style={{textAlign: 'center'}}>{card.lvl}</td>
		    								<td style={{textAlign: 'right'}}>$ {Number(card.buy_price).toFixed(2) + ' ' + card.currency}</td>
		    								<td className='cart-remove-item' onClick={() => {
		    									this.setState({
		    										totalUSD: this.state.totalUSD - card.buy_price,
		    										totalDEC: (this.state.totalUSD - card.buy_price) / this.state.DECexchange
		    									})
		    									this.props.removeItem(card);
		    								}}>Remove</td>
		    							</tr>
		    						);
		    					})}
		    				</tbody>
		    			</table>
		    		</div>
	    			<div className='cart-summary'>
	    				<p>Total: ${this.state.totalUSD.toFixed(2)}</p>
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
	    	</div>
	    );
	}
}

export default MarketCart;
