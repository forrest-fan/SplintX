import React from 'react';
import './ActionProgress.css';

class ActionProgress extends React.Component {
	render() {
		return(
			<div className='modal'>
				<div className='modal-overlay'></div>
				<div className='progress modal-content'>
					<h2>{this.props.action} Cards</h2>
					<div className='loader-modal-container'><div className='loader-modal'></div></div>
					<p className='progress-msg'>{this.props.message}</p>
				</div>
			</div>
		);
	}
}

export default ActionProgress;