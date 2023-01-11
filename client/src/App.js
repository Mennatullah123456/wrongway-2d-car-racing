import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Game from './Game';
import GameOver from './GameOver';
import PlayerCar from './PlayerCar';
import OtherCar from './OtherCar';

// create a socket connection to the server
const socket = io('http://localhost:3000');

function App() {
  // state to store the game status (running or over)
  const [gameStatus, setGameStatus] = useState('running');

  // state to store the player's car position and velocity
  const [playerCar, setPlayerCar] = useState({ x: 0, y: 0, vx: 0, vy: 0 });

  // state to store the other players' car positions and velocities
  const [otherCars, setOtherCars] = useState([]);

  // use the useEffect hook to set up the game
  useEffect(() => {
    // listen for updates from the server
    socket.on('update', (newState) => {
      // update the state with the new positions and velocities of the cars
      setPlayerCar(newState.playerCar);
      setOtherCars(newState.otherCars);
    });

    // listen for the game over event from the server
    socket.on('game-over', () => {
      // end the game
      setGameStatus('over');
    });
  }, []);

  // render the game screen if the game is running, or the game over screen if the game is over
  return (
    <div>
      {gameStatus === 'running' ? (
        <Game>
          <PlayerCar position={playerCar} setPosition={setPlayerCar} />
          {otherCars.map((otherCar) => (
            <OtherCar position={otherCar} />
          ))}
        </Game>
      ) : (
        <GameOver />
      )}
    </div>
  );
}

export default App;
