import React, { useEffect, useState, useCallback } from "react";
import styles from "./Board.module.css";
import playSequence from "./helpers/playSequence";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

function Board({ answer }) {
  const [guess, setGuess] = useState(new Array(6).fill(""));
  const [currentRow, setCurrentRow] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const answerStr = answer.sequence
        .join("")
        .split("")
        .filter((val) => !Number.isInteger(parseInt(val)))
        .join("");
      const guessStr = guess[currentRow];
      if (guessStr === answerStr) {
        document
          .querySelectorAll(`input[name^="note-${currentRow + 1}"]`)
          .forEach((el) => (el.style.background = "green"));
        setMessage(
          "Congratulations! You correctly guessed " +
            answer["song"] +
            " in " +
            guess.join("").length / 6 +
            "/" +
            guess.length +
            " tries!"
        );
      } else if (guessStr.length < 6) {
        setError("Please fill out all the notes.");
        return;
      } else if (guess.join("").length / 6 === 6) {
        setMessage(
          "Better luck next time! The song was " + answer["song"] + "."
        );
      } else {
        /*If user has submitted 6 notes, play the notes when they submit*/
        playSequence(answer, guess, currentRow);
        /*Increment the row*/
        setCurrentRow(currentRow + 1);
      }
      for (let i = 0; i < guessStr.length; i++) {
        if (guessStr[i] === answerStr[i]) {
          document.querySelector(
            `input[name="note-${currentRow + 1}-${i + 1}"]`
          ).style.background = "green";
        } else if (answerStr.includes(guessStr[i])) {
          document.querySelector(
            `input[name="note-${currentRow + 1}-${i + 1}"]`
          ).style.background = "yellow";
        }
      }
      setError("Please try again");
    },
    [answer, currentRow, guess]
  );

  useEffect(() => {
    function handleKeyDown(event) {
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
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guess, currentRow, handleSubmit]);

  function isNote(str) {
    return str.length === 1 && "abcdefg".includes(str.toLowerCase());
  }

  return (
    <>
      <p>Guess: {JSON.stringify(guess)}</p>
      <p>Answer: {JSON.stringify(answer)}</p>
      <form className={styles.board} onSubmit={handleSubmit}>
        {/*TOOO: Map through guesses state instead of hardcoding below. See: https://github.com/lpatmo/musical-wordle/issues/5 */}
        <div>
          <input
            type="text"
            name="note-1-1"
            disabled={currentRow !== 0}
            maxLength={1}
            value={guess[0][0] || ""}
          />
          <input
            type="text"
            name="note-1-2"
            disabled={currentRow !== 0}
            maxLength={1}
            value={guess[0][1] || ""}
          />
          <input
            type="text"
            name="note-1-3"
            disabled={currentRow !== 0}
            maxLength={1}
            value={guess[0][2] || ""}
          />
          <input
            type="text"
            name="note-1-4"
            disabled={currentRow !== 0}
            maxLength={1}
            value={guess[0][3] || ""}
          />
          <input
            type="text"
            name="note-1-5"
            disabled={currentRow !== 0}
            maxLength={1}
            value={guess[0][4] || ""}
          />
          <input
            type="text"
            name="note-1-6"
            disabled={currentRow !== 0}
            maxLength={1}
            value={guess[0][5] || ""}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              playSequence(answer, guess, 0);
            }}
          >
            <FontAwesomeIcon icon={faPlay} />
          </button>
        </div>
        <div>
          <input
            type="text"
            name="note-2-1"
            disabled={currentRow !== 1}
            maxLength={1}
            value={guess[1][0] || ""}
          />
          <input
            type="text"
            name="note-2-2"
            disabled={currentRow !== 1}
            maxLength={1}
            value={guess[1][1] || ""}
          />
          <input
            type="text"
            name="note-2-3"
            disabled={currentRow !== 1}
            maxLength={1}
            value={guess[1][2] || ""}
          />
          <input
            type="text"
            name="note-2-4"
            disabled={currentRow !== 1}
            maxLength={1}
            value={guess[1][3] || ""}
          />
          <input
            type="text"
            name="note-2-5"
            disabled={currentRow !== 1}
            maxLength={1}
            value={guess[1][4] || ""}
          />
          <input
            type="text"
            name="note-2-6"
            disabled={currentRow !== 1}
            maxLength={1}
            value={guess[1][5] || ""}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              playSequence(answer, guess, 1);
            }}
          >
            <FontAwesomeIcon icon={faPlay} />
          </button>
        </div>
        <div>
          <input
            type="text"
            name="note-3-1"
            disabled={currentRow !== 2}
            maxLength={1}
            value={guess[2][0] || ""}
          />
          <input
            type="text"
            name="note-3-2"
            disabled={currentRow !== 2}
            maxLength={1}
            value={guess[2][1] || ""}
          />
          <input
            type="text"
            name="note-3-3"
            disabled={currentRow !== 2}
            maxLength={1}
            value={guess[2][2] || ""}
          />
          <input
            type="text"
            name="note-3-4"
            disabled={currentRow !== 2}
            maxLength={1}
            value={guess[2][3] || ""}
          />
          <input
            type="text"
            name="note-3-5"
            disabled={currentRow !== 2}
            maxLength={1}
            value={guess[2][4] || ""}
          />
          <input
            type="text"
            name="note-3-6"
            disabled={currentRow !== 2}
            maxLength={1}
            value={guess[2][5] || ""}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              playSequence(answer, guess, 2);
            }}
          >
            <FontAwesomeIcon icon={faPlay} />
          </button>
        </div>
        <div>
          <input
            type="text"
            name="note-4-1"
            disabled={currentRow !== 3}
            maxLength={1}
            value={guess[3][0] || ""}
          />
          <input
            type="text"
            name="note-4-2"
            disabled={currentRow !== 3}
            maxLength={1}
            value={guess[3][1] || ""}
          />
          <input
            type="text"
            name="note-4-3"
            disabled={currentRow !== 3}
            maxLength={1}
            value={guess[3][2] || ""}
          />
          <input
            type="text"
            name="note-4-4"
            disabled={currentRow !== 3}
            maxLength={1}
            value={guess[3][3] || ""}
          />
          <input
            type="text"
            name="note-4-5"
            disabled={currentRow !== 3}
            maxLength={1}
            value={guess[3][4] || ""}
          />
          <input
            type="text"
            name="note-4-6"
            disabled={currentRow !== 3}
            maxLength={1}
            value={guess[3][5] || ""}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              playSequence(answer, guess, 3);
            }}
          >
            <FontAwesomeIcon icon={faPlay} />
          </button>
        </div>
        <div>
          <input
            type="text"
            name="note-5-1"
            disabled={currentRow !== 4}
            maxLength={1}
            value={guess[4][0] || ""}
          />
          <input
            type="text"
            name="note-5-2"
            disabled={currentRow !== 4}
            maxLength={1}
            value={guess[4][1] || ""}
          />
          <input
            type="text"
            name="note-5-3"
            disabled={currentRow !== 4}
            maxLength={1}
            value={guess[4][2] || ""}
          />
          <input
            type="text"
            name="note-5-4"
            disabled={currentRow !== 4}
            maxLength={1}
            value={guess[4][3] || ""}
          />
          <input
            type="text"
            name="note-5-5"
            disabled={currentRow !== 4}
            maxLength={1}
            value={guess[4][4] || ""}
          />
          <input
            type="text"
            name="note-5-6"
            disabled={currentRow !== 4}
            maxLength={1}
            value={guess[4][5] || ""}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              playSequence(answer, guess, 4);
            }}
          >
            <FontAwesomeIcon icon={faPlay} />
          </button>
        </div>
        <div>
          <input
            type="text"
            name="note-6-1"
            disabled={currentRow !== 5}
            maxLength={1}
            value={guess[5][0] || ""}
          />
          <input
            type="text"
            name="note-6-2"
            disabled={currentRow !== 5}
            maxLength={1}
            value={guess[5][1] || ""}
          />
          <input
            type="text"
            name="note-6-3"
            disabled={currentRow !== 5}
            maxLength={1}
            value={guess[5][2] || ""}
          />
          <input
            type="text"
            name="note-6-4"
            disabled={currentRow !== 5}
            maxLength={1}
            value={guess[5][3] || ""}
          />
          <input
            type="text"
            name="note-6-5"
            disabled={currentRow !== 5}
            maxLength={1}
            value={guess[5][4] || ""}
          />
          <input
            type="text"
            name="note-6-6"
            disabled={currentRow !== 5}
            maxLength={1}
            value={guess[5][5] || ""}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              playSequence(answer, guess, 5);
            }}
          >
            <FontAwesomeIcon icon={faPlay} />
          </button>
        </div>

        <button type="submit">Submit</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {message && <div className={styles.modal}>{message}</div>}
    </>
  );
}

export default Board;
