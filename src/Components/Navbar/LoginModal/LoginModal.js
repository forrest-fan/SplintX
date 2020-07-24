import React from 'react';
import './LoginModal.css';

function isLoggedIn() {
  if(localStorage.getItem('username')) {
    return true;
  } else {
    return false;
  }
}

class LoginModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: isLoggedIn(),
			username: ''
		};
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	handleUsernameChange(e) {
		this.setState({username: e.target.value});
	}

	handleLogin() {
		let username = this.state.username;
    	let message = username + Date.now();
    	if(window.hive_keychain) {
      		window.hive_keychain.requestSignBuffer(username, message, "Posting", function(response) {
	        	var success = response["success"];
	        	if (success) {
		       		let toast = document.getElementById('loginModal-success-toast');
					toast.className += ' show';
	    			setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000)
	          		localStorage.setItem('username', username);
		       		this.props.login(username);
		       		this.setState({loggedIn: true});
	       		} else {

	       			let toast = document.getElementById('loginModal-fail-toast');
					toast.className += ' show';
	    			setTimeout(() => {toast.className = toast.className.replace(' show', '')}, 3000)
	       		}
       		}.bind(this))
      	} else {
      		alert('Please get Hive Keychain to login to SplintX');
      	}
	}

	handleLogout() {
		localStorage.removeItem("username");
	    this.setState({loggedIn: false});
	    this.props.login('');
	}

	render() {
		return(
			<div className='loginModal'>
				<div className='loginModal-overlay' onClick={this.props.closeModal}></div>
				<div className='loginModal-content'>
					<div className='loginModal-exit' onClick={this.props.closeModal}><i className='fas fa-times'></i></div>
					{!this.state.loggedIn ? 
						<div>
							<h2>Login to SplintX</h2>
							<h4>with Hive Keychain</h4>
						</div> :
						<div>
							<h2>Hi {localStorage.getItem('username')}!</h2>
							<h4>You're logged in to SplintX</h4>
						</div> }
					<div id='lockIcon'>{this.state.loggedIn ? <i className='fas fa-unlock loginModal-unlock-icon'></i> : <i className='fas fa-lock loginModal-lock-icon'></i> }</div>
					{!this.state.loggedIn ?
						<div>
							<input placeholder='Username' className='loginModal-username' onChange={this.handleUsernameChange}/>
							<button disabled={this.state.username === ''} onClick={this.handleLogin}>Login</button>
							<br/>
							<br/>
							<p>Don't have Hive Keychain? Get it <a href='https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep'>here</a>.</p>
						</div> : 
						<button onClick={this.handleLogout}>Logout</button> }
				</div>
				<div id='loginModal-success-toast' className='toast successToast'>
					<i className='fas fa-check'></i>Successfully Logged In!
				</div>
				<div id='loginModal-fail-toast' className='toast failToast'>
					<i className='fas fa-times'></i>Please check your username and try again.
				</div>
			</div>
		);
	}
}

export default LoginModal;