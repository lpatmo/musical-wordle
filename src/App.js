
import './App.css';
import { useState, useEffect } from 'react';
import Board from './Board';
import { data } from './data/data.js';
import { playSequence } from './helpers/playMusic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [answer, setAnswer] = useState();

  useEffect(() => {
    let randomIndex = Math.floor(Math.random() * data.length)
    setAnswer(data[randomIndex]);
    /* Uncomment when adding new songs
    setAnswer(data[data.length - 1])
    */
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <h1>Musical Wordle</h1>
        <p>Ear training practice! Can you guess the first six notes of this tune?</p>
        <div className="audioSettings">
          <button type="button" onClick={() => playSequence(answer)}><FontAwesomeIcon icon={faPlay} /> Play the notes</button>
        </div>
        <Board answer={answer} />
      </header>
    </div>
  );
}

export default App;
