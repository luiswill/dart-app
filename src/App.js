import React, { Component } from 'react';
import './App.css';

import ButtonPoint from './ButtonPoint.js';
import NewPlayerForm from "./NewPlayerForm";


// Bootstrap
import { Progress, Button} from 'reactstrap';


class App extends Component {
    constructor(props) {
        super(props);

        let user1 = {points: 301, playerName: "Jack", lastThrows: []};
        let user2 = {points: 301, playerName: "Elias", lastThrows: []};

        let players = [user1, user2];

        this.state = {
            players: players,
            currentPlayerThrows: 1,
            playerIndex: 0,
            modifier: 1
        };

        this.addNewPlayer = this.addNewPlayer.bind(this);


        const firebase = require("firebase");
        // Required for side-effects
        require("firebase/firestore");

        // Initialize Firebase
        const config = {
            apiKey: "AIzaSyCho4CPFQApEpbdhUahV0EiiXBQc-86sFI",
            authDomain: "myfirstapp-8925d.firebaseapp.com",
            databaseURL: "https://myfirstapp-8925d.firebaseio.com",
            projectId: "myfirstapp-8925d",
            storageBucket: "myfirstapp-8925d.appspot.com",
            messagingSenderId: "1084840290070"
        };

        firebase.initializeApp(config);

    }

    componentWillMount() {
        this.firebaseRef = firebase.database().ref("items");
        this.firebaseRef.on("child_added", function(dataSnapshot) {
            this.setState({
                items: this.items
            });
        }.bind(this));
    }

    throwDart(dartPoints, goDirectlyToNextPlayer) {
        if(goDirectlyToNextPlayer){
            this.addPointsToPlayer(dartPoints);
            this.nextPlayerTurn();
        }else{
            let modifier = this.state.modifier;
            this.addPointsToPlayer(dartPoints * modifier);

            this.setState((previousState) => ({
                currentPlayerThrows: previousState.currentPlayerThrows + 1
            }));

            this.updateModifier(1);

            if(this.state.currentPlayerThrows === 3) {
                this.nextPlayerTurn();
            }
        }
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

    addPointsToPlayer(dartPoints) {
        let players = this.state.players;
        let playerIndex = this.state.playerIndex;

        players[playerIndex].points -= dartPoints;
        this.updateThrowHistory(dartPoints, playerIndex);

        this.forceUpdate();
    }

    updateThrowHistory(dartPoints, playerIndex){
        let players = this.state.players.slice();
        let throwsOfPlayer = players[playerIndex].lastThrows.slice();
        throwsOfPlayer.push(dartPoints);

        players[playerIndex].lastThrows = throwsOfPlayer;

        this.setState({players: players});
    }

    resetThrowHistory(playerIndex){
        let players = this.state.players.slice();
        let throwsOfPlayer = players[playerIndex].lastThrows.slice();

        players[playerIndex].lastThrows = [];

        this.setState({players: players});
    }


    renderButton(dartPoints) {
        return <ButtonPoint
            value={dartPoints}
            onClick={() => this.throwDart(dartPoints)}
        />;
    }

    addNewPlayer(playerName) {
        let newUser = {points: 301, playerName: playerName, lastThrows: []};

        let newPlayers = this.state.players.slice();
        newPlayers.push(newUser);

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

                  <div className="PlayerContainer" >
                  {this.state.players.map(function (player, indexPlayer) {
                      return (
                              <div className={self.state.playerIndex === indexPlayer ? 'player--active' : 'player'} key={indexPlayer}>
                                  {player.playerName} {self.state.playerIndex === indexPlayer ? <span className="yourTurn"></span> : false}
                                  <br/>
                                   {player.points}
                                   <br/>
                                   <ul className="lastThrows">
                                  {self.state.players[indexPlayer].lastThrows.map(function(score, indexScore){
                                      return (
                                              <li key={indexScore}>{score}</li>
                                          );
                                  })}
                                   </ul>
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
