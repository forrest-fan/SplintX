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
		console.log(this.props.info.name);
		this.setState({
			renderModal: this.state.renderModal ? false : true
		});
	}


	render() {
	    return (
	    	<div className='card' id={this.props.info.distinctID}>
	    		<img className='card-img' src={this.props.info.img} onClick={this.toggleModal}/>
	    		<div className='card-qty'>{this.props.info.qty}</div>
	    		{this.state.renderModal ? <MarketCardModal info={this.props.info} closeModal={this.toggleModal}/> : ''}
	    	</div>
	    );
	}
}

export default MarketCard;