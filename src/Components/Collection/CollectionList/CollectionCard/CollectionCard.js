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


	render() {
	    return (
	    	<div className='card' id={this.props.info.distinctID}>
	    		<img onClick={this.toggleModal} className={'card-img ' + (this.props.info.gold ? 'gold' : this.props.info.element === 'Fire' ? 'red' : this.props.info.element === 'Water' ? 'blue' : this.props.info.element === 'Earth' ? 'green' : this.props.info.element === 'Life' ? 'white' : this.props.info.element === 'Death' ? 'black' : this.props.info.element === 'Dragon' ? 'purple' : 'grey')} src={this.props.info.img} loading='lazy'/>
	    		{this.props.info.count > 1 ? <div className='card-qty'>{this.props.info.count}</div> : ''}
	    		{this.state.renderModal ? <CollectionCardModal info={this.props.info} closeModal={this.toggleModal}/> : <div></div>}
	    	</div>
	    );
	}
}

export default CollectionCard;