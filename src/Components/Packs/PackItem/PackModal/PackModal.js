import React from 'react';
import './PackModal.css';
import ActionProgress from '../../../Collection/CollectionList/CollectionCard/CollectionCardModal/ActionProgress/ActionProgress';
import $ from 'jquery';

class PackModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			totalPrice: this.props.item.price,
			renderProgress: false,
			progressMsg: ''
		};
		this.updatePrice = this.updatePrice.bind(this);
		this.buyPack = this.buyPack.bind(this);
	}

	buyPack() {
		if (localStorage.getItem('username')) {
			let qty = document.getElementById('qty-input').value || 1;
			if (this.state.totalPrice < this.props.balance.DEC) {
				this.setState({
					renderProgress: true,
					progressMsg: 'Broadcasting request to the blockchain'
				});
				var json = {};
				if (this.props.item.keychainCode === 'sm_purchase') {
					json = {
			    		type: this.props.item.code,
			   			qty: qty,
			    		currency: "DEC",
			    		market: "splintx",
			    		app: "SplintXApp"
			  		};
			  		if (json.type === 'potion') {
			  			json.data = {potion_type: this.props.item.potion_type};
			  		}
				} else {
					json = {
						qty: qty,
			    		app: "SplintXApp"	
					};
				}
		  		json = JSON.stringify(json);
				window.hive_keychain.requestCustomJson(localStorage.getItem('username'), this.props.item.keychainCode, "Active", json, "Pack Purchase", function (response) {
					if (response.success) {
						this.setState({progressMsg: 'Step 1 of 2 complete - Request successfully broadcasted'}, () => {
							setTimeout(() => {
								this.setState({progressMsg: 'Gathering request results.'});
							}, 2000);
						});
						let id = response.result.id;
						let url = 'https://game-api.splinterlands.io/transactions/lookup?trx_id=' + id;
						setTimeout(() => {
							$.ajax({
								type: 'GET',
					  			url: url,
					  			jsonpCallback: 'testing',
					  			dataType: 'json',
								success: function(response) {
									if (response.error) {
										this.setState({renderProgress: false});
										let toast = document.getElementById('cardsFailed-toast');
										toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error: ' + response.error;
										toast.className += ' show';
										setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
									} else {
										this.setState({renderProgress: false});
										let toast = document.getElementById('buySuccess-toast');
										toast.className += ' show';
										setTimeout(() => {
											toast.className = toast.className.replace(' show', '');
											this.props.updateBalance();
											this.props.closeModal();
										}, 3000);	
									}
								}.bind(this),
								error: function(e) {
									console.log('Something went wrong');
								}
							});
						}, 12000);
					} else {
						this.setState({renderProgress: false});
						let toast = document.getElementById('cardsFailed-toast');
						toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error broadcasting to the blockchain.';
						toast.className += ' show';
						setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
					}
				}.bind(this));
			} else {
				let toast = document.getElementById('noMoney-toast');
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			}
		} else {
				let toast = document.getElementById('login-toast');
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
		}
	}

	updatePrice(e) {
		let quantity = e.target.value;
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
			    	<input type='number' min='1' placeholder='Purchase Quantity' onChange={this.updatePrice} id='qty-input' className='item-qty'/>
				    <div className='buy-container'>
				    	<p className='total-price'>Total Price: {this.state.totalPrice.toLocaleString()} DEC</p>
				    	<button className='buy-item-btn' onClick={this.buyPack}>Buy Pack</button>
				    </div>
			    </div>
			    <div id='cardsFailed-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Something went wrong! Please try again.
				</div>
				<div id='noMoney-toast' className='toast failToast'>
					<i className='fas fa-times'></i>You don't have enough DEC to purchase this.
				</div>
				<div id='login-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Please log in to purchase packs and items.
				</div>
				<div id='buySuccess-toast' className='toast successToast'>
					<i className='fas fa-check'></i>Successfully purchased!
				</div>
				{this.state.renderProgress ? <ActionProgress action='Buying Packs' message={this.state.progressMsg} /> : '' }
			</div>
		);
	}
}

export default PackModal;