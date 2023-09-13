import { useState, useCallback, useEffect } from 'react';
import Navbar from '../Navbar';
import VolumeContext from '../contexts/VolumeContext'
import PianoNew from '../PianoNew'
import isNote from '../helpers/isNote'
import getNote from '../helpers/getNote'
import { playNote } from "../helpers/playMusic";
import Instruments from '../Instruments'
import Grid from '@mui/material/Grid';
import styles from './Practice.module.css'


export default function Practice() {
    const [volume, setVolume] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [instrument, setInstrument] = useState('acoustic_grand_piano')
    const [octave, setOctave] = useState(4);
    const [error, setError] = useState(null);
    const [hasFlats, setHasFlats] = useState(false);
    const answer = { sequence: [`D${octave}`] }

    function handlePianoPress(note) {
        console.log('note', note)
        handleKeyDown({ key: note });
    }

    function handleSubmit() {
        console.log('submitting...')
    }

    const handleKeyDown = useCallback(
        (event) => {
            switch (true) {
                case gameOver:
                    /*Do not accept user input if game is over */
                    break;
                case event.keyCode === 37:
                    // The left arrow key was pressed.
                    console.log("left key pressed", event.keyCode)
                    setOctave(octave > 3 ? octave-1 : octave);
                    break;
                case event.keyCode === 39:
                    // The right arrow key was pressed.
                    setOctave(octave < 5 ? octave+1 : octave);
                    break;
                case isNote(event.key):
                    /*Update guess state after valid note*/
                    let note = getNote(event, answer?.hasFlats);
                    console.log("note", note)
                    if (note[1] === "b") {
                        note = note[0].toUpperCase() + note[1];
                    } else {
                        note = note.toUpperCase();
                    }

                    
                    /*Play the note in the same octave as the corresponding answer*/
                    playNote(instrument, note, answer, 0, volume);
                    //setError("");

                    //highlight piano keyboard notes
                    setTimeout(() => {
                        if (note[1] === '.') {
                            document.querySelector(`#${note[0]}`).classList.add('activeWhite')
                        } else {
                            if (answer?.hasFlats) {
                                document.querySelector(`#${note[0]}flat`).classList.add('activeBlack')
                            } else {
                                document.querySelector(`#${note[0]}sharp`).classList.add('activeBlack')
                            }
                        }
                    }, 0)

                    setTimeout(() => {
                        if (note[1] === '.') {
                            document.querySelector(`#${note[0]}`).classList.remove('activeWhite')
                        } else {
                            if (answer?.hasFlats) {
                                document.querySelector(`#${note[0]}flat`).classList.remove('activeBlack')
                            } else {
                                document.querySelector(`#${note[0]}sharp`).classList.remove('activeBlack')
                            }
                        }
                    }, 200)
                    break;
                case event.key === "Enter":
                    handleSubmit(event);
                    break;
                case RegExp("^[a-zA-Z0-9]$").test(event.key):
                    setError(`${event.key.toUpperCase()} is not a valid note.`);
                    break;
                default:
                    break;
            }
        },
        [answer, gameOver, handleSubmit, volume, instrument]
    );

    useEffect(() => {
        //listen to keyboard events
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSubmit, handleKeyDown]);

    return (
        <>
            <VolumeContext.Provider value={volume}>
                <Navbar showCountdown={false} isPracticing={true} />
                <PianoNew handlePianoPress={handlePianoPress} octave={octave} hasFlats={hasFlats} className={styles.keyboard} setOctave={setOctave} />
                <Grid container spacing={1} justifyContent="center">
                    <Grid item xl={4} lg={5} md={7} className={styles.right}>
                        <Instruments instrument={instrument} setInstrument={setInstrument} />
                        {/* <InputLabel variant="standard" htmlFor="difficulty">
                            Key
                        </InputLabel>
                        <NativeSelect
                            defaultValue="C major"
                            inputProps={{
                                name: 'key',
                                id: 'key',
                            }}
                            onChange={(e) => setKey(e.target.value)}
                            sx={{ fontSize: '1.6rem' }}
                        >
                            <option value="c_major">C major</option>
                            <option value="d_major">D major</option>
                        </NativeSelect> */}
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 5 }} spacing={1} justifyContent="center">
                    <button type="button" className={styles.action}>Start Game</button>
                </Grid>
            </VolumeContext.Provider>
        </>

    )
}