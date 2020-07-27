import React from 'react';
import './MarketListView.css';
import MarketCardModal from '../MarketCard/MarketCardModal/MarketCardModal';

class MarketListView extends React.Component {
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
	    	<div className='list-item-container' id={this.props.info.distinctID}>
	    		<div className='list-item' onClick={this.toggleModal}>
	    			<i className={(this.props.info.gold ? 'gold' : this.props.info.element.toLowerCase()) + ' fas center ' + (this.props.info.element === 'Fire' ? 'fa-fire' : this.props.info.element === 'Water' ? 'fa-tint' : this.props.info.element === 'Earth' ? 'fa-leaf' : this.props.info.element === 'Life' ? 'fa-star-of-life' : this.props.info.element === 'Death' ? 'fa-skull' : this.props.info.element === 'Dragon' ? 'fa-dragon' : 'fa-dumbbell')}></i>
	    			<p className={'name' + (this.props.info.gold ? ' gold' : '')}>{this.props.info.name} <span>{this.props.info.gold ? ' (Gold)' : ''}</span></p>
	    			<p className='qty center'>{this.props.info.qty}</p>
	    			<p className='lowPrice center'>${this.props.info.lowPrice.toFixed(2)}</p>
	    			<p className='lowPriceBCX center'>${this.props.info.lowPriceBCX.toFixed(2)}</p>
	    		</div>
	    		{this.state.renderModal ? <MarketCardModal info={this.props.info} closeModal={this.toggleModal} cart={this.props.cart} addToCart={this.props.addToCart} /> : ''}
	    	</div>
	    );
	}
}

export default MarketListView;