import React from 'react';
import Tilt from 'react-tilt';
import './logo.css';
import brain from './ai.svg'
const Logo = () => {
  return (
    <div className='ma4 mt8'>
      <Tilt className="Tilt br4 shadow-2" options={{ max : 50 }} style={{ height: 150, width: 150 }} >
        <div className="Tilt-inner pa4"><img id="logo" alt="logo" src={brain}/></div>
      </Tilt>
    </div>
  );
}

export default Logo;