import { useState } from "react";
import styles from "./PianoNew.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";
import PianoTiny from './PianoTiny'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function PianoNew({ handlePianoPress, octave, hasFlats }) {
    const [showShortcuts, setShowShortcuts] = useState(false);
    return (
        <>
            <section className={styles.tinyPianos}>
                <div className={`${styles.highlight} ${octave === 2 && styles.octave2} ${octave === 3 && styles.octave3} ${octave === 4 && styles.octave4} ${octave === 5 && styles.octave5} ${octave === 6 && styles.octave6}`}><span className={styles.octaveText}>Octave: {octave}</span></div>
                <PianoTiny octave={octave} />
                <PianoTiny octave={octave} />
                <PianoTiny octave={octave} />
            </section>
            <span className={styles.chooseInstructions}>Choose from the notes in the octave above.</span>
            <section>
                <div className={styles.pianoNew}>
                    <ul className={styles.keyboard}>
                        <li id="C" onClick={() => handlePianoPress("C")} className={styles.white}>C{octave}</li>
                        <li id={hasFlats ? "Dflat" : "Csharp"} onClick={() => handlePianoPress(hasFlats ? "Db" : "C#")} className={styles.black}>{hasFlats ? "Db" : "C#"}</li>
                        <li id="D" onClick={() => handlePianoPress("D")} className={`${styles.white} ${styles.offset}`}>D{octave}</li>
                        <li id={hasFlats ? "Eflat" : "Dsharp"} onClick={() => handlePianoPress(hasFlats ? "Eb" : "D#")} className={styles.black}>{hasFlats ? "Eb" : "D#"}</li>
                        <li id="E" onClick={() => handlePianoPress("E")} className={`${styles.white} ${styles.offset}`}>E{octave}</li>
                        <li id="F" onClick={() => handlePianoPress("F")} className={styles.white}>F{octave}</li>
                        <li id={hasFlats ? "Gflat" : "Fsharp"} onClick={() => handlePianoPress(hasFlats ? "Gb" : "F#")} className={styles.black}>{hasFlats ? "Gb" : "F#"}</li>
                        <li id="G" onClick={() => handlePianoPress("G")} className={`${styles.white} ${styles.offset}`}>G{octave}</li>
                        <li id={hasFlats ? "Aflat" : "Gsharp"} onClick={() => handlePianoPress(hasFlats ? "Ab" : "G#")} className={styles.black}>{hasFlats ? "Ab" : "G#"}</li>
                        <li id="A" onClick={() => handlePianoPress("A")} className={`${styles.white} ${styles.offset}`}>A{octave}</li>
                        <li id={hasFlats ? "Bflat" : "Asharp"} onClick={() => handlePianoPress(hasFlats ? "Bb" : "A#")} className={styles.black}>{hasFlats ? "Bb" : "A#"}</li>
                        <li id="B" onClick={() => handlePianoPress("B")} className={`${styles.white} ${styles.offset}`}>B{octave}</li>
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

export default PianoNew;