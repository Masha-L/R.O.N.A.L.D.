import React, {Component} from 'react';
import './App.css';
import {Raiting} from './Raiting.js';

export class Ranking extends Component {
  render() {
     this.data = [];
    return (
        <div className="App"> 
        <p className="instructions"> Please rate the following books on a scale from 0 to 10. Once setting the slider to a number press the submit button. 0 is the lowest score meaning that you did not like this book or are not interested in other similar books. 10 is the highest score which means that you enjoyed reading the book and would like to read other similar books. If you do not wish to the rate the book, press the skip button. </p>
        <Raiting 
            save = {
                (title, description, score, category) => {
                    this.data.push([title, description, score, category])
                }
            }

            docs = {this.props.docs}
            skip = {(_) => {}}
            onDone={this.onDone}
        />
        </div>);
  }

  onDone = () => {
      this.props.onDone(this.data)
  }
}