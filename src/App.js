import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';


const particlesOptions = {
  "particles": {
      "number": {
          "value": 300,
          "density": {
              "enable": false
          }
      },
      "size": {
          "value": 4,
          "random": true,
          "anim": {
              "speed": 4,
              "size_min": 1.3
          }
      },
      "line_linked": {
          "enable": false
      },
      "move": {
          "random": true,
          "speed": 1,
          "direction": "top",
          "out_mode": "out"
      }
  },
  "interactivity": {
      "events": {
          "onhover": {
              "enable": true,
              "mode": "bubble"
          },
          "onclick": {
              "enable": true,
              "mode": "repulse"
          }
      },
      "modes": {
          "bubble": {
              "distance": 250,
              "duration": 2,
              "size": 0,
              "opacity": 0
          },
          "repulse": {
              "distance": 400,
              "duration": 4
          }
      }
  }
}
class App extends Component {
    constructor() {
        super();
        this.state = {
            input:'',
            imageUrl:'',
            box:{},
            route:'signin',
            isSignedIn:false,
            user: {
              id:'',
              name:'',
              email:'',
              entries:'',
              joined: ''
            }
        }
    }

    loadUser = (data) => {
      this.setState({user: {
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined: data.joined
      }})
    } 

    calculateFaceLocation = (data) => {
      const clarifaiFace = data;
      const image =document.getElementById('imageDetails');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    }

    displayFaceBox = (box) => {
      this.setState({box: box});

    }
    onInputChange = (event) => {
        this.setState({input:event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({imageUrl:this.state.input})
        fetch('https://cryptic-bayou-38629.herokuapp.com/getbox', {
          method:"POST",
          headers:{"Content-Type": "application/json"},
          body:JSON.stringify({
            url:this.state.input
          })
        })
        .then(res => res.json())
        .then(response => {
          if(response) {
            fetch('https://cryptic-bayou-38629.herokuapp.com/image',{
              method:"put",
              headers:{"Content-Type": "application/json"},
              body:JSON.stringify({
                id:this.state.user.id
              })
            })
            .then(res => res.json())
            .then(count => this.setState(Object.assign(this.state.user,{entries:count})))
            .catch(err => console.log(err));
           }
            this.displayFaceBox(this.calculateFaceLocation(response));
        })
        .catch(err => {
          console.log(err);
        })
    }

    onRouteChange = (routeName) => {
      if(routeName === 'signout') {
        this.setState({isSignedIn:false});
        this.setState({route: 'signin'});
        this.setState({imageUrl:''});
        return;
      } else if (routeName ==='home') {
        this.setState({isSignedIn:true})
      }
      this.setState({route: routeName});
    }
  render() {
    const { isSignedIn, imageUrl, box, route} = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
            route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;
