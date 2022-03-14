import React, { useEffect, useState } from 'react';
import styles from './Board.module.css'
import playSequence from './helpers/playSequence';

function Board({ answer }) {
    const [guess, setGuess] = useState(new Array(6).fill(""));
    const [currentRow, setCurrentRow] = useState(0);
    /*
        ["", "", "", "", "", ""]
    */
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        window.addEventListener("keydown", function (event) {
            if (event.key === "Backspace") {
                console.log('I pressed backspace')
            }
        })
    }, [])

    function handleChange(e) {
        const { value, name } = e.target;
        console.log("value", value)
        console.log("name", name)

        let fieldIndex = parseInt(name.split("-")[2], 10);
        let currentTile = document.querySelector(`input[name="note-1-${fieldIndex}"]`)
        //Validate against non-valid notes
        console.log('value', value)
        if (!"abcdefg".includes(value.toLowerCase())) {
            console.log('not a note')
            //show error message

            setError(`${value.toUpperCase()} is not a valid note.`)

            //reset tile
            currentTile.value = '';
            currentTile.style.border = "5px solid red";

            //TODO: shake tile
        } else if (value.length === 1) {
            //Focus on the next input element if maxLength reached
            /*TODO: look into using nextElementSibling*/
            setError("")
            currentTile.style.border = "none";
            const nextInput = document.querySelector(`input[name="note-1-${fieldIndex + 1}"]`);
            if (nextInput !== null) {
                nextInput.focus();
            }

            // Update the guess state by replacing items in an array
            const updatedGuess = guess.map((guessStr, i) => {
                if (i === currentRow) {
                    return guessStr + value.toUpperCase();
                } else {
                    return guessStr;
                }
            })
            setGuess(updatedGuess);
        }
        //TODO: focus on the previous input element if backspace pressed

    };

    function handleSubmit(e) {
        e.preventDefault();
        console.log('answer revamped', answer.sequence.join("").split("").filter((val) => !Number.isInteger(parseInt(val))).join(""))
        const answerStr = answer.sequence.join("").split("").filter((val) => !Number.isInteger(parseInt(val))).join("");
        const guessStr = guess[currentRow];
        if (guessStr === answerStr) {
            document.querySelectorAll('input[name^="note"]').forEach((el) => el.style.background = 'green');
            setMessage("Congratulations!")
        } else {
            console.log('guessStr', guessStr)
            console.log('answerStr', answerStr)
            if (guessStr.length < 6) {
                console.log('length is less than 6')
                setError("Please fill out all the notes.")
                return;
            } else {
                setCurrentRow(currentRow + 1)
            }
            for (let i = 0; i < guessStr.length; i++) {
                if (guessStr[i] === answerStr[i]) {
                    console.log("Square with right note should be green", i)
                    document.querySelector(`input[name="note-${currentRow+1}-${i + 1}"]`).style.background = 'green';
                } else if (answerStr.includes(guessStr[i])) {
                    document.querySelector(`input[name="note-${currentRow+1}-${i + 1}"]`).style.background = 'yellow';
                }
            }
            setError("Please try again")
        }
        /*TODO: check if a row has a completed submission and disable all the inputs*/
    };
    return (
        <>
            <p>Guess: {JSON.stringify(guess)}</p>
            <p>Answer: {JSON.stringify(answer)}</p>
            <form className={styles.board} onSubmit={handleSubmit}>
                {/*TOOO: Map through guesses state instead of hardcoding below. See: https://github.com/lpatmo/musical-wordle/issues/5 */}
                <div>
                    <input type="text" name="note-1-1" disabled={currentRow !== 0} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-2" disabled={currentRow !== 0} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-3" disabled={currentRow !== 0} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-4" disabled={currentRow !== 0} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-5" disabled={currentRow !== 0} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-6" disabled={currentRow !== 0} maxLength={1} onChange={handleChange} />
                    <button onClick={() => playSequence(answer, guess, 0)}><icon>play</icon></button>
                </div>
                <div>
                    <input type="text" name="note-2-1" disabled={currentRow !== 1} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-2-2" disabled={currentRow !== 1} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-2-3" disabled={currentRow !== 1} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-2-4" disabled={currentRow !== 1} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-2-5" disabled={currentRow !== 1} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-2-6" disabled={currentRow !== 1} maxLength={1} onChange={handleChange} />
                    <button onClick={() => playSequence(answer, guess, 1)}><icon>play</icon></button>
                </div>
                <div>
                    <input type="text" name="note-3-1" disabled={currentRow !== 2} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-3-2" disabled={currentRow !== 2} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-3-3" disabled={currentRow !== 2} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-3-4" disabled={currentRow !== 2} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-3-5" disabled={currentRow !== 2} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-3-6" disabled={currentRow !== 2} maxLength={1} onChange={handleChange} />
                    <button onClick={() => playSequence(answer, guess, 2)}><icon>play</icon></button>
                </div>
                <div>
                    <input type="text" name="note-4-1" disabled={currentRow !== 3} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-4-2" disabled={currentRow !== 3} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-4-3" disabled={currentRow !== 3} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-4-4" disabled={currentRow !== 3} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-4-5" disabled={currentRow !== 3} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-4-6" disabled={currentRow !== 3} maxLength={1} onChange={handleChange} />
                    <button onClick={() => playSequence(answer, guess, 3)}><icon>play</icon></button>
                </div>
                <div>
                    <input type="text" name="note-5-1" disabled={currentRow !== 4} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-5-2" disabled={currentRow !== 4} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-5-3" disabled={currentRow !== 4} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-5-4" disabled={currentRow !== 4} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-5-5" disabled={currentRow !== 4} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-5-6" disabled={currentRow !== 4} maxLength={1} onChange={handleChange} />
                    <button onClick={() => playSequence(answer, guess, 4)}><icon>play</icon></button>
                </div>
                <div>
                    <input type="text" name="note-6-1" disabled={currentRow !== 5} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-6-2" disabled={currentRow !== 5} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-6-3" disabled={currentRow !== 5} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-6-4" disabled={currentRow !== 5} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-6-5" disabled={currentRow !== 5} maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-6-6" disabled={currentRow !== 5} maxLength={1} onChange={handleChange} />
                    <button onClick={() => playSequence(answer, guess, 5)}><icon>play</icon></button>
                </div>

                <button type="submit">Submit</button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
            {message && message}
        </>
    )
}

export default Board;