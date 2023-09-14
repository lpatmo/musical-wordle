import { useState, useCallback, useEffect } from 'react';
import Navbar from '../Navbar';
import VolumeContext from '../contexts/VolumeContext'
import PianoNew from '../PianoNew'
import isNote from '../helpers/isNote'
import getNote from '../helpers/getNote'
import { playNote, playSequence } from "../helpers/playMusic";
import Instruments from '../Instruments'
import Grid from '@mui/material/Grid';
import styles from './Practice.module.css'


export default function Practice() {
    const [volume, setVolume] = useState(3);
    const [inProgress, setInProgress] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [instrument, setInstrument] = useState('acoustic_grand_piano')
    const [octave, setOctave] = useState(4);
    const [error, setError] = useState(null);
    const [guess, setGuess] = useState("");
    const [answer, setAnswer] = useState({ sequence: [`Ab${octave}`], duration: [2], hasFlats: false })
    const [firstTimePlayed, setFirstTimePlayed] = useState(true);
    const possibleNotes = ["A", "B", "C", "D", "E", "F", "G", "Db", "C#", "Eb", "D#", "Gb", "F#", "Ab", "G#", "Bb", "A#"]
    const possibleOctaves = [3, 4, 5];

    function getRandomElement(possibleValues) {
        const randomIndex = Math.floor(Math.random() * possibleValues.length)
        return possibleValues[randomIndex];
    }

    function getNewNote() {
        const selectedNote = getRandomElement(possibleNotes);
        const hasFlats = selectedNote[1] === "b";
        setAnswer({ sequence: [`${selectedNote}${getRandomElement(possibleOctaves)}`], duration: [1], hasFlats: hasFlats })
    }
    function startGame() {
        getNewNote();
        setInProgress(true);
        setIsPaused(false);
    }

    function playGame() {
        if (firstTimePlayed) {
            setFirstTimePlayed(false);
        }
        setIsPaused(false);
        playSequence(instrument, answer, undefined, undefined, volume);
    }

    function handlePianoPress(note) {
        handleKeyDown({ key: note });
    }
    function compareNoteWithAnswer(note, answerNote) {
        //note: F. Ab C# G.
        //answerNote: Gb3 F4 C#3
        return answerNote.slice(0,-1) === (note[1] === '.' ? note[0] : note)
    } 

    function getPercentage() {
        return `${guess.split("").filter((el) => el === "\uDFE9").length} / ${guess.length/2}`;
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
                    setOctave(octave > 3 ? octave - 1 : octave);
                    break;
                case event.keyCode === 39:
                    // The right arrow key was pressed.
                    setOctave(octave < 5 ? octave + 1 : octave);
                    break;
                case isNote(event.key):
                    /*Update guess state after valid note*/
                    let note = getNote(event, answer?.hasFlats);
                    if (note[1] === "b") {
                        note = note[0].toUpperCase() + note[1];
                    } else {
                        note = note.toUpperCase();
                    }


                    /*Play the note in the same octave as the corresponding answer*/
                    playNote(instrument, note, answer, 0, volume, octave);
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

                    if (inProgress && !isPaused) {
                        console.log('comparing...')
                        if (compareNoteWithAnswer(note, answer?.sequence[0] )) {
                            setGuess(guess + '🟩')
                            getNewNote();
                            setFirstTimePlayed(true);
                            setIsPaused(true);
                        } else {
                            setGuess(guess + '🟥')
                        }
                    }

                    break;
                case RegExp("^[a-zA-Z0-9]$").test(event.key):
                    setError(`${event.key.toUpperCase()} is not a valid note.`);
                    break;
                default:
                    break;
            }
        },
        [answer, gameOver, volume, instrument, guess, isPaused]
    );

    useEffect(() => {
        //listen to keyboard events
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            <VolumeContext.Provider value={volume}>
                <Navbar showCountdown={false} isPracticing={true} />
                <Grid container sx={{ mt: 5 }} spacing={1} justifyContent="center">
                <div className={styles.guessContainer}>{guess}</div>
                {getPercentage()}
                </Grid>
                <PianoNew handlePianoPress={handlePianoPress} octave={octave} hasFlats={answer?.hasFlats} className={styles.keyboard} setOctave={setOctave} />
                <Grid container spacing={1} justifyContent="center">
                    <Grid item xl={4} lg={5} md={7} className={styles.right}>
                        <Instruments instrument={instrument} setInstrument={setInstrument} />
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 5 }} spacing={1} justifyContent="center">
                    {inProgress || isPaused ?
                        <>
                            <button type="button" className={styles.action} onClick={playGame}>{firstTimePlayed ? "Hear next note" : "Hear again"}</button>
                            <button type="button" className={styles.action} onClick={(e) => { e.preventDefault(); setIsPaused(!isPaused); if (isPaused) { playGame() } }}>{isPaused ? "Continue" : "Pause"}</button>
                            <button type="button" className={styles.action} onClick={(e) => { e.preventDefault(); setInProgress(false); setGuess("") }}>Reset game</button>
                        </>

                        : <button type="button" className={styles.action} onClick={startGame}>Start Game</button>}
                </Grid>
            </VolumeContext.Provider>
        </>

    )
}