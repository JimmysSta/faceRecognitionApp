import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: 'a490b4c2447b4afeadf659386074695a'
});

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 1000
      }
    }  
  }  
} 

class App extends Component {

constructor() {
  super();
  this.state = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
  }
}

  calculateFace = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('img');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
  }

  displayFace = (box) => {
    this.setState({box: box});
  }

  onChangeOfInput = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then((response) => {
      this.displayFace(this.calculateFace(response));
    },
    function(err) {
      console.log(err);
    }
  );  
 }
  onRouteChange = (route) => {
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange}/>
        {this.state.route === 'signin'
          ? <Signin onRouteChange={this.onRouteChange}/>
          : <div>
              <ImageLinkForm onChangeOfInput = {this.onChangeOfInput} onButtonSubmit={this.onButtonSubmit} />
              <Rank />
              <FaceRecognition box={this.state.box} imageUrl = {this.state.imageUrl} />
            </div> 
        }
      </div>
    );
  }
}

export default App;
