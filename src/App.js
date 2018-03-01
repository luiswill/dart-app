import React, { Component } from 'react';
import './App.css';

import ButtonPoint from './ButtonPoint.js';
import NewPlayerForm from "./NewPlayerForm";

import * as firebase from 'firebase';
import 'firebase/firestore';


// Bootstrap
import { Progress, Button} from 'reactstrap';


class App extends Component {
    constructor(props) {
        super(props);


        let lastThrows = [];

        this.state = {
            players: [],
            lastThrows: lastThrows,
            currentPlayerThrows: 1,
            playerIndex: 0,
            modifier: 1
        };

        this.addNewPlayer = this.addNewPlayer.bind(this);
        }

    componentWillMount() {
        this.addNewPlayer("Jack");
        this.addNewPlayer("Elias");

    }

    throwDart(dartPoints, goDirectlyToNextPlayer) {
        if(goDirectlyToNextPlayer){
            this.addPointsToPlayer(dartPoints);
            this.nextPlayerTurn();
        }else{
            let playerIndex = this.state.playerIndex;

            let modifier = this.state.modifier;
            this.addPointsToPlayer(dartPoints * modifier, playerIndex);
            this.incrementStats(dartPoints, modifier, playerIndex);

            this.setState((previousState) => ({
                currentPlayerThrows: previousState.currentPlayerThrows + 1
            }));

            this.updateModifier(1);

            if(this.state.currentPlayerThrows === 3) {
                this.nextPlayerTurn();
            }

        }

        if(dartPoints === 15) {
            this.saveStats();
        }else if (dartPoints === 14) {
            this.createNewUser();
        }
    }

    incrementStats(dartPoints, modifier, playerIndex) {
        let players = this.state.players.slice();

        players[playerIndex].throws[modifier - 1].push(dartPoints);
        players[playerIndex].numberThrows++;

        if(modifier === 2){
            players[playerIndex].doubleThrows++
        }else if(modifier === 3){
            players[playerIndex].tripleThrows++;
        }

        console.log(JSON.stringify(players[playerIndex]));

        this.setState({players: players});
    }

    saveStats() {
        //game finished
        let self = this;

        let players = this.state.players.slice();
        const db = firebase.firestore();

        players.forEach((player) => {
            console.log('player ');
            let userRef = db.collection('users').doc(player.playerName);

            db.runTransaction((transaction => {
                return transaction.get(userRef).then((doc) => {

                    if(doc.exists){
                        let pointsInGame = 301 - player.points;

                        let playerToSave = {
                            totalPoints: doc.data().totalPoints + pointsInGame,
                            averageEndScore: (doc.data().averageEndScore + player.points) / 2,
                            averageDartScore: (doc.data().averageDartScore + (pointsInGame / player.numberThrows)) / 2,
                            doubleThrows: doc.data().doubleThrows + player.doubleThrows,
                            tripleThrows: doc.data().tripleThrows + player.tripleThrows
                        };

                        transaction.update(userRef, playerToSave);
                    }else {
                        this.createNewUser(player);
                    }

                })
            })).then((success) => {
                console.log("User : " + player.playerName + " saved.");
            }).catch((error) => {
                console.log("Error " + error);
            });
        });
    }

    createNewUser(player) {
        const db = firebase.firestore();
        //points: 301, playerName: "Jack", throws: [[], [], []], numberThrows: 0, totalScore: 0, doubleThrows: 0, tripleThrows: 0}

        console.log('test' + player.throws[0][0] + player.throws[0][1] + player.throws[0][2]);



        let playerToSave = {
            playerName: player.playerName,
            totalPoints: 301 - player.points,
            averageEndScore: player.points,
            averageDartScore: (301 - player.points) / player.numberThrows,
            doubleThrows: player.doubleThrows,
            tripleThrows: player.tripleThrows,
            simpleThrowsPoints: [],
            doubleThrowsPoints: player.throws[0][1],
            tripeThrowsPoints: [],
        };

        console.log(JSON.stringify(playerToSave));

        db.collection('users').doc(player.playerName).set(playerToSave).then((success) => {
            console.log('Player ' + player.playerName + ' has been added.');
        }).catch((error) => {
            console.log('Player ' + player.playerName + ' has not been added.' + error);
        });
    }

    updateModifier(value) {
        this.setState({modifier: value});
    }

    nextPlayerTurn() {
        let newPlayerIndex = this.state.playerIndex + 1;
        if(newPlayerIndex === this.state.players.length){
            newPlayerIndex = 0;
        }

        this.setState({playerIndex: newPlayerIndex, currentPlayerThrows: 1});
        this.resetThrowHistory(newPlayerIndex);
    }

