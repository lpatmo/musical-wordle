import React, { useEffect, useState, useCallback, useContext } from "react";
import styles from "./Board.module.css";
import { playNote, playSequence, playCelebrationSequence, playSequenceFrenchHorn } from "./helpers/playMusic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import HeadphonesIcon from '@mui/icons-material/Headphones';
import PianoNew from "./PianoNew";
import VolumeContext from './contexts/VolumeContext'
import Modal from './Modal';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ModalStats from './ModalStats';
import MidnightContext from './contexts/MidnightContext';
import getNote from './helpers/getNote'


function Board({ answer, testMode }) {
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
  const [difficultyMode, setDifficultyMode] = useState('normal')
  const [isOpen, setIsOpen] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const { isMidnight } = useContext(MidnightContext);
  let octave = +answer?.sequence[(guess[currentRow].length / 2)].slice(-1);
  //after the sixth note, show the octave from the sixth note and not the seventh 
  if (guess[currentRow].length === 12) {
    //console.log('reached last note')
    octave = +answer?.sequence[5].slice(-1);
  }

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
    //Update error
    setError("")

    //Update localStorage
    const numberGuesses = guess.join("").length / 12;
    const storage = { title: answer["song"], timestamp: new Date(), guesses: hasWon ? numberGuesses : 'X' }

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
      if (guess[currentRow].length === 0) {
        setError("Please guess a note.")
        return;
      }
      let answerArr = answer.sequence.slice(0, 6)
        .map((noteCluster) => {
          noteCluster = noteCluster.slice(0, -1)
          if (noteCluster.length === 1) {
            noteCluster += '.'
          }
          return noteCluster;
        });
      //console.log('answerArr', answerArr)
      const guessArr = guess[currentRow].match(/.{1,2}/g);
      //console.log('guessArr', guessArr)
      const answerFreqCount = getFreqCount(answerArr);
      const guessAttempts = guess.join("").length / 12

      if (guessArr.join("") === answerArr.join("")) {
        setGameWon(true);
        playCelebrationSequence(answer, volume);
        setShareOutput(shareOutput.slice(0, currentRow + 1));
        document
          .querySelectorAll(`input[name^="note-${currentRow}"]`)
          .forEach((el) => el.classList.add(styles.correct));
        setMessage(
          `🎉 Congratulations! You correctly guessed '${answer["song"]}' in ${guessAttempts}/${guess.length} tries${difficultyMode !== 'normal' ? ` in ${difficultyMode} mode` : ''}!`
        );
        //Update stats and open modal
        updateStats();

      } else if (guessArr.length < 6) {
        setError("Please fill out all the notes in the row before submitting.");
        return;
      } else if (guessAttempts === 6) {
        playCelebrationSequence(answer, volume);
        setMessage(`Better luck next time! The song was '${answer["song"]}'.\n
        Notes: ${answerArr.join("").replace(/\./g, "")}`);
        updateStats(false);
      } else {
        /*If user has submitted 6 notes, play the notes when they submit*/
        playSequence(answer, guess, currentRow, volume);
        /*Increment the row*/
        setCurrentRow(currentRow + 1);
        setError("Please try again");
      }
      //console.log('currentRow is', currentRow)
      /* Check for correct notes */
      for (let i = 0; i < guessArr.length; i++) {
        if (guessArr[i] === answerArr[i]) {
          shareOutput[currentRow][i] = "🟩";
          document
            .querySelector(`input[name="note-${currentRow}-${i}"]`)
            .classList.add(styles.correct);
          answerFreqCount[answerArr[i]] -= 1;
          answerArr[i] = "X.";
        }
      }

      /*Check for misplaced notes and wrong notes */
      for (let i = 0; i < guessArr.length; i++) {
        if (
          answerArr.join("").includes(guessArr[i]) &&
          answerArr[i] !== "X." &&
          answerFreqCount[guessArr[i]] > 0
        ) {
          shareOutput[currentRow][i] = "🟨";
          document
            .querySelector(`input[name="note-${currentRow}-${i}"]`)
            .classList.add(styles.misplaced);
          answerFreqCount[guessArr[i]] -= 1;
        } else if (answerArr[i] !== "X.") {
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
          const updatedGuess = guess.map((guessArr, i) => {
            if (i === currentRow) {
              return guessArr.slice(0, guessArr.length - 2);
            } else {
              return guessArr;
            }
          });
          setGuess(updatedGuess);
          setError("");
          break;
        case isNote(event.key):
          /*Update guess state after valid note*/
          let note = getNote(event, answer?.hasFlats);
          //console.log("note", note)
          if (note[1] === "b") {
            note = note[0].toUpperCase() + note[1];
          } else {
            note = note.toUpperCase();
          }
          if (guess[currentRow].length < 12) {
            setGuess(
              guess.map((guessNote, i) => {
                if (i === currentRow) {
                  return guessNote + note;
                } else {
                  return guessNote;
                }
              })
            );
            setError("")
          } else {
            setError("Please submit your guess or hit backspace")
          }

          /*Play the note in the same octave as the corresponding answer*/
          playNote(note, answer, guess[currentRow].length / 2, volume);
          //setError("");
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
    //console.log('isNote str', str)
    return str.length <= 2 && "abcdefg".includes(str[0].toLowerCase());
  }

  function getFreqCount(noteSeq) {
    let freq = {};
    for (let i = 0; i < noteSeq.length; i++) {
      //let character = noteSeq.charAt(i);
      let character = noteSeq[i]
      if (freq[character]) {
        freq[character]++;
      } else {
        freq[character] = 1;
      }
    }
    return freq;
  }
  function handlePianoPress(note) {
    //console.log('note', note)
    handleKeyDown({ key: note });
  }
  function shareResults() { //TODO: Refactor shareOutput to be calculated here without using state
    setIsOpen(false);
    let stat = gameWon ? guess.join("").length / 12 : "X";
    let beginText = `Perfect Pitch Puzzle - '${answer["song"]}' ${stat}/${guess.length} ${difficultyMode !== 'normal' ? `in ~${difficultyMode}~ mode` : ""}\n`;
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
      <Grid item xl={4} lg={5} md={7} className={styles.left}>
        <Paper elevation={0}>
          <button type="button" className={styles.action}
            onClick={() => {
              if (difficultyMode === "tricky") {
                playSequenceFrenchHorn(answer, undefined, undefined, volume);
              } else {
                playSequence(answer, undefined, undefined, volume);
              }
            }
            }>
            <FontAwesomeIcon icon={faPlay} /> Play the tune</button>
          <form className={styles.board} onSubmit={handleSubmit}>
            {guess.map((char, row) => {
              //char is the same thing as guess[row]
              return (
                <div key={row} className={styles.row}>
                  {[0, 1, 2, 3, 4, 5].map((column) => {
                    return (
                      <input
                        key={column}
                        type="text"
                        name={`note-${row}-${column}`}
                        disabled={currentRow !== row}
                        maxLength={1}
                        value={char.slice(column * 2, 2 * (column + 1)).split(".")[0] || ""}
                        tabIndex={-1}
                        readOnly
                      />
                    );
                  })}
                  {difficultyMode === 'normal' &&
                    <button
                      className={styles.playButton}
                      onClick={(e) => {
                        e.preventDefault();
                        if (guess[row].length === 0) {
                          setError("Please guess a note.")
                        } else {
                          playSequence(answer, guess, row, volume);
                        }
                      }}
                    >
                      <HeadphonesIcon />
                    </button>
                  }

                </div>
              );
            })}

            <button type="submit" className={styles.submit}>
              Submit <AudiotrackIcon className={styles.iconMusic} />
            </button>

          </form>
          {/* {message && (
            <div className="announcement">
              <p>{message}</p>
              <ShareResults shareResults={shareResults} />
              <button onClick={() => setShowStatsModal(true)}>Show Stats</button>
            </div>
          )} */}
          {isOpen && (
            <Modal shareResults={shareResults} handleClose={() => setIsOpen(false)}><h4>{message}</h4></Modal>
          )}
          {showStatsModal && <ModalStats setIsOpen={setShowStatsModal} />}
        </Paper>
        <div className={styles.errorWrapper}>
          <div className={styles.error}>{error}</div>
        </div>
      </Grid>
      <Grid item xl={4} lg={5} md={7} className={styles.right}>
        <PianoNew handlePianoPress={handlePianoPress} octave={octave} hasFlats={answer?.hasFlats} />
        <hr />
        <p><strong>Difficulty Mode (beta)</strong></p>
        {/* <Select
          labelId="difficulty-mode"
          id="difficulty-mode"
          value={difficultyMode}
          label="Difficult Mode"
          onChange={(e) => setDifficultyMode(e.target.value)}
          className={styles.difficultyMode}
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="difficult">Difficult - the "play my guess" buttons are gone</MenuItem>
          <MenuItem value="tricky">Tricky - we play the tune in French Horn; you play back in piano</MenuItem>
        </Select> */}
        <select onChange={(e) => setDifficultyMode(e.target.value)} className={styles.difficultyMode}>
          <option value="normal">Normal</option>
          <option value="difficult">Difficult - the "play my guess" buttons are gone</option>
          <option value="tricky">Tricky - we play the tune in French Horn; you guess the notes in piano</option>
        </select>
        {testMode &&
          <>
            <p>Guess: {JSON.stringify(guess, 0, 2)}</p>
            <p>answer.sequence: {JSON.stringify(answer?.sequence, 0, 2)}</p>
            <p>octave: {octave}</p>
          </>
        }
      </Grid>

    </Grid>
  );
}

export default Board;
