import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Market from './Components/Market/Market';
import Packs from './Components/Packs/Packs';
import BattleChain from './Components/BattleChain/BattleChain';
import Scanner from './Components/Scanner/Scanner';
import Collection from './Components/Collection/Collection';
import $ from 'jquery';

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
      page: '',
      username: localStorage.getItem('username') || '',
      loggedIn: isLoggedIn(),
      DECbalance: null,
      cardDetails: null
    };
    this.renderPage = this.renderPage.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
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
      return <Market updateBalance={this.updateBalance} cardDetails={this.state.cardDetails}/> ;
    } else if (page === 'collection') {
      return <Collection updateBalance={this.updateBalance} loggedIn={this.state.loggedIn} cardDetails={this.state.cardDetails}/>
    } else if (page === 'packs') {
      return <Packs />
    } else if (page === 'battlechain') {
      return <BattleChain loggedIn={this.state.loggedIn}/>
    } else if (page === 'scanner') {
      return <Scanner />
    }
  }

  componentDidMount() {
    if (sessionStorage.getItem('cardDetails') && JSON.parse(sessionStorage.getItem('cardDetails')).expiry < (new Date())) {
      if (this.state.loggedIn) {
        $.ajax({
          type: 'GET',
          url: 'https://game-api.splinterlands.com/players/balances?username=' + this.state.username,
          jsonpCallback: 'testing',
          dataType: 'json',
          success: function(balances) {
            let DECbalance = 0;
            for (let i = 0; i < balances.length; i++) {
              if (balances[i].token === 'DEC') {
                DECbalance = balances[i].balance;
              }
            }
            this.setState({
              page: 'market',
              DECbalance: DECbalance,
              cardDetails: JSON.parse(sessionStorage.getItem('cardDetails')).data
            });
          }.bind(this),
          error: function(e) {
            console.log('There was an error getting the DEC balance');
          }
        }); 
      } else {
        this.setState({
          page: 'market',
          cardDetails: JSON.parse(sessionStorage.getItem('cardDetails')).data
        });
      }
    } else {
      if (this.state.loggedIn) {
        $.ajax({
          type: 'GET',
          url: 'https://game-api.splinterlands.com/cards/get_details',
          jsonpCallback: 'testing',
          success: function(cardDetails) {
            $.ajax({
              type: 'GET',
              url: 'https://game-api.splinterlands.com/players/balances?username=' + this.state.username,
              jsonpCallback: 'testing',
              dataType: 'json',
              success: function(balances) {
                let DECbalance = 0;
                for (let i = 0; i < balances.length; i++) {
                  if (balances[i].token === 'DEC') {
                    DECbalance = balances[i].balance;
                  }
                }
                let expiry = new Date();
                expiry.setDate(expiry.getDate() + 3);
                expiry.setUTCHours(0, 0, 0, 0);
                let detailObj = {
                  expiry: expiry, 
                  data: cardDetails
                }
                sessionStorage.setItem('cardDetails', JSON.stringify(detailObj));
                this.setState({
                  page: 'market',
                  DECbalance: DECbalance,
                  cardDetails: cardDetails
                });
              }.bind(this),
              error: function(e) {
                console.log('There was an error getting the DEC balance');
              }
            }); 
          }.bind(this),
          error: function(e) {
            console.log('There was an error getting the card details');
          }
        }); 
      } else {
        $.ajax({
          type: 'GET',
          url: 'https://game-api.splinterlands.com/cards/get_details',
          jsonpCallback: 'testing',
          success: function(cardDetails) {
            let expiry = new Date();
            expiry.setDate(expiry.getDate() + 3);
            expiry.setUTCHours(0, 0, 0, 0);
            let detailObj = {
              expiry: expiry, 
              data: cardDetails
            }
            sessionStorage.setItem('cardDetails', JSON.stringify(detailObj));
            this.setState({
              page: 'market',
              cardDetails: cardDetails
            });
          }.bind(this),
          error: function(e) {
            console.log('There was an error getting the card details');
          }
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loggedIn !== prevState.loggedIn) {
      if (this.state.loggedIn) {
        $.ajax({
          type: 'GET',
          url: 'https://game-api.splinterlands.com/players/balances?username=' + this.state.username,
          jsonpCallback: 'testing',
          dataType: 'json',
          success: function(balances) {
            let DECbalance = 0;
            for (let i = 0; i < balances.length; i++) {
              if (balances[i].token === 'DEC') {
                DECbalance = balances[i].balance;
              }
            }
            this.setState({DECbalance: DECbalance});
          }.bind(this),
          error: function(e) {
            console.log('There was an error getting the DEC balance');
          }
        });
      }
    }
  }

  updateBalance() {
    if (this.state.loggedIn) {
      setTimeout(() => {$.ajax({
        type: 'GET',
        url: 'https://game-api.splinterlands.com/players/balances?username=' + this.state.username,
        jsonpCallback: 'testing',
        dataType: 'json',
        success: function(balances) {
          let DECbalance = 0;
          for (let i = 0; i < balances.length; i++) {
            if (balances[i].token === 'DEC') {
              DECbalance = balances[i].balance;
            }
          }
          this.setState({DECbalance: DECbalance});
        }.bind(this),
        error: function(e) {
          console.log('There was an error getting the DEC balance');
        }
      })}, 10000);
    }
}

  render() {
    return ( 
      <div className = "App" >
        <Navbar active = {this.state.page} updatePage={this.updatePage} login={this.login} loggedIn={this.state.loggedIn} balance={this.state.DECbalance}/>
        {this.renderPage(this.state.page)}
      </div>
    );
  }
}

export default App;
