import React, {Component} from 'react';
import './App.css';
import {Landing} from './Landing.js';
import {Ranking} from './Ranking.js';
import {Results} from './Results.js';
import {Loading} from './Loading.js';

export class App extends Component {

  state =  {
    screen: "start",
    docs:[],
    results:[],
  };

  componentDidMount() {
    this.getBooksToRate();
  }

  getBooksToRate() {
    fetch('/api/books-to-rate').then(async (response) => {
      console.log("response");
      let contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const json = await response.json();
        this.setState({ docs: json });
      }
      else {
        console.log("Oops, we haven't got JSON!");
      }
    }, (reason) => console.log("rejected", reason));
  }

  getRecommendations() {
    fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(this.data)
    })
    .then(async (response) => {
      console.log("response");
      let contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const recs = await response.json();
        console.log(recs);
        this.setState({results:recs});
      }
      else {
        console.log("Oops, we haven't got JSON!");
      }
    }, (reason) => console.log("rejected", reason));
  }

  render() {
    if(this.state.screen === "start")
      return (
        <div className="App">
          <Landing onClick={this.onStartClick} docs = {this.state.docs}/>
        </div>
      );
    else if(this.state.screen === "input") {
      return <div className="App"><Ranking onDone={this.onDone} docs = {this.state.docs}/></div>
    }
    else if(this.state.screen === "done" && this.state.results.length > 0) {
      return <div className="App"><Results goBack={this.onGoBack} docs = {this.state.results}/></div>
    }
    else 
      return (
        <div className="App"> 
          <Loading 
              showFunFacts={true} 
              loadingText={
                "Getting these awesome recommendations " +
                "for you. It takes some work, but we hope you'll enjoy the results!" + 
                " In the meantime, we've got some fun facts for you :)"
                }/>
          </div>
      );
  }

  onStartClick = () => {
    this.setState({ screen: "input" });
  }

  onDone = (data) => {
    this.data = data;
    this.getRecommendations()
    console.log("done", data)
    this.setState({ screen: "done" })
  }

  onGoBack = () => {
    this.data = [];
    this.setState({ screen: "start" });
  }
}

