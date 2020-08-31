import React from 'react';
import './TransferModal.css';
import ActionProgress from '../ActionProgress/ActionProgress';
import $ from 'jquery';

class TransferModal extends React.Component {
	constructor(props) {
		super(props);
		this.keychainRequest = this.keychainRequest.bind(this);
		this.transfer = this.transfer.bind(this);
		this.state = {
			renderProgress: false,
			progressMsg: ''
		};
	}

	keychainRequest(receive, selected, index) {
		let cardRangeLow = (index + 1) * 40 - 39;
		let cardRangeHigh = index < selected.length - 1 ? (index + 1) * 40 : cardRangeLow + selected[index].length - 1;
		let total = selected.length * 40 - 40 + selected[selected.length - 1].length;
		let cardRangeStr = cardRangeLow !== cardRangeHigh ? 'Cards ' + cardRangeLow + '-' + cardRangeHigh + ' of ' + total : 'Card ' + cardRangeLow + ' of ' + total;
		
		this.setState({
			progressMsg: ('Broadcasting request for ' + cardRangeStr + ' to the blockchain.')
		});
		let cards = selected[index];
		let transferJSON = JSON.stringify({
			to: receive,
			cards: cards,			
			app: 'steemmonsters/0.7.34'
		});
		window.hive_keychain.requestCustomJson(localStorage.getItem('username'), 'sm_gift_cards', 'Active', transferJSON, 'Transfer card(s)', function(keychainResponse) {
			if (index < selected.length - 1) {
				this.keychainRequest(receive, selected, index + 1);
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
					$.ajax({
						type: 'GET',
			  			url: url,
			  			jsonpCallback: 'testing',
			  			dataType: 'json',
						success: function(response) {
							if (response.error && response.error_code) {
								setTimeout(() => {
									$.ajax({
										type: 'GET',
							  			url: url,
							  			jsonpCallback: 'testing',
							  			dataType: 'json',
										success: function(response2) {
											if (response2.error) {
												if (index === selected.length - 1) {
													this.setState({renderProgress: false});
												}
												let toast = document.getElementById('cardsFailed-toast');
												toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error for ' + cardRangeStr;
												toast.className += ' show';
												setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
											} else {
												this.props.updateCollection('remove', cards);
												let toast = document.getElementById('cardsTransferred-toast');
												toast.innerHTML = '<i class=\'fas fa-check\'></i> ' + cardRangeStr + ' successfully transferred!';
												toast.className += ' show';
												setTimeout(() => {
													toast.className = toast.className.replace(' show', '');
													if (index === selected.length - 1) {
														setTimeout(() => {
															this.setState({renderProgress: false});
															this.props.closeModal();
														}, 200)
													}
												}, 3000);
											}
										}.bind(this),
										error: function(e) {
											console.log('Something went wrong');
										}
									});
								}, 5000);
							} else if (response.error) {
								if (index === selected.length - 1) {
									this.setState({renderProgress: false});
								}
								let toast = document.getElementById('cardsFailed-toast');
								toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error for ' + cardRangeStr;
								toast.className += ' show';
								setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
							} else {
								this.props.updateCollection('remove', cards);
								let toast = document.getElementById('cardsTransferred-toast');
								toast.innerHTML = '<i class=\'fas fa-check\'></i> ' + cardRangeStr + ' successfully transferred!';
								toast.className += ' show';
								setTimeout(() => {
									toast.className = toast.className.replace(' show', '');
									if (index === selected.length - 1) {
										setTimeout(() => {
											this.setState({renderProgress: false});
											this.props.closeModal();
										}, 200)
									}
								}, 3000);
							}
						}.bind(this),
						error: function(e) {
							console.log('Something went wrong');
						}
					});
				}, 10000);
			} else {
				if (index === selected.length - 1) {
					this.setState({renderProgress: false});
				}
				let toast = document.getElementById('cardsFailed-toast');
				toast.innerHTML = '<i class=\'fas fa-times\'></i> There was an error broadcasting ' + cardRangeStr;
				toast.className += ' show';
				setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000);
			}
		}.bind(this));
	}

	transfer() {
		let receive = document.getElementById('transferAct-input').value;
		if (receive !== '') {
			let selected = [];
			let counter = 0;
			while (counter < this.props.cards.length) {
				let segment = [];
				let segmentLength = this.props.cards.length - 40 > counter ? 40 : this.props.cards.length - counter;
				for (let i = 0; i < segmentLength; i++) {
					segment.push(this.props.cards[counter].uid);
					counter++;
				}
				selected.push(segment);
			}
			this.setState({
				renderProgress: true,
				progressMsg: 'Compiling transfer details'
			});
			this.keychainRequest(receive, selected, 0);
		} else {
			let toast = document.getElementById('noAddress-toast');
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
					<h2>Transfer Cards</h2>
					<p>Transfer <strong>{this.props.cards.length} {this.props.info.gold ? 'Gold' : ''} {this.props.info.name} Card{this.props.cards.length > 1 ? 's' : ''}</strong></p>
					<div className='transferAct'>
						Transfer to: <input placeholder='Account Name' id='transferAct-input'/>
					</div>
					<div>
						<button className='modal-action-btn' onClick={this.transfer}>Transfer</button>
					</div>
				</div>
				<div id='cardsTransferred-toast' className='toast successToast'>
					<i className='fas fa-check'></i>Successfully transferred!
				</div>
				<div id='cardsFailed-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Something went wrong! Please try again.
				</div>
				<div id='noAddress-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Please enter a receiving account.
				</div>
				{this.state.renderProgress ? <ActionProgress action='Transferring Cards' message={this.state.progressMsg} /> : '' }
			</div>
		);
	}
}

export default TransferModal;