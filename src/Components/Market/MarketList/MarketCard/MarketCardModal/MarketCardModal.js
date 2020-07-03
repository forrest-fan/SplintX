import React from 'react';
import './MarketCardModal.css';

class MarketCardModal extends React.Component {
	render() {
	    return (
	    	<div className='cardModal'>
	    		<div className='cardModal-overlay' onClick={this.props.closeModal}></div>
	    		<div className='cardModal-content' >
        			<div className='cardModal-exit' onClick={this.props.closeModal}><i className='fas fa-times'></i></div>
	    			<h2>{this.props.info.name}</h2>
	    		</div>
	    	</div>
	    );
	}
}

export default MarketCardModal;