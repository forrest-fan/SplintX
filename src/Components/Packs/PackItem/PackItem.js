import React from 'react';
import PackModal from './PackModal/PackModal';

class PackItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {openModal: false};
		this.toggleModal = this.toggleModal.bind(this);
	}

	toggleModal() {
		this.state.openModal ? this.setState({openModal: false}) : this.setState({openModal: true});
	}

	render() {
		return (
			<div>
			<div className='item-container' onClick={this.toggleModal}>
			    <img src={this.props.item.img} className='item-img'/>
			    <div className='item-description'>
			      <h2>{this.props.item.name}</h2>
			      <p className='price'>{this.props.item.price.toLocaleString()} {this.props.item.acceptedCurrencies.map(currency => {
			      	if (this.props.item.acceptedCurrencies.indexOf(currency) === this.props.item.acceptedCurrencies.length - 1) {
			      		return currency.toUpperCase();
			      	} else {
			      		return currency.toUpperCase() + '/';
			      	}
			      })} PER PACK</p>
			      <p>{this.props.item.description}</p>
			    </div>
			  </div>
			  {this.state.openModal ? <PackModal item={this.props.item} closeModal={this.toggleModal}/> : <div></div>}
			</div>
		);
	}
}

export default PackItem;