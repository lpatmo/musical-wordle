import React, { useEffect, useState, useCallback } from "react";
import styles from "./Board.module.css";
import { playNote, playSequence } from "./helpers/playMusic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCircleRight } from "@fortawesome/free-solid-svg-icons";
import Piano from './Piano'

function Board({ answer }) {
    const [guess, setGuess] = useState(new Array(6).fill(""));
    const [currentRow, setCurrentRow] = useState(0);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const answerStr = answer.sequence
            .map(noteCluster => noteCluster.split('')[0])
            .join('');

        const guessStr = guess[currentRow];
<<<<<<< HEAD
        const answerFreqCount = getFreqCount(answerStr);

=======
>>>>>>> Added CSS variables using wordle colors; DOM manipulation adds class instead of altering style of elements
        if (guessStr === answerStr) {
            playSequence(answer, guess, currentRow);
            document
                .querySelectorAll(`input[name^="note-${currentRow}"]`)
                .forEach((el) => (el.classList.add(styles.correct)));
            setMessage("Congratulations!");
            setError("")
        } else if (guessStr.length < 6) {
            setError("Please fill out all the notes.");
            return;
        } else {
            /*If user has submitted 6 notes, play the notes when they submit*/
            playSequence(answer, guess, currentRow);
            /*Increment the row*/
            setCurrentRow(currentRow + 1);
            setError("Please try again");
        }
        for (let i = 0; i < guessStr.length; i++) {
            if (guessStr[i] === answerStr[i]) {
                document.querySelector(
                    `input[name="note-${currentRow}-${i}"]`
                ).classList.add(styles.correct);
<<<<<<< HEAD
                answerFreqCount[answerStr[i]] -= 1;
            } else if (answerStr.includes(guessStr[i]) && answerFreqCount[guessStr[i]] > 0) {
                document.querySelector(
                    `input[name="note-${currentRow}-${i}"]`
                ).classList.add(styles.misplaced);
                answerFreqCount[guessStr[i]] -= 1;
=======
            
            } else if (answerStr.includes(guessStr[i])) {
                document.querySelector(
                    `input[name="note-${currentRow}-${i}"]`
                ).classList.add(styles.misplaced);
>>>>>>> Added CSS variables using wordle colors; DOM manipulation adds class instead of altering style of elements
            } else {
                document.querySelector(
                    `input[name="note-${currentRow}-${i}"]`
                ).classList.add(styles.incorrect);
            }
        }
    }, [answer, currentRow, guess]);

    const handleKeyDown = useCallback((event) => {
        switch (true) {
            case event.key === "Backspace":
                /*Updated guess state after backspace*/
                const updatedGuess = guess.map((guessStr, i) => {
                    if (i === currentRow) {
                        return guessStr.slice(0, guessStr.length - 1);
                    } else {
                        return guessStr;
                    }
                });
                setGuess(updatedGuess);
                setError("");
                break;
            case isNote(event.key):
                /*Update guess state after valid note*/
                if (guess[currentRow].length < 6) {
                    setGuess(
                        guess.map((guessStr, i) => {
                            if (i === currentRow) {
                                return guessStr + event.key.toUpperCase();
                            } else {
                                return guessStr;
                            }
                        })
                    );
                }
                /*Play the note in the same octave as the corresponding answer*/
                playNote(event.key, answer, guess[currentRow].length)
                setError("");
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
    }, [answer, currentRow, guess, handleSubmit]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [guess, currentRow, handleSubmit, handleKeyDown]);

    function isNote(str) {
        return str.length === 1 && "abcdefg".includes(str.toLowerCase());
    }

<<<<<<< HEAD
    function getFreqCount(noteSeq) {
        let freq = {};
        for (let i = 0; i < noteSeq.length; i++) {
            let character = noteSeq.charAt(i);
            if (freq[character]) {
                freq[character]++;
            } else {
                freq[character] = 1;
            }
        }
        return freq;
    }
    function handlePianoPress(note) {
        handleKeyDown({ key: note });
    }

=======
>>>>>>> Added CSS variables using wordle colors; DOM manipulation adds class instead of altering style of elements
    return (
        <>
            <p>Guess: {JSON.stringify(guess)}</p>
            <p>Answer: {JSON.stringify(answer)}</p>
            <form className={styles.board} onSubmit={handleSubmit}>
                {guess.map((char, row) => {
                    return (
                        <div key={row}>
                            {[0, 1, 2, 3, 4, 5].map((column) => {
                                return (<input
                                    key={column}
                                    type="text"
                                    name={`note-${row}-${column}`}
                                    disabled={currentRow !== row}
                                    maxLength={1}
                                    value={guess[row][column] || ""}
                                    tabIndex={-1}
                                    readOnly
                                />)
                            })}
                            <button onClick={(e) => { e.preventDefault(); playSequence(answer, guess, row) }}>
                                <FontAwesomeIcon icon={faPlay} />
                            </button>
                        </div>
                    )
                })}
                <button type="submit">Submit <FontAwesomeIcon icon={faCircleRight} /></button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
            {message && message}
            <Piano handlePianoPress={handlePianoPress} />
        </>
    );
}

export default Board;
