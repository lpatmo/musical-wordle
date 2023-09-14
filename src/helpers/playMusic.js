import { Soundfont } from "smplr";

const context = new AudioContext();

const instrumentsObj = {};
const instrumentsArr = ["acoustic_grand_piano", "violin", "french_horn", "choir_aahs", "acoustic_guitar_steel", "bird_tweet", "flute"]

for (let i = 0; i < instrumentsArr.length; i++) {
    instrumentsObj[instrumentsArr[i]] = new Soundfont(context, { instrument: instrumentsArr[i] });
}

function stopAll() {
    instrumentsArr.forEach((instrument) => {
        instrumentsObj[instrument].stop();
    })
}

/**
 * Plays a sequence of notes in piano
 * @params {string} selectedInstrument
 * @params {object} answer
 * @params {array} guess
 * @params {integer} currentRow
 * @params {integer} volume
 * @return 
 */
export function playSequence(selectedInstrument, answer, guess, currentRow, volume) {
    //console.log('====answer and guess and currentRow, volume', answer, guess, currentRow, volume)
    //Stop any previous melodies from playing
    stopAll();
    const instrument = instrumentsObj[selectedInstrument];
    instrument.output.setVolume(volume * 35);
    instrument.loaded().then(() => {
        const now = context.currentTime;

        answer.sequence.slice(0, 6).forEach((note, i) => {
            const transformedNote = guess !== undefined && guess[currentRow][i * 2] !== '' ? guess[currentRow].slice(i * 2, 2 * (i + 1)).split('.')[0] + note.slice(-1) : note;
            //console.log('====transformedNote', transformedNote) 
            instrument.start(
                {
                    note: transformedNote,
                    time: now + answer.duration.slice(0, i).reduce((a, b) => a + b, 0) / 4,
                    duration: answer.duration[i] / 4
                }
            );
        });
    })

    return;
}

/**
 * Play celebration
 * @params {string} selectedInstrument
 * @params {object} answer
 * @params {integer} volume
 * @return 
 */

export function playCelebrationSequence(selectedInstrument, answer, volume) {
    //Stop any previous melodies from playing
    stopAll();
    const instrument = instrumentsObj[selectedInstrument];
    instrument.output.setVolume(volume * 35);
    instrument.loaded().then(() => {
        const now = context.currentTime;
        answer.sequence.forEach((note, i) => {
            instrument.start({ note, time: now + answer.duration.slice(0, i).reduce((a, b) => a + b, 0) / 4, duration: answer.duration[i] / 4 });
        });
    })
    return;
}

/**
 * Plays a single note
 * @params {string} selectedInstrument
 * @params {string} note
 * @params {object} answer
 * @params {integer} currentRow
 * @params {integer} volume
 * @params {integer} octave
 * @return 
 */

export function playNote(selectedInstrument, note, answer, currentNote, volume, octave=answer.sequence[currentNote].slice(-1)) {
    //Stop any previous melodies from playing
    stopAll();
    const instrument = instrumentsObj[selectedInstrument];
    instrument.output.setVolume(volume * 35);
    console.log('note', note)
    console.log('answer', answer)
    console.log('currentNote', currentNote)
    console.log('volume', volume)
    if (currentNote === 6) {
        return;
    }
    //If we are passing down "X." as the note, remove the '.'
    if (note.slice(-1) === ".") {
        note = note[0];
    }

    instrument.loaded().then(() => {
        //If octave is passed in as an optional param, get it from that; otherwise, get it from the octave.
        //const oct = octave || answer.sequence[currentNote].slice(-1);
        const now = context.currentTime;
        instrument.start({ note: `${note}${octave}`, time: now, duration: 0.5 });
    })
    return;
}
