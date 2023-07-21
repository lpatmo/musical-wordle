import React from "react";
import styles from "./PianoTiny.module.css";

function PianoTiny({ octave, hasFlats }) {
    return (<div className={styles.pianoNew}>
        <ul className={styles.keyboard}>
            <li className={styles.white}></li>
            <li className={styles.black}></li>
            <li className={`${styles.white} ${styles.offset}`}></li>
            <li className={styles.black}></li>
            <li className={`${styles.white} ${styles.offset}`}></li>
            <li className={styles.white}></li>
            <li className={styles.black}></li>
            <li className={`${styles.white} ${styles.offset}`}></li>
            <li className={styles.black}></li>
            <li className={`${styles.white} ${styles.offset}`}></li>
            <li className={styles.black}></li>
            <li className={`${styles.white} ${styles.offset}`}></li>
        </ul>
    </div>)
}

export default PianoTiny;