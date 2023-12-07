import { useState, useCallback, useEffect } from 'react';
import Navbar from '../Navbar';
import VolumeContext from '../contexts/VolumeContext'
import PianoPractice from '../PianoPractice'
import isNote from '../helpers/isNote'
import getNote from '../helpers/getNote'
import getNoteWithOctave from '../helpers/getNoteWithOctave';
import { playNote, playSequence } from "../helpers/playMusic";
import Grid from '@mui/material/Grid';
import { instrumentMapping } from '../helpers/getInstrument';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import styles from './Practice.module.css'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LoopIcon from '@mui/icons-material/Loop';
import PianoIcon from '@mui/icons-material/Piano';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TextField from '@mui/material/TextField';



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
    const [recording, setRecording] = useState({ "id": 125, "sequence": [], "duration": [], song: "", key: { note: "D", major: false }, hasFlats: false },
    )
    const [fields, setFields] = useState({ hasFlats: false, isMajor: false })
    const [showDrum, setShowDrum] = useState(false);
    const [clickTimes, setClickTimes] = useState([]);
    const [showRecordingSection, setShowRecordingSection] = useState(false);
    const [hasFlats, setHasFlats] = useState(answer?.hasFlats)
    const possibleNotes = ["A", "B", "C", "D", "E", "F", "G", "Db", "C#", "Eb", "D#", "Gb", "F#", "Ab", "G#", "Bb", "A#"]
    const possibleOctaves = [3, 4, 5];

    function handleFields(e) {
        if (e.target.name === "hasFlats") {
            console.log('e.target.name, e.target.value', e.target.name, e.target.value)
            setFields({ ...fields, hasFlats: !fields.hasFlats })
            setRecording((prevRecording) => ({
                ...prevRecording, [e.target.name]: !fields.hasFlats
            }))
            setHasFlats(!hasFlats);
        } else if (e.target.name === "isMajor") {
            setFields({ ...fields, isMajor: !fields.isMajor })
            setRecording(prevState => ({
                ...prevState,
                key: {
                    ...prevState.key,
                    major: !fields.isMajor
                }
            }));
        } else if (e.target.name === "id") {
            setRecording((prevRecording) => ({
                ...prevRecording, [e.target.name]: parseInt(e.target.value)
            }))
        } else {
            setRecording((prevRecording) => ({
                ...prevRecording, [e.target.name]: e.target.value
            }))
        }
    }

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
        playSequence(instrument, answer, undefined, undefined, undefined, volume);
    }

    function handlePianoPress(note) {
        handleKeyDown({ key: note });
    }
    function compareNoteWithAnswer(note, answerNote) {
        //note: F. Ab C# G.
        //answerNote: Gb3 F4 C#3
        return answerNote.slice(0, -1) === (note[1] === '.' ? note[0] : note)
    }

    function getPercentage() {
        return ` ${guess.split("").filter((el) => el === "\uDFE9").length} / ${guess.length / 2}`;
    }

    function recordRhythm() {
        setShowDrum(true);
    }

    function recordBeat() {
        const currentTime = new Date().getTime();
        setClickTimes((prevClickTimes) => [...prevClickTimes, currentTime])
    }

    function copy() {
        navigator.clipboard.writeText(JSON.stringify(recording))
    }

    function calculateBeats() {

        //calculate differences
        const timeDifferences = [];
        for (let i = 1; i < clickTimes.length; i++) {
            const differenceInSeconds = (clickTimes[i] - clickTimes[i - 1]) / 1000;
            timeDifferences.push(Math.round(differenceInSeconds * 3 * 100) / 100);
        }
        //add last beat
        timeDifferences.push(1)
        setRecording(prevRecording => ({
            ...prevRecording,
            duration: timeDifferences
        }));
    }

    function playRecording() {
        playSequence(instrument, recording, undefined, undefined, undefined, volume);
    }

    function resetRhythm() {
        setRecording(prevRecording => ({
            ...prevRecording,
            duration: []
        }))
        setClickTimes([])
    }

    const handleKeyDown = useCallback(
        (event) => {
            switch (true) {
                case document.activeElement.tagName === 'INPUT':
                    break;
                case gameOver:
                    /*Do not accept user input if game is over */
                    break;
                case event.key === "Backspace":
                    /*Updated guess state after backspace*/
                    console.log('recording is', recording)
                    console.log(recording.sequence)
                    if (recording.sequence.length > 0) {
                        setRecording(prevRecording => ({
                            ...prevRecording,
                            sequence: prevRecording.sequence.slice(0, -1)
                        }));
                    }
                    break;
                case event.keyCode === 37:
                    // The left arrow key was pressed.
                    setOctave(octave > 3 ? octave - 1 : octave);
                    break;
                case event.keyCode === 39:
                    // The right arrow key was pressed.
                    setOctave(octave < 5 ? octave + 1 : octave);
                    break;
                case isNote(event.key):
                    /*Update guess state after valid note*/
                    let note = getNote(event, hasFlats)
                    let noteWithOctave = getNoteWithOctave(event, hasFlats, octave);
                    if (note[1] === "b") {
                        note = note[0].toUpperCase() + note[1];
                    } else {
                        note = note.toUpperCase();
                    }
                    setRecording(prevRecording => ({
                        ...prevRecording,
                        sequence: [...prevRecording.sequence, noteWithOctave]
                    }));

                    console.log('octave', octave)
                    /*Play the note in the same octave as the corresponding answer*/
                    playNote(instrument, note, answer, 0, 6, volume, octave);
                    //setError("");

                    //highlight piano keyboard notes
                    setTimeout(() => {
                        if (note[1] === '.') {
                            document.querySelector(`#${note[0]}`).classList.add('activeWhite')
                        } else {
                            if (hasFlats) {
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
                            if (hasFlats) {
                                document.querySelector(`#${note[0]}flat`).classList.remove('activeBlack')
                            } else {
                                document.querySelector(`#${note[0]}sharp`).classList.remove('activeBlack')
                            }
                        }
                    }, 200)

                    if (inProgress && !isPaused) {
                        console.log('comparing...')
                        if (compareNoteWithAnswer(note, answer?.sequence[0])) {
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
        [answer, gameOver, volume, instrument, guess, isPaused, octave, recording]
    );

    useEffect(() => {
        //searchParams
        const urlSearchParams = new URLSearchParams(window.location.search);
        const searchParamsObject = {};
        // Iterate over each search parameter and store the values in the object
        for (const [key, value] of urlSearchParams) {
            searchParamsObject[key] = value;
        }
        if (searchParamsObject.record === 'true') {
            setShowRecordingSection(true);
        }
        //listen to keyboard events
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            <VolumeContext.Provider value={volume}>
                <Navbar showCountdown={false} isPracticing={true} />
                <Grid container sx={{ mb: 5, mt: 5 }} justifyContent="center">
                    <div className={styles.guessContainer}>{guess}</div>

                </Grid>
                <Grid container sx={{ mb: 5, mt: 5 }} justifyContent="center">
                    {getPercentage()}
                </Grid>
                <Grid container sx={{ mb: 5, mt: 5 }} spacing={1} justifyContent="center">
                    <Grid item xl={4} lg={5} md={7} className={styles.right}>
                        <PianoPractice handlePianoPress={handlePianoPress} octave={octave} hasFlats={hasFlats} className={styles.keyboard} setOctave={setOctave} />
                    </Grid>
                </Grid>
                <Grid container sx={{ mb: 5, mt: 5 }} spacing={1} justifyContent="center">
                    <NativeSelect
                        defaultValue="acoustic_grand_piano"
                        inputProps={{
                            name: 'instrument',
                            id: 'instrument',
                        }}
                        onChange={(e) => setInstrument(e.target.value)}
                        sx={{ fontSize: '1.6rem', mr: '2em' }}
                    >
                        {Object.keys(instrumentMapping).map((instrument) => {
                            return <option value={instrument} key={instrument}>{instrumentMapping[instrument]}</option>
                        })}
                    </NativeSelect>
                </Grid>

                {showRecordingSection && (
                    <>
                        <Grid container sx={{ mb: 5, mt: 5 }} spacing={1} justifyContent="center">
                            <TextField id="outlined-basic" label="id" variant="outlined" name="id" onChange={(e) => handleFields(e)} size="large" />
                            <TextField id="outlined-basic" label="song" variant="outlined" name="song" onChange={(e) => handleFields(e)} />
                            <TextField id="outlined-basic" label="key" variant="outlined" name="key" onChange={(e) => handleFields(e)} />
                            <input type="checkbox" onChange={(e) => handleFields(e)} name="isMajor" defaultValue={fields.isMajor} />
                            <input type="checkbox" onChange={(e) => handleFields(e)} name="hasFlats" defaultValue={fields.hasFlats} />

                        </Grid>
                        <Grid container sx={{ mb: 5, mt: 5 }} spacing={1} justifyContent="center">
                            <Grid item xl={8} className={styles.recordingBlock}>
                                <button type="button" className={styles.action} onClick={recordRhythm}><FiberManualRecordIcon /></button>
                                <button type="button" className={styles.action} onClick={calculateBeats}><StopIcon /></button>
                                <button type="button" className={styles.action} onClick={playRecording}><PlayArrowIcon /></button>
                                <button type="button" className={styles.action} onClick={resetRhythm}><LoopIcon /></button>
                            </Grid>
                            <Grid item xl={8} className={styles.recordingBlock}>
                                {showDrum && <PianoIcon onClick={recordBeat} className={styles.drum} />}
                            </Grid>
                            <Grid item xl={8}>

                                <div className={styles.recordingBlock}>
                                    <small>{JSON.stringify(clickTimes)}</small>
                                    <br />
                                    {JSON.stringify(recording)}
                                    <p><ContentCopyIcon className={styles.copy} onClick={copy} /></p>
                                </div>
                            </Grid>
                        </Grid>
                    </>
                )}
                < Grid container sx={{ mt: 5, mb: 5 }} spacing={1} justifyContent="center">
                    {inProgress || isPaused ?
                        <>
                            <button type="button" className={styles.action} onClick={playGame}>{firstTimePlayed ? "Hear next note" : "Hear again"}</button>
                            <button type="button" className={styles.action} onClick={(e) => { e.preventDefault(); setIsPaused(!isPaused); if (isPaused) { playGame() } }}>{isPaused ? "Continue" : "Pause"}</button>
                            <button type="button" className={styles.action} onClick={(e) => { e.preventDefault(); setInProgress(false); setGuess(""); setIsPaused(false); }}>Reset game</button>
                        </>

                        : <button type="button" className={styles.action} onClick={startGame}>Start Game</button>}
                </Grid>
            </VolumeContext.Provider>
        </>

    )
}