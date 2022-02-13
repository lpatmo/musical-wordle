
import './App.css';
import { useState, useEffect } from 'react';
import Board from './Board';
import { data } from './data/data.js'
import playSequence from './helpers/playSequence'


function App() {
  console.log('data', data)
  const [answer, setAnswer] = useState();

  useEffect(() => {
    let randomIndex = Math.floor(Math.random() * data.length)
    setAnswer(data[randomIndex]);

  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <h1>Musical Wordle</h1>
        <p>Ear training practice! Can you guess the first six notes?</p>
        <div className="audioSettings">
          <button type="button" onClick={() => playSequence(answer)}>Play</button>
        </div>
        <Board answer={answer} />
        <p>Show hint</p>
      </header>
    </div>
  );
}

export default App;
