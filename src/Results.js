import React, {Component} from 'react';
import './App.css';
import {BookOption} from './BookOption.js'

export class Results extends Component {

  constructor(props){
    super(props);
    this.state = {
      numRecs: 1,
    };
  };
  render(){
    const docs = this.props.docs;
    const children = this.setUpChildren(docs);
    return (
    <div className="results">
      <p className="instructions"> 
          Here are some of the books we'd like to recommend for you. 
          Thank you for using R.O.N.A.L.D! 
      </p>
      <div id="children-pane">
        {children}
       </div>
       <div className="card calculator">
       <span>
       <button className = "cancel-button rating-button" onClick={this.props.goBack}> Go back </button>
       {(this.state.numRecs < this.props.docs.length) ? <button className = "submit-button rating-button" onClick = {this.addOptions}> Show more options </button>: null}
       </span>
       </div>
      
       </div>
    );
  }

  setUpChildren = (docs) => {
    let children = [];
    for (var i = 0; i < this.state.numRecs; i++) {
      children.push(<BookOption key = {i} title={docs[i].title} description={docs[i].description}/>);
    }
    return children;
  }

  addOptions = () => {
    const newNumRecs = this.state.numRecs+1;
    this.setState({numRecs:newNumRecs});
  }
}