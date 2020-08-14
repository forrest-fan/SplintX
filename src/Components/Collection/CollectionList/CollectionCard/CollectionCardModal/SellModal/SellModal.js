import React from 'react';
import './SellModal.css';
import ActionProgress from '../ActionProgress/ActionProgress';
import $ from 'jquery';

class SellModal extends React.Component {
	constructor(props) {
		super(props);
		this.sell = this.sell.bind(this);
		this.state = {
			renderProgress: false,
			progressMsg: ''
		};
	}

	sell() {
		this.setState({
			renderProgress: true,
			progressMsg: 'Broadcasting request to the blockchain.'
		});
		let priceBCX = document.getElementById('sellPrice-input').value;
		if (priceBCX !== '') {
			let cards = JSON.stringify(this.props.cards.map(card => {
				return {
					cards: [card.uid],
					currency: 'USD',
					price: (card.bcx * priceBCX).toString(),
					fee_pct: 500
				};
			}));
			window.hive_keychain.requestCustomJson(localStorage.getItem('username'), 'sm_sell_cards', 'Active', cards, 'Sell Card(s)', function(response) {
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
								console.log(response.error)
								if (response.error) {
									this.setState({renderProgress: false});
									let toast = document.getElementById('cardsFailed-toast');
									toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error: ' + response.error;
									toast.className += ' show';
									setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
								} else {
									this.setState({renderProgress: false});
									this.props.clearSelected();
									let toast = document.getElementById('cardsSold-toast');
									toast.className += ' show';
									setTimeout(() => {
										toast.className = toast.className.replace(' show', '');
										this.props.closeModal();
									}, 3000);
								}
							}.bind(this),
							error: function(e) {
								console.log('Something went wrong');
							}
						});
					}, 10000);	
				} else {
					this.setState({renderProgress: false});
					let toast = document.getElementById('cardsFailed-toast');
					toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error broadcasting to the blockchain.';
					toast.className += ' show';
					setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
				}
			}.bind(this));
		} else {
			let toast = document.getElementById('noPrice-toast');
			toast.className += ' show';
			setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
		}
	}

	render() {
		return(
			<div className='modal'>
				<div className='modal-overlay' onClick={this.props.closeModal}></div>
				<div className='mini modal-content'>
					<div className='modal-exit' onClick={this.props.closeModal}><i className='fas fa-times'></i></div>
					<h2>Sell Cards</h2>
					<p>Sell <strong>{this.props.cards.length} {this.props.info.gold ? 'Gold' : ''} {this.props.info.name} Card{this.props.cards.length > 1 ? 's' : ''}</strong></p>
					<p>Market Price/BCX: ${this.props.info.lowPriceBCX}/BCX</p>
					<div className='transferAct'>
						Price/BCX: $<input id='sellPrice-input' type='number' min='0' />
					</div>
					<div>
						<button className='modal-action-btn' onClick={this.sell}>List for Sale</button>
					</div>
				</div>
				<div id='cardsSold-toast' className='toast successToast'>
					<i className='fas fa-check'></i>Successfully Sold!
				</div>
				<div id='cardsFailed-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Something went wrong! Please try again.
				</div>
				<div id='noPrice-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Please enter your listing price.
				</div>
				{this.state.renderProgress ? <ActionProgress action='Listing Cards' message={this.state.progressMsg} /> : '' }
			</div>
		);
	}
}

export default SellModal;