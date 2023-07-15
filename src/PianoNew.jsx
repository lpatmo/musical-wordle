import React from "react";
import styles from "./PianoNew.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";

function PianoNew({ handlePianoPress, octave }) {
    return (<div className={styles.pianoNew}>
        <ul className={styles.keyboard}>
            <li onClick={() => handlePianoPress("C")} note="C" className={styles.white}>C{octave}</li>
            <li onClick={() => handlePianoPress("C#")} note="C#" className={styles.black}>C#</li>
            <li onClick={() => handlePianoPress("D")} note="D" className={`${styles.white} ${styles.offset}`}>D{octave}</li>
            <li onClick={() => handlePianoPress("D#")} note="D#" className={styles.black}>D#</li>
            <li onClick={() => handlePianoPress("E")} note="E" className={`${styles.white} ${styles.offset}`}>E{octave}</li>
            <li onClick={() => handlePianoPress("F")} note="F" className={styles.white}>F{octave}</li>
            <li onClick={() => handlePianoPress("F#")} note="F#" className={styles.black}>F#</li>
            <li onClick={() => handlePianoPress("G")} note="G" className={`${styles.white} ${styles.offset}`}>G{octave}</li>
            <li onClick={() => handlePianoPress("G#")} note="G#" className={styles.black}>G#</li>
            <li onClick={() => handlePianoPress("A")} note="A" className={`${styles.white} ${styles.offset}`}>A{octave}</li>
            <li note="A#" className={styles.black}>A#</li>
            <li onClick={() => handlePianoPress("B")} note="B" className={`${styles.white} ${styles.offset}`}>B{octave}</li>
            <li aria-label="backspace" className={`${styles.white} ${styles.backspace}`} onClick={() => handlePianoPress("Backspace")}> <span>Backspace</span> <FontAwesomeIcon icon={faBackspace} /></li>
        </ul>
    </div>)
}

export default PianoNew;