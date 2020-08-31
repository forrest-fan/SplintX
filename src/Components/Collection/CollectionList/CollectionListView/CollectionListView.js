import React from 'react';
import './CollectionListView.css';
import CollectionCardModal from '../CollectionCard/CollectionCardModal/CollectionCardModal';

class CollectionListView extends React.Component {
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
	    			<p className={'name' + (this.props.info.gold ? ' gold' : '')}>{this.props.info.name} - <span style={{fontFamily: 'Odibee Sans'}}>{this.props.info.edition.charAt(0)}</span></p>
	    			<p className='qty center'>{this.props.info.count}</p>
	    			<p className='center'>{this.props.info.totalBCX}</p>
	    			<p className='center'>{(this.props.info.totalBCX * this.props.info.lowPriceBCX).toFixed(3)}</p>
	    		</div>
	    		{this.state.renderModal ? <CollectionCardModal updateCollection={this.props.updateCollection} updateBalance={this.props.updateBalance} info={this.props.info} closeModal={this.toggleModal} cart={this.props.cart} addToCart={this.props.addToCart} /> : ''}
	    	</div>
	    );
	}
}

export default CollectionListView;