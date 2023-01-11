import React from 'react';
import { Canvas } from 'react-three-fiber';

function Game({ children }) {
  // render the game screen, with the player's car and the other cars as children
  return (
    <Canvas>
      {children}
    </Canvas>
  );
}

export default Game;
