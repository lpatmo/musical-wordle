import React, { useEffect, useState, useCallback, useContext } from "react";
import styles from "./Board.module.css";
import { playNote, playSequence, playCelebrationSequence } from "./helpers/playMusic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import Piano from "./Piano";
import VolumeContext from './contexts/VolumeContext'
import Modal from './Modal';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ShareResults from './ShareResults'
import ModalStats from './ModalStats';
import MidnightContext from './contexts/MidnightContext';

function Board({ answer, handleReset }) {
  const volume = useContext(VolumeContext);
  const [guess, setGuess] = useState(new Array(6).fill(""));
  const [currentRow, setCurrentRow] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [shareOutput, setShareOutput] = useState(
    new Array(6).fill(null).map((row) => {
      return Array(6).fill("⬛");
    })
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const {isMidnight} = useContext(MidnightContext);

  function resetBoard() {
    setGuess(new Array(6).fill(""));
    setCurrentRow(0);
    setError("");
    setMessage(null);
    setGameOver(false);
    setGameWon(false);
    setShareOutput(
      new Array(6).fill(null).map((row) => {
      return Array(6).fill("⬛");
    }))

    //Remove the colors for the bg tiles as well
    const inputTiles = document.querySelectorAll('input[name^="note-"]');
    inputTiles.forEach((element) => {
      // Remove all classes from the element
      element.classList = '';
    });
  }
  
  function updateStats(hasWon = true) {
    //Open modal
    setIsOpen(true);
    //Update game state
    setGameOver(true);

    //Update localStorage
    const numberGuesses = guess.join("").length;
    const storage = { title: answer["song"], timestamp: new Date(), guesses: hasWon ? numberGuesses / 6 : 'X' }

    if (!localStorage.getItem("perfectPitchPuzzleStats")) {
      //if localStorage does not exist
      localStorage.setItem("perfectPitchPuzzleStats", JSON.stringify([storage]));
    }
    if (JSON.parse(localStorage.getItem("perfectPitchPuzzleStats")).filter((item) => item.title === answer["song"]).length === 0) {
      //if answer is not already in localStorage, update localStorage stats
      const updatedStorage = [...JSON.parse(localStorage.getItem("perfectPitchPuzzleStats")), storage]
      localStorage.setItem("perfectPitchPuzzleStats", JSON.stringify(updatedStorage));
    }
  }

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let answerStr = answer.sequence.slice(0, 6)
        .map((noteCluster) => noteCluster.split("")[0])
        .join("");
      const guessStr = guess[currentRow];
      const answerFreqCount = getFreqCount(answerStr);

      if (guessStr === answerStr) {
        setGameWon(true);
        playCelebrationSequence(answer, volume);
        setShareOutput(shareOutput.slice(0, currentRow + 1));
        document
          .querySelectorAll(`input[name^="note-${currentRow}"]`)
          .forEach((el) => el.classList.add(styles.correct));
        setMessage(
          `🎉 Congratulations! You correctly guessed '${answer["song"]}' in ${guess.join("").length / 6
          }/${guess.length} tries!`
        );
        //Update stats and open modal
        updateStats();

      } else if (guessStr.length < 6) {
        setError("Please fill out all the notes.");
        return;
      } else if (guess.join("").length / 6 === 6) {
        playCelebrationSequence(answer, volume);
        setMessage(`Better luck next time! The song was '${answer["song"]}'.\n
        Notes: ${answerStr}`);
        updateStats(false);
      } else {
        /*If user has submitted 6 notes, play the notes when they submit*/
        playSequence(answer, guess, currentRow, volume);
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
          playNote(event.key, answer, guess[currentRow].length, volume);
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
    [answer, gameOver, currentRow, guess, handleSubmit, volume]
  );


  useEffect(() => {
    //reset board if it is midnight
    if (isMidnight) {
      resetBoard();
    }
    //listen to keyboard events
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guess, currentRow, handleSubmit, handleKeyDown, isMidnight]);

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
    setIsOpen(false);
    let stat = gameWon ? guess.join("").length / 6 : "X";
    let beginText = `Perfect Pitch Puzzle - '${answer["song"]}' ${stat}/${guess.length}\n`;
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

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item lg={12}>
        <Paper elevation={0}>
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
                    className={styles.playButton}
                    onClick={(e) => {
                      e.preventDefault();
                      playSequence(answer, guess, row, volume);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                </div>
              );
            })}

            <button type="submit" className="action">
              Submit <AudiotrackIcon className={styles.iconMusic} />
            </button>

          </form>
          {message && (
            <div className="announcement">
              <p>{message}</p>
              <ShareResults shareResults={shareResults} />
              <button onClick={() => setShowStatsModal(true)}>Show Stats</button>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {isOpen && (
            <Modal shareResults={shareResults} handleClose={() => setIsOpen(false)}><h4>{message}</h4></Modal>
          )}
          {showStatsModal && <ModalStats setIsOpen={setShowStatsModal}/>}
        </Paper>
        <Paper elevation={0}>
          <Piano handlePianoPress={handlePianoPress} />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Board;