    addPointsToPlayer(dartPoints, playerIndex) {
        let players = this.state.players;

        players[playerIndex].points -= dartPoints;
        this.updateThrowHistory(dartPoints);

        this.forceUpdate();
    }

    updateThrowHistory(dartPoints){
        let modifiedThrows = this.state.lastThrows.slice();
        modifiedThrows.push(dartPoints);

        this.setState({lastThrows: modifiedThrows});
    }

    resetThrowHistory(playerIndex){
        let newLastThrows = [];
        this.setState({lastThrows: newLastThrows});
    }


    renderButton(dartPoints) {
        return <ButtonPoint
            value={dartPoints}
            onClick={() => this.throwDart(dartPoints)}
        />;
    }

    addNewPlayer(playerName) {
        let newUser = {points: 301, playerName: playerName, throws: [[], [], []], numberThrows: 0, totalScore: 0, doubleThrows: 0, tripleThrows: 0};
        let newPlayers = this.state.players ? this.state.players.slice() : [];
        console.log("Playe rs : " + JSON.stringify(newPlayers));
        newPlayers.push(newUser);

        console.log(JSON.stringify(newUser) + " added");

        console.log("Playe rs : " + JSON.stringify(newPlayers));

        this.setState({players: newPlayers});
    }

  render() {
        const self = this;

        return (
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">VI Dart App</h1>
            </header>

              <div className="SettingsInterface">
                  <NewPlayerForm handleChange={this.addNewPlayer} />
              </div>

              <div className="Players">

                  <ul className="lastThrows">
                      {self.state.lastThrows.map(function(score, indexScore){
                          return (
                              <li key={indexScore}>{score}</li>
                          );
                      })}
                  </ul>

                  <div className="PlayerContainer" >
                  {this.state.players.map(function (player, indexPlayer) {
                      return (
                              <div className={self.state.playerIndex === indexPlayer ? 'player--active' : 'player'} key={indexPlayer}>
                                  {player.playerName} {self.state.playerIndex === indexPlayer ? <span className="yourTurn"></span> : false}
                                  <br/>
                                   {player.points}
                                   <br/>
                                  <Progress animated color="success" value={301 - player.points} max={301}/>
                          </div>           )
                  })}

                  </div>
              </div>

              <div className="App-intro">
                  <div className="modifierContainer">
                      <Button color="warning" outline className=" " block onClick={() => this.updateModifier(2)}>double</Button>
                      <Button color="warning" outline className=" " block onClick={() => this.updateModifier(3)}>triple</Button>
                  </div>


                  <div className="buttonContainer">
                              {this.renderButton(1)}
                              {this.renderButton(2)}
                              {this.renderButton(3)}
                              {this.renderButton(4)}
                              {this.renderButton(5)}
                              {this.renderButton(6)}
                              {this.renderButton(7)}
                              {this.renderButton(8)}
                              {this.renderButton(9)}
                              {this.renderButton(10)}

                              {this.renderButton(11)}
                              {this.renderButton(12)}
                              {this.renderButton(13)}
                              {this.renderButton(14)}
                              {this.renderButton(15)}
                              {this.renderButton(16)}
                              {this.renderButton(17)}
                              {this.renderButton(18)}
                              {this.renderButton(19)}
                              {this.renderButton(20)}
                  </div>

                  <div className="bullContainer">
                      <Button color="success" className="specials bullshit" block onClick={() => this.throwDart(0)}>Bullsh*t 💩</Button>
                      <Button color="success" className="specials special20-5-1" block onClick={() => this.throwDart(26, true)}>20 + 5 + 1</Button>
                  </div>

                  <div className="bullContainer">
                      <Button className="specials bull" block onClick={() => this.throwDart(25)}>Bull </Button>
                      <Button className="specials triple20" block onClick={() => this.throwDart(60, true)}>🔥 TRIPLE 20 🔥</Button>
                  </div>



            </div>
          </div>
    );
  }
}




// class PlayerTurn extends React.Component{
//     constructor(props) {
//         super(props);
//         this.state = {
//             name: "Test"
//         };
//     }
//
//     updateState(newPlayerName) {
//         this.setState({name: newPlayerName});
//     }
//
//     render() {
//         return (
//             <h2 className="NextPlayer">Player's turn : {this.state.name}</h2>
//         );
//     }
// }



export default App;
