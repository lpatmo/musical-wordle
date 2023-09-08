
import './App.css';
import { useState, useEffect } from 'react';
import Board from './Board';
import { data } from './data/data.js';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import Navbar from './Navbar';
import VolumeContext from './contexts/VolumeContext'
import MidnightContext from './contexts/MidnightContext'
import { differenceInDays } from 'date-fns';
import ModalStats from './ModalStats';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from '@fortawesome/free-brands-svg-icons'

/* To access mock data for validation testing
 *  1) Uncomment the following for mock data for validation testing
 *  2) Comment out above import from data.js
*/
//import {data} from './data/mock-data.js';

function App() {
  const [answer, setAnswer] = useState();
  const [volume, setVolume] = useState(3);
  const [isMidnight, setIsMidnight] = useState(false);
  const [mobileOrSafari, setMobileOrSafari] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [showStats, setShowStats] = useState(false);

  function setGameIndex() {
    let startDate = new Date('2023-08-05');
    startDate.setHours(0,0,0,0);
    // Find number of days between now and startDate
    const daysDifference = differenceInDays(new Date(), startDate) - 1 > 0 ? differenceInDays(new Date(), startDate) - 1 : 0;
    // if the daysDifference exceeds the total # of songs in the data array, return the mod of the length of the array
    return daysDifference % data.length;
  }

  function clearStorage() {
    window.localStorage.removeItem('perfectPitchPuzzleStats');
  }


  useEffect(() => {

    const urlSearchParams = new URLSearchParams(window.location.search);
    const searchParamsObject = {};
    // Iterate over each search parameter and store the values in the object
    for (const [key, value] of urlSearchParams) {
      searchParamsObject[key] = value;
    }
    if (searchParamsObject.testMode === 'true') {
      let randomIndex = Math.floor(Math.random() * data.length)
      setAnswer(data[randomIndex])
      setTestMode(true);
    } else {
      setAnswer(data[setGameIndex()]);
      //setAnswer(data[data.length-1])
      //setAnswer(data[57])
      setTestMode(false);
    }
    /* Uncomment when adding new songs
    setAnswer(data[data.length - 1])
    */

    /*Detect if user is on a mobile device or Safari*/
    // if (navigator.userAgent.indexOf("Mobi") > -1 || (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1)) {
    //   setMobileOrSafari(true)
    // }
  }, [])

  function handleVolume(e, newVolume) {
    setVolume(newVolume);
  }

  function handleMute() {
    setVolume(0);
  }


  return (
    <MidnightContext.Provider value={{ isMidnight, setIsMidnight }}>
      <VolumeContext.Provider value={volume}>
        <div className="App">
          <header className="App-header">
            <Navbar showCountdown={true}/>
            {/* {JSON.stringify(setGameIndex())} */}
            {testMode && <div className="testMode"><h2>You are in test mode!
              <button onClick={() => { alert("Stats cleared!"); clearStorage() }}>Clear stats</button>
              <button onClick={() => setShowStats(true)}>Show stats</button>
              <button onClick={() => { alert('New random song selected! Your board will reset.'); setIsMidnight(true); setAnswer(data[Math.floor(Math.random() * data.length)]) }}>Try random song</button>
            </h2>

            </div>}
            </header>
            <div className="App-body">
            {showStats && <ModalStats setIsOpen={setShowStats} />}
            {mobileOrSafari ? <p className="error">Sorry, this game is not available on Safari or on mobile devices.</p> : <>


              <Box sx={{ width: 300, margin: '20px auto' }}>

                <Stack spacing={3} direction="row" sx={{ mb: 3 }} alignItems="center" className="audioSettings">
                  <VolumeDown onClick={handleMute} className="muteVolume" /> <Slider aria-label="Volume" value={volume} onChange={handleVolume} min={0} max={6} /> <VolumeUp />
                </Stack>

              </Box>
              <Board answer={answer} testMode={testMode} />
            </>}
            </div>

        </div>
        <footer>
          <a href="https://discord.gg/gzgghM2JVD" target="_blank" referrer="no-referrer" className="discordIcon"><FontAwesomeIcon icon={faDiscord} aria-labelledby="Join us on Discord" /></a>
        </footer>
      </VolumeContext.Provider>
    </MidnightContext.Provider>
  );
}

export default App;
