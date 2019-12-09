import PacmanLoader from 'react-spinners/PacmanLoader';
import { css } from '@emotion/core';
import React, {Component} from 'react';
import './App.css';

export class Loading extends Component {
  render() {
    const override = css`
        display: block;
        margin: 30px auto;
`     ;

    return (
      <div className="loading">
        <PacmanLoader
          css={override}
          sizeUnit={"px"}
          size={40}
          color={'#09d3ac'}
          loading={true}/>
        <p className="loading-text"> {this.props.loadingText}</p>
        {this.props.showFunFacts && (
            <div className="fun-facts">
              <p><b>#17: The Earliest Work of Literature</b></p>
              <p>
                The earliest known work of literature is an epic 
                poem titled the Epic of Gilgamesh, from Ancient Mesopotamia. 
                Because paper books did not exist at the time, the whole tale 
                is told on 12 tablets. Today, the Epic of Gilgamesh is available 
                on a digital tablet or e-reader.
              </p>
              <p/>
              <p><b>#39: Medieval Books Came With Curses</b></p>
              <p>
              Before the printing press was invented, books had to be written and 
              copied by hand, which imaginably took forever (years).  Because most 
              literate people in Europe were clergy, this job usually fell to monks 
              who ended up with the vocation of being a scribe.  These monk-scribes would 
              protect their life’s work with a wide variety of curses inscribed at 
              the beginning and end of the handwritten tomes.
              The curses could involve being mutilated by demonic swords, 
              the gouging of eyes, bookworms eating away at the entrails of thieves, 
              and even having the book turn into a serpent in the hands of those who 
              borrow and do not return them.  
              Most curses, however, simply involved excommunication 
              (being expelled from the Catholic Church, with an implied sentence to hell).
              </p>
            </div>
        )}
      </div>
    );
  }
}