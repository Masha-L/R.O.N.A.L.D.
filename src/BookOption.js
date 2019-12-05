import React, {Component} from 'react';
import './App.css';


export class BookOption extends Component {
  render() {
    return(
      <div className={"book"}>
        <p className={"title"}>{this.props.title}</p> 
        <p>{this.props.description}</p> 
      </div>);
  }
}