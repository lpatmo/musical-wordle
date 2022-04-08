import React from "react";
import styles from "./Piano.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";

function Piano({ handlePianoPress }) {
    return (<div className={styles.piano}>
        <ul>
            <li onClick={() => handlePianoPress("C")}>C</li>
            <li onClick={() => handlePianoPress("D")}>D</li>
            <li onClick={() => handlePianoPress("E")}>E</li>
            <li onClick={() => handlePianoPress("F")}>F</li>
            <li onClick={() => handlePianoPress("G")}>G</li>
            <li onClick={() => handlePianoPress("A")}>A</li>
            <li onClick={() => handlePianoPress("B")}>B</li>
            <li aria-label="backspace" className={styles.backspace} onClick={() => handlePianoPress("Backspace")}> <FontAwesomeIcon icon={faBackspace} /></li>
        </ul>
    </div>)
}

export default Piano;