
import './App.css';
import { useState, useEffect } from 'react';
import Board from './Board';
import { data } from './data/data.js';
import { playSequence } from './helpers/playMusic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import VolumeContext from './AppContext'

/* To access mock data for validation testing
 *  1) Uncomment the following for mock data for validation testing
 *  2) Comment out above import from data.js
*/
//import {data} from './data/mock-data.js';




function App() {
  const [answer, setAnswer] = useState();
  const [volume, setVolume] = useState(1.5);
  const [mobileOrSafari, setMobileOrSafari] = useState(false);

  console.log('VOLUME', volume)
  function handleVolume(e, newVolume) {
    console.log('newVolume', newVolume)
    setVolume(newVolume)
  }
  useEffect(() => {
    let randomIndex = Math.floor(Math.random() * data.length)
    setAnswer(data[randomIndex]);
    /* Uncomment when adding new songs
    setAnswer(data[data.length - 1])
    */

    /*Detect if user is on a mobile device or Safari*/
    if (navigator.userAgent.indexOf("Mobi") > -1 || (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1)) {
      setMobileOrSafari(true)
    }
  }, [])


  return (
    <VolumeContext.Provider value={volume}>
    <div className="App">
      <header className="App-header">
        <h1>Musical Wordle</h1>
        <p>Ear training practice! Can you guess the first six notes of this tune?</p>
        {mobileOrSafari ? <p className="error">Sorry, this game is not available on Safari or on mobile devices.</p> : <>

          <button type="button" onClick={() => playSequence(answer, undefined, undefined, volume)}><FontAwesomeIcon icon={faPlay} /> Play the notes</button>
          <Box sx={{ width: 300 }} className="audioSettingsWrapper">

            <Stack spacing={3} direction="row" sx={{ mb: 3 }} alignItems="center" className="audioSettings">
              <VolumeDown /> <Slider aria-label="Volume" value={volume} onChange={handleVolume} min={0} max={4} /> <VolumeUp />
            </Stack>


          </Box>
          <Board answer={answer} />
        </>}

      </header>

    </div>
    </VolumeContext.Provider>
  );
}

export default App;
