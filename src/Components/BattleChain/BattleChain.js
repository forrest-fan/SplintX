import React from 'react';
import './BattleChain.css';
import BattleStats from './BattleStats/BattleStats';
import BattleLog from './BattleLog/BattleLog';
import $ from 'jquery';

// $.ajax({
//     type: 'GET',
//     url: 'https://game-api.splinterlands.com/players/details?name=notswizz',
//     jsonCallback: 'testing',
//     dataType: 'json',
//     success: function(json) {
//         let rating = json.rating;
//         let league;
//         if (rating >= 0 && rating <= 99) {
//             league = 'Novice';
//         } else if (rating >= 100 && rating <= 399) {
//             league = 'Bronze III';
//         } else if (rating >= 400 && rating <= 699) {
//             league = 'Bronze II';
//         } else if (rating >= 700 && rating <= 999) {
//             league = 'Bronze I';
//         } else if (rating >= 1000 && rating <= 1299) {
//             league = 'Silver III';
//         } else if (rating >= 1300 && rating <= 1599) {
//             league = 'Silver II';
//         } else if (rating >= 1600 && rating <= 1899) {
//             league = 'Silver I';
//         } else if (rating >= 1900 && rating <= 2199) {
//             league = 'Gold III';
//         } else if (rating >= 2200 && rating <= 2499) {
//             league = 'Gold II';
//         } else if (rating >= 2500 && rating <= 2799) {
//             league = 'Gold I';
//         } else if (rating >= 2800 && rating <= 3099) {
//             league = 'Diamond III';
//         } else if (rating >= 3100 && rating <= 3399) {
//             league = 'Diamond II';
//         } else if (rating >= 3400 && rating <= 3699) {
//             league = 'Diamond I';
//         } else if (rating >= 3700 && rating <= 4199) {
//             league = 'Champion III';
//         } else if (rating >= 4200 && rating <= 4699) {
//             league = 'Champion II';
//         } else if (rating >= 4700) {
//             league = 'Champion I';
//         }
//         $.ajax({
//             type: 'GET',
//             url: "https://game-api.splinterlands.com/battle/history?player=notswizz",
//             jsonpCallback: 'testing',
//             dataType: 'json',
//             success: function(json1) {
//                 var arr = [];
//                 for (let i = 0; i < 5; ++i) {
//                     var data = {
//                         result: '',
//                         opponent: '',
//                         duration: 0,
//                         earnings: 0,
//                         scoreChange: 0,
//                         time: '',
//                         ownCards: [],
//                         opponentCards: []
//                     };
//                     //please note that this data does not need to be parsed during surrenders??
//                     //need to check if monsters exist or not
//                     //console.log("Battle #" + (i + 1));
//                     let text = JSON.parse(json.battles[i].details);
//                     //console.log(text);
//                     if (text.type === 'Surrender') {
//                         continue;
//                     }
//                     if (text.player_1 === 'notswizz') {
//                         data.result = (text.winner === text.team1.player ? 'W' : 'L');
//                         data.opponent = text.team2.player;
//                         data.duration = text.rounds.length;
//                         //data.earnings = I don't really know what the earnings are
//                         data.scoreChange = json.battles[i].player_1_rating_initial - json.battles[i].player_1_rating_final;
//                         data.time = json.battles[i].created_date.substring(0, 11);
//                         let team1L = text.team1.monsters.length;
//                         let team2L = text.team2.monsters.length;
//                         //console.log(text.team1.player + "\'s Monsters: ");
//                         for (let t1 = 0; t1 < team1L; ++t1) {
//                             var add = {
//                                 img: ''
//                             };
//                             add.img = text.team1.monsters[t1].uid;
//                             data.ownCards.push(text.team1.monsters[t1].uid);
//                             //needs to be the pictures of the monsters
//                         }
//                         //console.log("\n");
//                         //console.log(text.team2.player + "\'s Monsters: ");
//                         for (let t2 = 0; t2 < team2L; ++t2) {
//                             var add = {
//                                 img: ''
//                             };
//                             add.img = text.team2.monsters[t2].uid;
//                             data.opponentCards.push(add);
//                         }
//                     } else {
//                         data.result = (text.winner === text.team2.player ? 'W' : 'L');
//                         data.opponent = text.team1.player;
//                         data.duration = text.rounds.length;
//                         //data.earnings = I don't really know what the earnings are
//                         data.scoreChange = json.battles[i].player_2_rating_initial - json.battles[i].player_2_rating_final;
//                         data.time = json.battles[i].created_date.substring(0, 11);
//                         let team1L = text.team1.monsters.length;
//                         let team2L = text.team2.monsters.length;
//                         //console.log(text.team1.player + "\'s Monsters: ");
//                         for (let t1 = 0; t1 < team2L; ++t1) {
//                             var add = {
//                                 img: ''
//                             };
//                             add.img = text.team2.monsters[t1].uid;
//                             data.ownCards.push(add.img);
//                             //needs to be the pictures of the monsters
//                         }
//                         //console.log("\n");
//                         //console.log(text.team2.player + "\'s Monsters: ");
//                         for (let t2 = 0; t2 < team1L; ++t2) {
//                             var add = {
//                                 img: ''
//                             };
//                             add.img = text.team1.monsters[t2].uid;
//                             data.opponentCards.push(add);
//                         }
//                     }
//                     arr.push(data);
//                     //console.log(JSON.parse(json.battles[i].details));
//                 }
//             },
//             error: function(e) {
//                 console.log(e.message);
//             }
//         });
//         const stats = {
//             wins: json.wins,
//             losses: json.battles - json.wins,
//             streak: json.current_streak,
//             league: league,
//             score: 631,
//             last5: arr
//             // last5: [{
//             // 	result: 'W',
//             // 	opponent: 'splinterfighter123',
//             // 	duration: 3,
//             // 	earnings: 0.32,
//             // 	scoreChange: 82,
//             // 	time: '3:21 PM, June 3, 2020',
//             // 	ownCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}],
//             // 	opponentCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}]
//             // },
//             // {
//             // 	result: 'W',
//             // 	opponent: 'splinterwarrior987',
//             // 	duration: 5,
//             // 	earnings: 0.412,
//             // 	scoreChange: 59,
//             // 	time: '3:01 PM, June 3, 2020',
//             // 	ownCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}],
//             // 	opponentCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}]
//             // },
//             // {
//             // 	result: 'L',
//             // 	opponent: 'splinterfighter123',
//             // 	duration: 2,
//             // 	earnings: 0,
//             // 	scoreChange: -12,
//             // 	time: '2:46 PM, June 3, 2020',
//             // 	ownCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}],
//             // 	opponentCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}]
//             // },
//             // {
//             // 	result: 'L',
//             // 	opponent: 'splinterchamp',
//             // 	duration: 5,
//             // 	earnings: 0,
//             // 	scoreChange: -25,
//             // 	time: '2:42 PM, June 3, 2020',
//             // 	ownCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}],
//             // 	opponentCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}]
//             // },
//             // {
//             // 	result: 'W',
//             // 	opponent: 'splintreboss321',
//             // 	duration: 4,
//             // 	earnings: 0.491,
//             // 	scoreChange: 73,
//             // 	time: '2:36 PM, June 3, 2020',
//             // 	ownCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}],
//             // 	opponentCards: [{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	},
//             // 	{
//             // 		img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
//             // 	}]
//             // }]
//         }
//     },
//     error: function(e) {
//         console.log(e.message);
//     }
// })


