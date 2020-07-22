import React from 'react';

class PackModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {totalPrice: this.props.item.price};
		this.updatePrice = this.updatePrice.bind(this);
		this.buyPack = this.buyPack.bind(this);
	}

	buyPack() {
		let totalPrice = this.state.totalPrice / 2000;
		alert("buyPack function");
  		var json = JSON.stringify({
    		type: "booster_pack",
   			qty: totalPrice,
    		currency: "DEC",
    		market: "splintx",
    		app: "SplintXApp"
  		});	
		window.hive_keychain.requestCustomJson(localStorage.getItem('username'), "sm_purchase", "Active", json, "Booster Pack Purchase", function (response) {
		  console.log(response);
		});
		this.props.updateBalance();
	}

	updatePrice(e) {
		let quantity = e.target.value;
		console.log(quantity);
		this.setState({totalPrice: quantity * this.props.item.price}); 
	}

	render() {
		return (
		  <div className='item-modal' id='untamedModal'>
		    <div className='item-modal-content'>
		      <img src={this.props.item.img} className='item-modal-img'/>
		      <div className='close-modal' onClick={this.props.closeModal}>✖</div>
		      <h2>Buy {this.props.item.name}</h2>
		      <span style={{marginRight: '10px'}}>Quantity:</span>
		      <input type='number' min='1' onChange={this.updatePrice} style={{width: '100px', textAlign: 'right'}}/>
		      <div className='buy-container'>
		        <span><strong>Buy: </strong></span>
		        {this.props.item.acceptedCurrencies.map(currency => {
		        	let btnClass = 'buy-btn ' + currency + '-price';
		        	return (<span className={btnClass} onClick={this.buyPack} style={{cursor:'pointer'}}>{this.state.totalPrice.toLocaleString()} {currency}</span>);
		        })}
		      </div>
		    </div>
		  </div>
		);
	}
}

export default PackModal;