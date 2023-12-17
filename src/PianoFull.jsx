import { useState } from "react";
import styles from "./PianoFull.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
function PianoFull({ handlePianoPress, octave, hasFlats, setOctave }) {
    const [showShortcuts, setShowShortcuts] = useState(false);
    return (
        <>
            <section>
                <div className={styles.pianoNew}>
                    <ul className={styles.keyboard}>
                    <li id="C3" onClick={() => handlePianoPress("C", 3)} className={styles.white}>C{octave-1}</li>
                        <li id={hasFlats ? "Dflat3" : "Csharp3"} onClick={() => handlePianoPress(hasFlats ? "Db" : "C#", 3)} className={styles.black}>{hasFlats ? "Db" : "C#"}</li>
                        <li id="D3" onClick={() => handlePianoPress("D", 3)} className={`${styles.white} ${styles.offset}`}>D{octave-1}</li>
                        <li id={hasFlats ? "Eflat3" : "Dsharp3"} onClick={() => handlePianoPress(hasFlats ? "Eb" : "D#", 3)} className={styles.black}>{hasFlats ? "Eb" : "D#"}</li>
                        <li id="E3" onClick={() => handlePianoPress("E", 3)} className={`${styles.white} ${styles.offset}`}>E{octave-1}</li>
                        <li id="F3" onClick={() => handlePianoPress("F", 3)} className={styles.white}>F3</li>
                        <li id={hasFlats ? "Gflat3" : "Fsharp3"} onClick={() => handlePianoPress(hasFlats ? "Gb" : "F#", 3)} className={styles.black}>{hasFlats ? "Gb" : "F#"}</li>
                        <li id="G3" onClick={() => handlePianoPress("G", 3)} className={`${styles.white} ${styles.offset}`}>G{octave-1}</li>
                        <li id={hasFlats ? "Aflat2" : "Gsharp3"} onClick={() => handlePianoPress(hasFlats ? "Ab" : "G#", 3)} className={styles.black}>{hasFlats ? "Ab" : "G#"}</li>
                        <li id="A3" onClick={() => handlePianoPress("A", 3)} className={`${styles.white} ${styles.offset}`}>A{octave-1}</li>
                        <li id={hasFlats ? "Bflat3" : "Asharp3"} onClick={() => handlePianoPress(hasFlats ? "Bb" : "A#", 3)} className={styles.black}>{hasFlats ? "Bb" : "A#"}</li>
                        <li id="B3" onClick={() => handlePianoPress("B", 3)} className={`${styles.white} ${styles.offset}`}>B{octave-1}</li>
                        <li id="C4" onClick={() => handlePianoPress("C", 4)} className={styles.white}>C{octave}</li>
                        <li id={hasFlats ? "Dflat4" : "Csharp4"} onClick={() => handlePianoPress(hasFlats ? "Db" : "C#", 4)} className={styles.black}>{hasFlats ? "Db" : "C#"}</li>
                        <li id="D4" onClick={() => handlePianoPress("D", 4)} className={`${styles.white} ${styles.offset}`}>D{octave}</li>
                        <li id={hasFlats ? "Eflat4" : "Dsharp4"} onClick={() => handlePianoPress(hasFlats ? "Eb" : "D#", 4)} className={styles.black}>{hasFlats ? "Eb" : "D#"}</li>
                        <li id="E4" onClick={() => handlePianoPress("E", 4)} className={`${styles.white} ${styles.offset}`}>E{octave}</li>
                        <li id="F4" onClick={() => handlePianoPress("F", 4)} className={styles.white}>F{octave}</li>
                        <li id={hasFlats ? "Gflat4" : "Fsharp4"} onClick={() => handlePianoPress(hasFlats ? "Gb" : "F#", 4)} className={styles.black}>{hasFlats ? "Gb" : "F#"}</li>
                        <li id="G4" onClick={() => handlePianoPress("G", 4)} className={`${styles.white} ${styles.offset}`}>G{octave}</li>
                        <li id={hasFlats ? "Aflat4" : "Gsharp4"} onClick={() => handlePianoPress(hasFlats ? "Ab" : "G#", 4)} className={styles.black}>{hasFlats ? "Ab" : "G#"}</li>
                        <li id="A4" onClick={() => handlePianoPress("A", 4)} className={`${styles.white} ${styles.offset}`}>A{octave}</li>
                        <li id={hasFlats ? "Bflat4" : "Asharp4"} onClick={() => handlePianoPress(hasFlats ? "Bb" : "A#", 4)} className={styles.black}>{hasFlats ? "Bb" : "A#"}</li>
                        <li id="B4" onClick={() => handlePianoPress("B", 4)} className={`${styles.white} ${styles.offset}`}>B{octave}</li>
                        <li id="C5" onClick={() => handlePianoPress("C", 5)} className={styles.white}>C{octave+1}</li>
                        <li id={hasFlats ? "Dflat5" : "Csharp5"} onClick={() => handlePianoPress(hasFlats ? "Db" : "C#", 5)} className={styles.black}>{hasFlats ? "Db" : "C#"}</li>
                        <li id="D5" onClick={() => handlePianoPress("D", 5)} className={`${styles.white} ${styles.offset}`}>D{octave+1}</li>
                        <li id={hasFlats ? "Eflat5" : "Dsharp5"} onClick={() => handlePianoPress(hasFlats ? "Eb" : "D#", 5)} className={styles.black}>{hasFlats ? "Eb" : "D#"}</li>
                        <li id="E5" onClick={() => handlePianoPress("E", 5)} className={`${styles.white} ${styles.offset}`}>E{octave+1}</li>
                        <li id="F5" onClick={() => handlePianoPress("F", 5)} className={styles.white}>F{octave+1}</li>
                        <li id={hasFlats ? "Gflat5" : "Fsharp5"} onClick={() => handlePianoPress(hasFlats ? "Gb" : "F#", 5)} className={styles.black}>{hasFlats ? "Gb" : "F#"}</li>
                        <li id="G5" onClick={() => handlePianoPress("G", 5)} className={`${styles.white} ${styles.offset}`}>G{octave+1}</li>
                        <li id={hasFlats ? "Aflat5" : "Gsharp5"} onClick={() => handlePianoPress(hasFlats ? "Ab" : "G#", 5)} className={styles.black}>{hasFlats ? "Ab" : "G#"}</li>
                        <li id="A5" onClick={() => handlePianoPress("A", 5)} className={`${styles.white} ${styles.offset}`}>A{octave+1}</li>
                        <li id={hasFlats ? "Bflat5" : "Asharp5"} onClick={() => handlePianoPress(hasFlats ? "Bb" : "A#", 5)} className={styles.black}>{hasFlats ? "Bb" : "A#"}</li>
                        <li id="B5" onClick={() => handlePianoPress("B", 5)} className={`${styles.white} ${styles.offset}`}>B{octave+1}</li>
                        <li aria-label="backspace" className={`${styles.white} ${styles.backspace}`} onClick={() => handlePianoPress("Backspace")}> <span>Backspace</span> <FontAwesomeIcon icon={faBackspace} /></li>
                    </ul>
                </div>
                <div className={styles.keyBindings}>
                    <p className={styles.shortcutsTitle} onClick={(e) => setShowShortcuts(!showShortcuts)}><strong>Keyboard Shortcuts <KeyboardArrowDownIcon className={styles.shortcutsIcon} />
                    </strong>
                    </p>
                    {showShortcuts && 
                        <section className={styles.modalInstructions}>
                            <p><strong>C D E F G A B</strong> </p>
                            <p>Press <strong>Shift-</strong> to guess a sharp or flat <br /> if you think it's in the tune. For example:</p>
                            <p><strong>Shift-C</strong> results in <strong>C#</strong></p>
                            <p><strong>Shift-B</strong> results in <strong>Bb</strong></p>
                        </section>
                    }
                </div>

            </section>
        </>)
}

export default PianoFull;