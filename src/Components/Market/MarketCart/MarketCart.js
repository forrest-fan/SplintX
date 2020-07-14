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
		if (isLoggedIn()) {
			// Felix transaction code goes here
			let cart = this.props.cart;
		} else {
			let toast = document.getElementById('cart-login-prompt-toast');
		    toast.className = 'show';
		    setTimeout(() => {toast.className = toast.className.replace('show', '')}, 3000)
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
	    			<div className='cart-summary'>
	    				<p>Total: ${this.state.totalUSD.toFixed(2)}</p>
	    				<button onClick={this.fillOrder} disabled={this.props.cart.length === 0}>Checkout - {this.state.totalDEC.toFixed(3)} DEC</button>
	    			</div>
	    		</div>
	    		<div id='cart-login-prompt-toast'>
		          <i className='fas fa-times'></i>Please login to make a purchase.
		        </div>
	    	</div>
	    );
	}
}

export default MarketCart;