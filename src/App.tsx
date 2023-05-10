import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <p>{`${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`}</p>
    </div>
  );
}

export default App;
