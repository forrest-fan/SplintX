import React from 'react';
import './MarketCard.css';
import MarketCardModal from './MarketCardModal/MarketCardModal';

class MarketCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			renderModal: false
		};
		this.toggleModal = this.toggleModal.bind(this);
	}

	toggleModal() {
		this.setState({
			renderModal: this.state.renderModal ? false : true
		});
	}


	render() {
	    return (
	    	<div className='card' id={this.props.info.distinctID}>
	    		<div>
	    			<img className='card-img' src={this.props.info.img} onClick={this.toggleModal} loading='lazy'/>
		    		<div className='card-qty'>{this.props.info.qty}</div>
		    		<div className='card-price'>${this.props.info.lowPrice.toFixed(2)} | ${this.props.info.lowPriceBCX.toFixed(2)}/BCX</div>
	    		</div>
	    		{this.state.renderModal ? <MarketCardModal info={this.props.info} closeModal={this.toggleModal} cart={this.props.cart} addToCart={this.props.addToCart} /> : ''}
	    	</div>
	    );
	}
}

export default MarketCard;