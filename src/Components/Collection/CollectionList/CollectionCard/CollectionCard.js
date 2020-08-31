import React from 'react';
import './CollectionCard.css';
import CollectionCardModal from './CollectionCardModal/CollectionCardModal';

class CollectionCard extends React.Component {
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

	componentDidUpdate(prevProps, prevState) {
		if (prevState.renderModal && !this.state.renderModal) {
			if (this.props.info.count === 0) {
				this.props.updateCollection('remove-parent', this.props.info);
			}
		}
	}

	render() {
	    return (
	    	<div className='card' id={this.props.info.distinctID}>
	    		<img onClick={this.toggleModal} className={'card-img ' + (this.props.info.gold ? 'gold' : this.props.info.element === 'Fire' ? 'red' : this.props.info.element === 'Water' ? 'blue' : this.props.info.element === 'Earth' ? 'green' : this.props.info.element === 'Life' ? 'white' : this.props.info.element === 'Death' ? 'black' : this.props.info.element === 'Dragon' ? 'purple' : 'grey')} src={this.props.info.img} loading='lazy'/>
	    		{this.props.info.count > 1 ? <div className='card-qty'>{this.props.info.count}</div> : ''}
	    		<div className='card-price'>${this.props.info.lowPriceBCX.toFixed(3)}/BCX<br/>Total: ${(this.props.info.lowPriceBCX * this.props.info.totalBCX).toFixed(3)}</div>
	    		{this.state.renderModal ? <CollectionCardModal updateCollection={this.props.updateCollection} updateBalance={this.props.updateBalance} info={this.props.info} closeModal={this.toggleModal}/> : <div></div>}
	    	</div>
	    );
	}
}

export default CollectionCard;