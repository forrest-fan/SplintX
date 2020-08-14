import React from 'react';
import './PackModal.css';

class PackModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {totalPrice: this.props.item.price};
		this.updatePrice = this.updatePrice.bind(this);
		this.buyPack = this.buyPack.bind(this);
	}

	buyPack() {
		let qty = this.state.totalPrice / this.props.item.price;
		
  		var json = JSON.stringify({
    		type: "booster_pack",
   			qty: qty,
    		currency: "DEC",
    		market: "splintx",
    		app: "SplintXApp"
  		});
  		alert(json);
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
		  <div className='modal'>
		  	<div className='modal-overlay' onClick={this.props.closeModal}></div>
		    <div className='modal-content' id='itemModal'>
		    	<div className='modal-exit' onClick={this.props.closeModal}><i className='fas fa-times'></i></div>
		    	<h2>Buy {this.props.item.name}</h2>
			    <img src={this.props.item.img} className='item-modal-img'/>
				<p id='description-large'>{this.props.item.description}</p>
				<div id='description-small'>
					<p className='dropdown-btn' onClick={()=> {
						let text = document.getElementById('description-small-collapse');
						let arrow = document.getElementById('dropdown-arrow');
						if (text.style.maxHeight) {
							text.style.maxHeight = null;
							arrow.className = 'fas fa-chevron-down';
						} else {
							text.style.maxHeight = text.scrollHeight + 'px';
							arrow.className = 'fas fa-chevron-up';
						}
					}}>Description <i class='fas fa-chevron-down' id='dropdown-arrow'></i></p>
					<p id='description-small-collapse'>{this.props.item.description}</p>
				</div>
		    	<input type='number' min='1' placeholder='Purchase Quantity' onChange={this.updatePrice} className='item-qty'/>
			    <div className='buy-container'>
			    	<p className='total-price'>Total Price: {this.state.totalPrice.toLocaleString()} DEC</p>
			    	<button className='buy-item-btn'>Buy Pack</button>
			    </div>
		    </div>
		  </div>
		);
	}
}

export default PackModal;