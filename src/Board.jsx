import React, { useEffect, useState, useCallback, useContext } from "react";
import styles from "./Board.module.css";
import { playNote, playSequence, playCelebrationSequence, stopAll, changeVolume } from "./helpers/playMusic";
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
import ShareResults from './ShareResults'
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import getInstrument from './helpers/getInstrument';
import {instrumentMapping} from './helpers/getInstrument';


function Board({ answer, testMode }) {
  const volume = useContext(VolumeContext);
  const modesToTiles = {
    'easy': 6,
    'normal': 6,
    'hard': 8
  }
  const [currentRow, setCurrentRow] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [playTuneTries, setPlayTuneTries] = useState(3);
  const [instrument, setInstrument] = useState("acoustic_grand_piano")
  const [difficultyMode, setDifficultyMode] = useState('normal')
  const [isOpen, setIsOpen] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const { isMidnight } = useContext(MidnightContext);

  const [numberTiles, setNumberTiles] = useState(modesToTiles[difficultyMode]);
  const [shareOutput, setShareOutput] = useState(
    new Array(numberTiles).fill(null).map((row) => {
      return Array(numberTiles).fill("⬛");
    })
  );
  const [guess, setGuess] = useState(new Array(6).fill(""));
  const guessAttempts = guess.filter((row) => row.length === numberTiles * 2).length



  let octave = +answer?.sequence[(guess[currentRow].length / 2)].slice(-1);
  //after the sixth note, show the octave from the sixth note and not the seventh 
  if (guess[currentRow].length === (numberTiles * 2)) {
    //console.log('reached last note')
    octave = +answer?.sequence[5].slice(-1);
  }

  function resetBoard() {
    stopAll();
    setGuess(new Array(6).fill(""));
    setCurrentRow(0);
    setError("");
    setMessage(null);
    setGameOver(false);
    setGameWon(false);
    setShareOutput(
      new Array(numberTiles).fill(null).map((row) => {
        return Array(numberTiles).fill("⬛");
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
    const storage = { title: answer["song"], timestamp: new Date(), guesses: hasWon ? guessAttempts : 'X' }

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
      let answerArr = answer.sequence.slice(0, numberTiles)
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

      if (guessArr.join("") === answerArr.join("")) {
        setGameWon(true);
        playCelebrationSequence(instrument, answer, volume);
        setShareOutput(shareOutput.slice(0, currentRow + 1));
        document
          .querySelectorAll(`input[name^="note-${currentRow}"]`)
          .forEach((el) => el.classList.add(styles.correct));
        setMessage(
          `🎉 Congratulations! You correctly guessed Song #${answer["id"]}: '${answer["song"]}' in ${guessAttempts}/${guess.length} tries${difficultyMode !== 'normal' ? ` in ${difficultyMode} mode` : ''}!`
        );
        //Update stats and open modal
        updateStats();

      } else if (guessArr.length < numberTiles) {
        setError("Please fill out all the notes in the row before submitting.");
        return;
      } else if (guessAttempts === 6) {
        playCelebrationSequence(instrument, answer, volume);
        setMessage(`Better luck next time! The song was '${answer["song"]}'.\n
        Notes: ${answerArr.join("").replace(/\./g, "")}`);
        updateStats(false);
      } else {
        /*If user has submitted numberTiles notes, play the notes when they submit*/
        playSequence(instrument, answer, guess, currentRow, numberTiles, volume);
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
    [answer, currentRow, guess, instrument]
  );

  const handleKeyDown = useCallback(
    (event) => {
      switch (true) {
        case gameOver:
          /*Do not accept user input if game is over */
          break;
        case event.key === "Backspace":
          /*if easy mode and only first tile guessed, return*/
          if (difficultyMode === 'easy' && guess[currentRow].length === 2) {
            return;
          }
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
     
          if (note[1] === "b") {
            note = note[0].toUpperCase() + note[1];
          } else {
            note = note.toUpperCase();
          }

          //console.log("note", note)
          //highlight piano keyboard notes
          const keyboardHasFlats = answer?.hasFlats;
          const whiteNoteStr = `${note[0]}`;
          const sharpNoteStr = `${note[0]}sharp`;
          const flatNoteStr = `${note[0]}flat`;
          setTimeout(() => {
            if (note[1] === '.') {
              document.getElementById(whiteNoteStr).classList.add('activeWhite')
            } else {
              if (keyboardHasFlats) {
                document.getElementById(flatNoteStr).classList.add('activeBlack')
              } else {
                document.getElementById(sharpNoteStr).classList.add('activeBlack')
              }
            }
          }, 0)

          setTimeout(() => {
            if (note[1] === '.') {
              document.getElementById(whiteNoteStr).classList.remove('activeWhite')
            } else {
              if (keyboardHasFlats) {
                document.getElementById(flatNoteStr).classList.remove('activeBlack')
              } else {
                document.getElementById(sharpNoteStr).classList.remove('activeBlack')
              }
            }
          }, 200)
  
          if (guess[currentRow].length < (numberTiles * 2)) {
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
          playNote(instrument, note, answer, guess[currentRow].length / 2, numberTiles, volume);
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
    [answer, gameOver, currentRow, guess, handleSubmit, volume, numberTiles, instrument]
  );


  useEffect(() => {
    //reset board if it is midnight
    if (isMidnight) {
      resetBoard();
    }
    //Change the volume if it changes
    if (volume === 0) {
      changeVolume(volume);
    }
    setNumberTiles(modesToTiles[difficultyMode])

    //listen to keyboard events
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guess, currentRow, handleSubmit, handleKeyDown, isMidnight, difficultyMode, volume]);

  useEffect(() => {
        //easy mode 
        if (difficultyMode === "easy") {
          const updatedGuess = guess.map(() => { 
            if (answer.sequence[0][1] !== '#' && answer.sequence[0][1] !== 'b') {
              return answer.sequence[0][0] + '.'
            } else {
              return answer.sequence.slice(0,2);
            } 
          });
          setGuess(updatedGuess);
          // console.log(document.querySelectorAll('div input[name^="note-"]:first'));
        }
  }, [difficultyMode])

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
    let stat = gameWon ? guessAttempts : "X";
    let beginText = `Perfect Pitch Puzzle - Song #${answer["id"]} ${stat}/${guess.length}${difficultyMode !== 'normal' ? ` in ${difficultyMode.toUpperCase()} mode` : ""} - ${getInstrument(instrument)} 🎵\n`;
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

          <div className={styles.buttons}>
          <button type="button" className={styles.action}
            onClick={(e) => {
              if (difficultyMode === "hard") {
                if (playTuneTries === 0) {
                  e.preventDefault();
                  setError("You've maxed out the number of times you can play the tune")
                  return;
                }
                setPlayTuneTries(playTuneTries - 1);
              }
              playSequence(instrument, answer, undefined, undefined, numberTiles, volume);
            }
            }>
            <FontAwesomeIcon icon={faPlay} /> Play the tune {difficultyMode === 'hard' && `- ${playTuneTries} plays left`}</button>
            <button type="submit" className={styles.submitMobile} onClick={handleSubmit}>
              Submit
            </button>
          </div>

          <form className={styles.board} onSubmit={handleSubmit}>
            {guess.map((char, row) => {
              //char is the same thing as guess[row]
              const myRow = [];
              for (let i=0; i<numberTiles; i++) {
                myRow.push(i);
              }
              return (
                <div key={row} className={styles.row}>
                  {myRow.map((column) => {
                    return (
                      <input
                        key={column}
                        type="text"
                        name={`note-${row}-${column}`}
                        disabled={currentRow !== row || (difficultyMode === 'easy' && column === 0) }
                        maxLength={1}
                        value={char.slice(column * 2, 2 * (column + 1)).split(".")[0] || ""}
                        tabIndex={-1}
                        readOnly
                      />
                    );
                  })}
                  {(difficultyMode === 'normal' || difficultyMode === 'easy') &&
                    <button
                      className={styles.playButton}
                      onClick={(e) => {
                        e.preventDefault();
                        if (guess[row].length === 0) {
                          setError("Please guess a note.")
                        } else {
                          playSequence(instrument, answer, guess, row, numberTiles, volume);
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
          {message && (
            <div className="announcement">
              <p>{message}</p>
              <ShareResults shareResults={shareResults} />
              <button onClick={() => setShowStatsModal(true)}>Show Stats</button>
            </div>
          )}
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
        <section className={styles.settings}>
          <div>
            <InputLabel variant="standard" htmlFor="instrument">
              Instrument 
            </InputLabel>
            <NativeSelect
              defaultValue="acoustic_grand_piano"
              inputProps={{
                name: 'instrument',
                id: 'instrument',
              }}
              onChange={(e) => setInstrument(e.target.value)}
              sx={{ fontSize: '1.6rem', mr: '2em' }}
            >
              {Object.keys(instrumentMapping).map((instrument) => {
                return  <option value={instrument} key={instrument}>{instrumentMapping[instrument]}</option>
              })}
            </NativeSelect>
          </div>
          <div>
            <InputLabel variant="standard" htmlFor="difficulty">
              Difficulty
            </InputLabel>
            <NativeSelect
              defaultValue={difficultyMode}
              inputProps={{
                name: 'difficulty',
                id: 'difficulty',
              }}
              onChange={(e) => {
                setDifficultyMode(e.target.value); 
                  resetBoard();
              }}
              sx={{ fontSize: '1.6rem' }}
              disabled={gameOver}
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </NativeSelect>
          </div>
        </section>
        {testMode &&
          <>
            <p>Guess: {JSON.stringify(guess, 0, 2)}</p>
            <p>answer.sequence: {JSON.stringify(answer?.sequence, 0, 2)}</p>
            <p>octave: {octave}</p>
          </>
        }
        {/* <p className={styles.discordLink}>Join us on <a href="https://discord.gg/8k3zA8nbsE" target="_blank" referrer="no-referrer" className="discordIcon">Discord</a></p> */}
      </Grid>
    </Grid>
  );
}

export default Board;
