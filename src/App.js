import React, {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';


import Typist from 'react-typist';

export class App extends Component {
  render() {
    return (
      <div className="App">
                <Particles  
                className="background"
                params={{
                  particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#ffffff" },
                    shape: {
                      type: "circle",
                      stroke: { width: 0, color: "#000000" },
                      polygon: { nb_sides: 5 },
                      image: { src: "img/github.svg", width: 200, height: 200 }
                    },
                    opacity: {
                      value: 0.5,
                      random: false,
                      anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
                    },
                    size: {
                      value: 3,
                      random: true,
                      anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
                    },
                    line_linked: {
                      enable: true,
                      distance: 150,
                      color: "#ffffff",
                      opacity: 0.4,
                      width: 1
                    },
                    move: {
                      enable: true,
                      speed: 6,
                      direction: "none",
                      random: false,
                      straight: false,
                      out_mode: "out",
                      bounce: false,
                      attract: { enable: false, rotateX: 600, rotateY: 1200 }
                    }
                  },
                  interactivity: {
                    detect_on: "canvas",
                    events: {
                      onhover: { enable: true, mode: "repulse" },
                      onclick: { enable: true, mode: "push" },
                      resize: true
                    },
                    modes: {
                      grab: { distance: 400, line_linked: { opacity: 1 } },
                      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                      repulse: { distance: 200, duration: 0.4 },
                      push: { particles_nb: 4 },
                      remove: { particles_nb: 2 }
                    }
                  },
                  retina_detect: true
              }} />
        <header className="App-header">
          <div className="container word">
            <Typist cursor={{ show: false }} >

              {/* R */}
              <span> Recommender</span>
              <Typist.Backspace count={10} delay={300} />
              <span> . </span> 

              {/* O */}
              <span> Of</span>
              <Typist.Backspace count={1} delay={300} />
              <span> . </span> 

              {/* N */}
              <span> Naturally</span>
              <Typist.Backspace count={8} delay={300} />
              <span> . </span>           

              {/* A */}
              <span> Awesome</span>
              <Typist.Backspace count={6} delay={300} />
              <span> . </span> 

              {/* L */}
              <span> Literary</span>
              <Typist.Backspace count={7} delay={300} />
              <span> . </span> 

              {/* D */}
              <span> Documents</span>
              <Typist.Backspace count={8} delay={300} />
              <span> . </span>       
              <div className="start-button-wrapper">
                <button className="start-button">
                  <Typist cursor={{ hideWhenDone: true }} >
                     start >>
                  </Typist>
                </button>
              </div>
            </Typist>
          </div>
        </header>
      </div>
    );
  }
}

