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
		console.log(this.props.info.name);
		this.setState({
			renderModal: this.state.renderModal ? false : true
		});
	}


	render() {
	    return (
	    	<div className='card' id={this.props.info.distinctID}>
	    		<img className='card-img' src={this.props.info.img}/>
	    		{this.props.info.count > 1 ? <div className='card-qty'>{this.props.info.count}</div> : ''}
	    		{this.state.renderModal ? <CollectionCardModal info={this.props.info} closeModal={this.toggleModal}/> : <div></div>}
	    	</div>
	    );
	}
}

export default CollectionCard;