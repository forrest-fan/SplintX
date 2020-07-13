import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Market from './Components/Market/Market';
import Packs from './Components/Packs/Packs';
import BattleChain from './Components/BattleChain/BattleChain';
import Scanner from './Components/Scanner/Scanner';
import Collection from './Components/Collection/Collection';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'market'
    };
    this.renderPage = this.renderPage.bind(this);
    this.updatePage = this.updatePage.bind(this);
  }

  updatePage(newPage) {
    this.setState({
      page: newPage
    });
  }
  //calls the Log in function when the page is first loaded to check if user is logged in.
  window.onload = isLoggedIn();

  function isLoggedIn() {
    if(localStorage.getItem('username')) {
      //signed in
      $('#username').replaceWith("<div id=\"loggedin\">You are logged in as: "+ localStorage.getItem('username') +"</div>");
      document.getElementById("button").innerHTML = "Log Out";
      document.getElementById("button").onclick = logout;
    }
  }

  function login() {
    var username = document.getElementById("username").value;
    //alert(username);
    message = username + Date.now();
    if(window.hive_keychain) {
      //alert("has keychain");
      hive_keychain.requestSignBuffer(username, message, "Posting", function(response) {
        console.log(response);
        var success = response["success"];
        if (success) {
          localStorage.setItem('username', username);
          $('#username').replaceWith("<div id=\"loggedin\">You are logged in as: "+ localStorage.getItem('username') +"</div>");
          document.getElementById("button").innerHTML = "Log Out";
          document.getElementById("button").onclick = logout;
       }
     })
   }
   return false;
  }
  function logout() {
    //alert("logged out");
    $('#loggedin').replaceWith("<input type=\"text\" class=\"form-control\" placeholder=\"Hive Username\" id=\"username\">");
    //document.getElementById("username").value = "";
    document.getElementById("button").innerHTML = "Log In";
    document.getElementById("button").onclick = login;
    localStorage.removeItem("username");
  }

  renderPage(page) {
    if (page === 'market') {
      return <Market / > ;
    } else if (page === 'collection') {
      return <Collection / >
    } else if (page === 'packs') {
      return <Packs / >
    } else if (page === 'battlechain') {
      return <BattleChain / >
    } else if (page === 'scanner') {
      return <Scanner / >
    }
  }

  render() {
    return ( 
      <div className = "App" >
        <Navbar active = {this.state.page} updatePage = {this.updatePage}/>
        {this.renderPage(this.state.page)}
      </div>
    );
  }
}

export default App;