class BattleChain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wins: 0,
            losses: 0,
            streak: null,
            rating: 0,
            league: null
        }
    }

    componentDidMount() {
        if (this.props.loggedIn) {
            $.ajax({
                type: 'GET',
                url: 'https://game-api.splinterlands.com/players/details?name=' + localStorage.getItem('username'),
                jsonpCallback: 'testing',
                data: 'json',
                success: function(stats) {
                    let rating = stats.rating;
                    let league = '';
                    if (rating >= 0 && rating <= 99) {
                        league = 'Novice';
                    } else if (rating >= 100 && rating <= 399) {
                        league = 'Bronze III';
                    } else if (rating >= 400 && rating <= 699) {
                        league = 'Bronze II';
                    } else if (rating >= 700 && rating <= 999) {
                        league = 'Bronze I';
                    } else if (rating >= 1000 && rating <= 1299) {
                        league = 'Silver III';
                    } else if (rating >= 1300 && rating <= 1599) {
                        league = 'Silver II';
                    } else if (rating >= 1600 && rating <= 1899) {
                        league = 'Silver I';
                    } else if (rating >= 1900 && rating <= 2199) {
                        league = 'Gold III';
                    } else if (rating >= 2200 && rating <= 2499) {
                        league = 'Gold II';
                    } else if (rating >= 2500 && rating <= 2799) {
                        league = 'Gold I';
                    } else if (rating >= 2800 && rating <= 3099) {
                        league = 'Diamond III';
                    } else if (rating >= 3100 && rating <= 3399) {
                        league = 'Diamond II';
                    } else if (rating >= 3400 && rating <= 3699) {
                        league = 'Diamond I';
                    } else if (rating >= 3700 && rating <= 4199) {
                        league = 'Champion III';
                    } else if (rating >= 4200 && rating <= 4699) {
                        league = 'Champion II';
                    } else if (rating >= 4700) {
                        league = 'Champion I';
                    }
                    this.setState({
                        wins: stats.wins,
                        losses: stats.battles - stats.wins,
                        streak: stats.current_streak,
                        rating: stats.rating,
                        league: league
                    })
                }.bind(this),
                error: function(e) {
                    console.log('There was an error retrieving your stats');
                }
            });
        }
    }

	render() {
		return(
			<div id='battlechain'>
              <div className='battlechain-header'>
			     <h2>BattleChain</h2>
                 <hr />
              </div>
			  <div className='battlechain-stats-container'>
                <div className='battlechain-stats-overview'>
                  <h3>Overview</h3>
                  <div className='battlechain-stats-overview-stat'>
                    <h4>{this.state.wins}-{this.state.losses}</h4>
                    <p>W/L</p>
                  </div>
                  <div className='battlechain-stats-overview-stat'>
                    <h4>{this.state.streak}</h4>
                    <p>STREAK</p>
                  </div>
                  <div className='battlechain-stats-overview-stat'>
                    <h4>{this.state.league}</h4>
                    <p>LEAGUE</p>
                  </div>
                  <div className='battlechain-stats-overview-stat'>
                    <h4>{this.state.rating}</h4>
                    <p>RATING</p>
                  </div>
                </div>
              </div>
			</div>
		);
	}
}

export default BattleChain;