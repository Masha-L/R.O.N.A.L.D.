import React, {Component} from 'react';
import './App.css';
import Slider, {createSliderWithTooltip} from 'rc-slider';
import 'rc-slider/assets/index.css';
const SliderWithTooltip = createSliderWithTooltip(Slider);



export class Raiting extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
    //после этой строки нельзя ставить ;
      score: 5,
      option_id: 0,
      title: props.docs[0].title,
      description: props.docs[0].description,
      numRated: 0,
    };
  }

render() {
  return (
    <div className="rate"> 
      <p>{this.state.title}</p>
      <p className="description"> {this.state.description}</p>

      <SliderWithTooltip
          defaultValue={5}
          trackStyle={{ backgroundColor: '#F7AEF8', height: 10}}
          handleStyle={{
              borderColor: "none",
              height: 28,
              width: 28,
              marginLeft: -14,
              marginTop: -9,
              backgroundColor: "#09d3ac",
          }}
          min={0}
          max={10}
          tipFormatter={this.percentFormatter}
          tipProps={{ overlayClassName: 'foo' }}
          onChange={this.log}
          railStyle={{ backgroundColor: '#38bcf0', height: 10 }}/> 

      <div className={"buttons"}>
        <button className={"submit-button rating-button"} onClick={() => {
            if(this.updateInfo()) {
              this.setState({numRated:this.state.numRated+1});
              this.props.save(this.state.title, this.state.description, this.state.score);
            }
          }}>
          Submit
        </button>
        <button 
          className={"cancel-button rating-button"} 
          onClick={() => {
            if(this.updateInfo()) {
              this.props.skip();
            }
          }}>
          Skip
        </button>
      </div>
    </div>
  );
}

  percentFormatter = (v) => {
    return `${v}`;
  }

  log = (value) => {
    this.setState({
      score: value,
    });
  }

  updateInfo = () => {
    if (this.state.option_id + 1 >= this.props.docs.length || this.state.numRated >= 10) {
      this.props.onDone();
      return false;
    }
    else {
      const newTitle = this.props.docs[this.state.option_id + 1].title;
      const newDescription = this.props.docs[this.state.option_id + 1].description;
    this.setState({
      option_id: this.state.option_id + 1,
      score: this.state.score,
      title: newTitle,
      description: newDescription
    });
    return true;
    }
  }
}