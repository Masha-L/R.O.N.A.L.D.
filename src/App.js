import React, {Component} from 'react';
import './App.css';
import {Landing} from './Landing.js';
import {Ranking} from './Ranking.js';
import {getTitles} from './DataAPI.js';
import{Results} from './Results.js';

export class App extends Component {

  state =  {
    screen: "start",
  };

  render() {

    const docs = getTitles();
    if(this.state.screen === "start")
      return (
        <div className="App">
          <Landing onClick={this.onStartClick}/>
        </div>
      );
    else if(this.state.screen === "input") {
      return <div className="App"><Ranking onDone={this.onDone} docs = {docs.slice(0,3)}/></div>
    }
    else 
      return <div className="App"><Results goBack={this.onGoBack} docs = {docs.slice(3,7)}/></div>
  }

  onStartClick = () => {
    this.setState({ screen: "input" });
  }

  onDone = (data) => {
    this.data = data;
    this.setState({ screen: "done" })
  }

  onGoBack = () => {
    this.data = [];
    this.setState({ screen: "start" });
  }
}

