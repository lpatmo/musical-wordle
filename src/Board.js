import React, { useEffect, useState, useCallback, useContext } from "react";
import styles from "./Board.module.css";
import { playNote, playSequence } from "./helpers/playMusic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faCircleRight,
  faX,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import Piano from "./Piano";
import VolumeContext from './AppContext'

function Board({ answer }) {
  const volume = useContext(VolumeContext);
  console.log('volume from board', volume)
  const [guess, setGuess] = useState(new Array(6).fill(""));
  const [currentRow, setCurrentRow] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [shareOutput, setShareOutput] = useState(
    new Array(6).fill(null).map((row) => {
      return Array(6).fill("⬛");
    })
  );

  function getVolume() {
    console.log('VOLUME INSIDE BOARD', volume)
    return volume;
  }

  const [answerVisible, setAnswerVisible] = useState(false);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let answerStr = answer.sequence
        .map((noteCluster) => noteCluster.split("")[0])
        .join("");

      const guessStr = guess[currentRow];
      const answerFreqCount = getFreqCount(answerStr);

      if (guessStr === answerStr) {
        setGameWon(true);
        setGameOver(true);
        playSequence(answer, guess, currentRow, getVolume);
        setShareOutput(shareOutput.slice(0, currentRow + 1));
        document
          .querySelectorAll(`input[name^="note-${currentRow}"]`)
          .forEach((el) => el.classList.add(styles.correct));
        setMessage(
          `Congratulations! You correctly guessed '${answer["song"]}' in ${
            guess.join("").length / 6
          }/${guess.length} tries!`
        );
        window.addEventListener("click", removeModal);
      } else if (guessStr.length < 6) {
        setError("Please fill out all the notes.");
        return;
      } else if (guess.join("").length / 6 === 6) {
        setGameOver(true);
        setMessage(`Better luck next time! The song was '${answer["song"]}'.\n
        Notes: ${answerStr}`);
        window.addEventListener("click", removeModal);
      } else {
        /*If user has submitted 6 notes, play the notes when they submit*/
        playSequence(answer, guess, currentRow, getVolume);
        /*Increment the row*/
        setCurrentRow(currentRow + 1);
        setError("Please try again");
      }
      /* Check for correct notes */
      for (let i = 0; i < guessStr.length; i++) {
        if (guessStr[i] === answerStr[i]) {
          shareOutput[currentRow][i] = "🟩";
          document
            .querySelector(`input[name="note-${currentRow}-${i}"]`)
            .classList.add(styles.correct);
          answerFreqCount[answerStr[i]] -= 1;
          answerStr = answerStr.split("");
          answerStr[i] = "X";
          answerStr = answerStr.join("");
        }
      }

      /*Check for misplaced notes and wrong notes */
      for (let i = 0; i < guessStr.length; i++) {
        if (
          answerStr.includes(guessStr[i]) &&
          answerStr[i] !== "X" &&
          answerFreqCount[guessStr[i]] > 0
        ) {
          shareOutput[currentRow][i] = "🟨";
          document
            .querySelector(`input[name="note-${currentRow}-${i}"]`)
            .classList.add(styles.misplaced);
          answerFreqCount[guessStr[i]] -= 1;
        } else if (answerStr[i] !== "X") {
          document
            .querySelector(`input[name="note-${currentRow}-${i}"]`)
            .classList.add(styles.incorrect);
        }
      }
    },
    [answer, currentRow, guess]
  );

  const handleKeyDown = useCallback(
    (event) => {
      switch (true) {
        case gameOver:
          /*Do not accept user input if game is over */
          break;
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
          playNote(event.key, answer, guess[currentRow].length, getVolume);
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
    },
    [answer, gameOver, currentRow, guess, handleSubmit]
  );
  const removeModal = useCallback((event) => {
    setMessage("");
    window.removeEventListener("click", removeModal);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guess, currentRow, handleSubmit, handleKeyDown]);

  function isNote(str) {
    return str.length === 1 && "abcdefg".includes(str.toLowerCase());
  }

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
  function shareResults() { //TODO: Refactor shareOutput to be calculated here without using state
    let stat = gameWon ? guess.join("").length / 6 : "X";
    let beginText = `Musical Wordle - '${answer["song"]}' ${stat}/${guess.length}\n`;
    navigator.clipboard
      .writeText(
        beginText +
          shareOutput
            .map((row) => {
              return row.join("");
            })
            .join("\n")
      )
      .then(() => {
        alert("Copied results to clipboard");
      })
      .catch(() => {
        alert("Failed to copy results to clipboard");
      });
  }

  function toggleAnswer(){
    setAnswerVisible(!answerVisible);
  }

  return (
    <>
      <form className={styles.board} onSubmit={handleSubmit}>
        {guess.map((char, row) => {
          return (
            <div key={row}>
              {[0, 1, 2, 3, 4, 5].map((column) => {
                return (
                  <input
                    key={column}
                    type="text"
                    name={`note-${row}-${column}`}
                    disabled={currentRow !== row}
                    maxLength={1}
                    value={guess[row][column] || ""}
                    tabIndex={-1}
                    readOnly
                  />
                );
              })}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  playSequence(answer, guess, row, getVolume);
                }}
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
            </div>
          );
        })}
        <button type="submit">
          Submit <FontAwesomeIcon icon={faCircleRight} />
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {message && (
        <div className={styles.modal}>
          <button className={styles.modalXClose} onClick={removeModal}>
            <FontAwesomeIcon icon={faX} />
          </button>
          <p>{message}</p>
          <button className={styles.modalCloseBtn} onClick={removeModal}>
            Close
          </button>
          <button
            className="shareButton"
            onClick={() => {
              shareResults();
            }}
          >
            Share <FontAwesomeIcon icon={faShareAlt}></FontAwesomeIcon>
          </button>
        </div>
      )}
      {message && <div className={styles.modalOverlay}></div>}

      <Piano handlePianoPress={handlePianoPress} />
      <button className={styles.answerButton} onClick={toggleAnswer}>{answerVisible ? "Hide answer":"Show answer"}</button>
      {answerVisible && <div className={styles.answerBox}>
        <p>Guess: {JSON.stringify(guess)}</p>
        <p>Answer: {JSON.stringify(answer)}</p>
      </div>
      }
    </>
  );
}

export default Board;
