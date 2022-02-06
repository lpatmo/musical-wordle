
import './App.css';
import { useState, useEffect } from 'react';
import Board from './Board';
import { data } from './data/data.js'
import Soundfont from 'soundfont-player';


function App() {
  console.log('data', data)
  const [answer, setAnswer] = useState();

  useEffect(() => {
    let randomIndex = Math.floor(Math.random() * data.length)
    setAnswer(data[randomIndex]);
  }, [])

  function playSequence() {
    const ac = new AudioContext();
    console.log('ac', ac)
    let randomIndex = Math.floor(Math.random() * data.length);

    const currentMelody = data[randomIndex];
    function transformSequence(melody) {
      return melody.sequence.map((note, i) => {
        return { time: melody.duration.slice(0, i).reduce((a, b) => a + b, 0) / 4, note, duration: melody.duration[i] / 4 }
      })
    }
    Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
      piano.schedule(ac.currentTime, transformSequence(currentMelody))

    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Musical Wordle</h1>
        <p>Ear training practice! Can you guess the first six notes?</p>
        <div className="audioSettings">
          <button type="button" onClick={playSequence}>Play</button>
          <button type="button">Restart</button>
        </div>
        <Board answer={answer} />
        <p>Show hint</p>
      </header>
    </div>
  );
}

export default App;
