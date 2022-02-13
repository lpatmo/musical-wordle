import React, { useEffect, useState } from 'react';
import styles from './Board.module.css'
import playSequence from './helpers/playSequence';

function Board({ answer }) {
    const [guess, setGuess] = useState(new Array(6).fill(""));
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
        console.log("e", e)
        console.log("e", e.which)
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
        }
        //TODO: focus on the previous input element if backspace pressed

        //Update the guess state
        const updatedGuess = guess.map((letter, i) => {
            if (fieldIndex === i + 1) {
                console.log('fieldIndex and i are', fieldIndex, i)
                return value.toUpperCase();
            } else {
                return letter;
            }
        })
        setGuess(updatedGuess);
    };

    function handleSubmit(e) {
        e.preventDefault();
        console.log('answer revamped', answer.sequence.join("").split("").filter((val) => !Number.isInteger(parseInt(val))).join(""))
        const answerStr = answer.sequence.join("").split("").filter((val) => !Number.isInteger(parseInt(val))).join("");
        const guessStr = guess.join("");
        if (guessStr === answerStr) {
            document.querySelectorAll('input[name^="note"]').forEach((el) => el.style.background = 'green');
            setMessage("Congratulations!")
        } else {
            console.log('guessStr', guessStr)
            console.log('answerStr', answerStr)
            for (let i = 0; i < guessStr.length; i++) {
                if (guessStr[i] === answerStr[i]) {
                    console.log("should be green", i)
                    document.querySelector(`input[name="note-1-${i + 1}"]`).style.background = 'green';
                } else if (answerStr.includes(guessStr[i])) {
                    document.querySelector(`input[name="note-1-${i + 1}"]`).style.background = 'yellow';
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
                <div>
                    <input type="text" name="note-1-1" maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-2" maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-3" maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-4" maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-5" maxLength={1} onChange={handleChange} />
                    <input type="text" name="note-1-6" maxLength={1} onChange={handleChange} />
                    <button onClick={() => playSequence(answer, guess)}><icon>play</icon></button>
                </div>

                <button type="submit">Submit</button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
            {message && message}
        </>
    )
}

export default Board;