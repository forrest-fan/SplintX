import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Market from './Components/Market/Market';
import Packs from './Components/Packs/Packs';
import BattleChain from './Components/BattleChain/BattleChain';
import Scanner from './Components/Scanner/Scanner';
import Collection from './Components/Collection/Collection';

function isLoggedIn() {
  if(localStorage.getItem('username')) {
    return true;
  } else {
    return false;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'market',
      username: localStorage.getItem('username') || '',
      loggedIn: isLoggedIn()
    };
    this.renderPage = this.renderPage.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.login = this.login.bind(this);
  }

  updatePage(newPage) {
    this.setState({
      page: newPage
    });
  }

  login(username) {
    var loggedIn;
    if (username === '') {
      loggedIn = false;
    } else {
      loggedIn = true;
    }
    this.setState({
      username: username,
      loggedIn: loggedIn
    });
  }

  renderPage(page) {
    if (page === 'market') {
      return <Market /> ;
    } else if (page === 'collection') {
      return <Collection loggedIn={this.state.loggedIn}/>
    } else if (page === 'packs') {
      return <Packs />
    } else if (page === 'battlechain') {
      return <BattleChain />
    } else if (page === 'scanner') {
      return <Scanner />
    }
  }

  render() {
    return ( 
      <div className = "App" >
        <Navbar active = {this.state.page} updatePage={this.updatePage} login={this.login} loggedIn={this.state.loggedIn}/>
        {this.renderPage(this.state.page)}
      </div>
    );
  }
}

export default App;
