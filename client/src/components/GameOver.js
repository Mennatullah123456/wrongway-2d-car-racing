import React from 'react';

function GameOver() {
  // render the game over screen
  return (
    <div>
      <h1>Game Over</h1>
      <button onClick={() => window.location.reload()}>Play Again</button>
    </div>
  );
}

export default GameOver;
